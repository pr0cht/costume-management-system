const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require("path");
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'db', 'cms.db');
const db = new Database(dbPath);
db.pragma(`busy_timeout = 5000`)

app.disableHardwareAcceleration();
app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'cms_icon.ico'),
    title: "Costume Management System",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const isDev = process.env.NODE_ENV !== 'production';
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile('frontend/dist/index.html');

  mainWindow.on('closed', () => {
    app.quit();
  });
    const tray = new Tray('frontend/dist/assets/tray_icon.jpg');
    const contextMenu = require('electron').Menu.buildFromTemplate([
    {
        label: 'Show App',
        click: () => {
        mainWindow.show();
        }
    },
    {
        label: 'Quit',
        click: () => {
        app.quit();
        }
    }
    ]);

    tray.setToolTip('Costume Management System');
    tray.setContextMenu(contextMenu);
});

app.on('will-quit', () => {
  db.close();
});

// Database handlers

// costume functions

const { ipcMain } = require('electron');

ipcMain.handle('add-costume', async (event, costumeData) => {
  const { name, origin, type, gender, size, price, inclusions, available, img } = costumeData;

  try {
    const imageBuffer = img ? Buffer.from(img) : null;

    const sql = `
      INSERT INTO Costume (costume_Name, costume_Origin, costume_Type, 
      costume_Size, costume_Gender, costume_Price, costume_Inclusion, 
      costume_Available, costume_Image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const stmt = db.prepare(sql);

    const result = stmt.run(
      name,
      origin,
      type,
      size,
      gender,
      price,
      inclusions,
      available ? 1 : 0,
      imageBuffer
    );
    return { success: true, lastID: result.lastInsertRowid };
  } catch (err) {
    console.error("Dtabase Error in main.js:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-costumes', (event, filters) => {
  console.log('Backend received filters:', filters);

  try {
    let baseQuery = 'SELECT * FROM Costume';
    const whereClauses = [];
    const params = [];

    if (filters?.searchTerm) {
      whereClauses.push('(costume_Name LIKE ? OR costume_Origin LIKE ?)');
      params.push(`%${filters.searchTerm}%`, `%${filters.searchTerm}%`);
    }
    if (filters?.available) {
      whereClauses.push('costume_Available = ?');
      params.push(1);
    }
    if (filters?.size) {
      whereClauses.push('costume_Size = ?');
      params.push(filters.size);
    }
    if (filters?.gender) {
      whereClauses.push('costume_Gender = ?');
      params.push(filters.gender);
    }
    if (filters?.type) {
      whereClauses.push('costume_Type = ?');
      params.push(filters.type);
    }

    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const sortableColumns = {
      name: 'costume_Name',
      price: 'costume_Price',
      availability: 'costume_Available'
    };
    const sortColumn = sortableColumns[filters?.sort] || 'costume_Name';
    const sortOrder = ['ASC', 'DESC'].includes(filters?.sortOrder?.toUpperCase()) ? filters.sortOrder.toUpperCase() : 'ASC';

    baseQuery += ` ORDER BY ${sortColumn} ${sortOrder}`;
    
    console.log('Executing SQL:', baseQuery, params);

    const stmt = db.prepare(baseQuery);
    const costumes = stmt.all(...params);

    const costumesWithImages = costumes.map(costume => {
      if (costume.costume_Image) {
        return { ...costume, costume_Image: costume.costume_Image.toString('base64') };
      }
      return costume;
    });
    
    return { success: true, data: costumesWithImages };

  } catch (err) {
    console.error("Database Error fetching costumes:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('edit-costume', async (event, costumeData) => {
  const { id, name, origin, type, gender, size, price, inclusions, available, img } = costumeData;

  try {
    let sql;
    const params = [
      name,
      origin,
      type,
      size,
      gender,
      price,
      inclusions,
      available ? 1 : 0,
    ];

    if (img) {
      sql = `
        UPDATE Costume
        SET costume_Name = ?, costume_Origin = ?, costume_Type = ?, 
            costume_Size = ?, costume_Gender = ?, costume_Price = ?, 
            costume_Inclusion = ?, costume_Available = ?, costume_Image = ?
        WHERE costume_ID = ?
      `;

      const imageBuffer = Buffer.from(img);
      params.push(imageBuffer, id);
    } else {
      sql = `
        UPDATE Costume
        SET costume_Name = ?, costume_Origin = ?, costume_Type = ?, 
            costume_Size = ?, costume_Gender = ?, costume_Price = ?, 
            costume_Inclusion = ?, costume_Available = ?
        WHERE costume_ID = ?
      `;
      params.push(id)
    }
    
    const stmt = db.prepare(sql);

    const result = stmt.run(...params);
    return { success: true, changes: result.changes };
  } catch (err) {
    console.error("Database Error in main.js:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('delete-costume', (event, id) => {
  try {
    const stmt = db.prepare('DELETE FROM Costume WHERE costume_ID = ?');

    const result = stmt.run(id);
    return { success: true, changes: result.changes };
  } catch (err) {
    console.error("Database Error in main.js", err.message);
    return { success: false, error: err.message };
  }
});

// client functions

ipcMain.handle('add-client', async (event, clientData) => {
  const { name, address, age, cellphone, socials, occupation } = clientData;

  try {
    const sql = `
      INSERT INTO Client (client_Name, client_Address, client_Age, client_Cellphone,
      client_Socials, client_Occupation)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const stmt = db.prepare(sql);

    const result = stmt.run(
      name,
      address,
      age,
      cellphone,
      socials,
      occupation
    );
    return { success: true, lastID: result.lastInsertRowid };
  } catch (err) {
    console.error("Dtabase Error in main.js:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('getClientsSummary', (event, filters) => {
  try {
    let baseQuery = `
      SELECT 
        C.*, /* Select all columns from Client */
        SUM(CASE WHEN R.costume_Returned = 0 THEN 1 ELSE 0 END) AS rented_count,
        SUM(CASE WHEN R.costume_Returned = 0 AND T.balance > 0 THEN 1 ELSE 0 END) AS pending_due_count,
        COALESCE(SUM(T.balance), 0) AS total_balance_due
      FROM Client C
      LEFT JOIN Transactions T ON C.client_ID = T.client_ID
      LEFT JOIN Rents R ON T.transaction_ID = R.transaction_ID
    `;
    
    const whereClauses = [];
    const params = [];

    if (filters?.searchTerm) {
      whereClauses.push('C.client_Name LIKE ?');
      params.push(`%${filters.searchTerm}%`);
    }
    
    const havingClauses = [];
    if (filters?.hasBalance) {
      havingClauses.push('total_balance_due > 0');
    }

    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    
    baseQuery += ` GROUP BY C.client_ID `;

    if (havingClauses.length > 0) {
      baseQuery += ` HAVING ${havingClauses.join(' AND ')}`;
    }

    baseQuery += ` ORDER BY C.client_Name ASC `; 
    
    const stmt = db.prepare(baseQuery);
    const clients = stmt.all(...params);
    
    return { success: true, data: clients };

  } catch (err) {
    console.error("Database Error fetching clients summary:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('edit-client', async (event, clientData) => {
  const { id, name, address, age, cellphone, socials, occupation } = clientData;

  try {
    const sql = `
      UPDATE Client
      SET client_Name = ?, client_Address = ?, client_Age = ?, 
          client_Cellphone = ?, client_Socials = ?, client_Occupation = ?
      WHERE client_ID = ?
    `;
    const stmt = db.prepare(sql);

    const result = stmt.run(
      name,
      address,
      age,
      cellphone,
      socials,
      occupation,
      id
    );
    return { success: true, changes: result.changes };
  } catch (err) {
    console.error("Database Error in main.js:", err.message);
    return { success: false, error: err.message };
  }
});

// event functions

ipcMain.handle('add-event', async (event, eventData) => {
  const { name, date, location } = eventData;

  try {
    const sql = `
      INSERT INTO Event (event_Name, event_Date, event_Location)
      VALUES (?, ?, ?)
    `;
    
    const stmt = db.prepare(sql);

    const result = stmt.run(
      name,
      date,
      location
    );
    return { success: true, lastID: result.lastInsertRowid };
  } catch (err) {
    console.error("Dtabase Error in main.js:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-events', (event) => {
  try {
    const stmt = db.prepare('SELECT * FROM Event');
    const events = stmt.all();

    return { success: true, data: events };
  } catch (err) {
    console.error("Database Error in main.js:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-events-active', (event) => {
  try {
    const stmt = db.prepare("SELECT * FROM Event WHERE event_Date >= date('now')");
    const events = stmt.all()

    return { success: true, data: events };
  } catch (err) {
    console.error("Database Error in main.js:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-events-past', (event) => {
  try {
    const stmt = db.prepare("SELECT * FROM Event WHERE event_Date < date('now')");
    const events = stmt.all();

    return { success: true, data: events };
  } catch (err) {
    console.error("Database Error in main.js:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('edit-event', async (event, eventData) => {
  const { id, name, date, location } = eventData;

  try {
    const sql = `
      UPDATE Event
      SET event_Name = ?, event_Date = ?, event_Location = ?
      WHERE event_ID = ?
    `;
    const stmt = db.prepare(sql);

    const result = stmt.run(
      name,
      date,
      location,
      id
    );
    return { success: true, changes: result.changes };
  } catch (err) {
    console.error("Database Error in main.js:", err.message);
    return { success: false, error: err.message };
  }
});

// payment functions

ipcMain.handle('add-payment', (event, paymentData) => {
  const { transactionId, paymentAmount, paymentDate, paymentRemarks } = paymentData;

  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    return { success: false, error: "Payment amount must be a positive number." };
  }
  
  const transaction = db.transaction(() => {
    const paymentStmt = db.prepare('INSERT INTO Payment (transaction_ID, payment_Date, payment_Amount, payment_Remarks) VALUES (?, ?, ?, ?)');
    const paymentInfo = paymentStmt.run(transactionId, paymentDate, paymentAmount, paymentRemarks || 'Payment');
    const paymentId = paymentInfo.lastInsertRowid;

    const updateTransactionStmt = db.prepare(`
      UPDATE Transactions
      SET balance = balance - ?
      WHERE transaction_ID = ?
    `);
    updateTransactionStmt.run(paymentAmount, transactionId);

    return { paymentId };
  });

  try {
    const { paymentId } = transaction();
    return { success: true, paymentId };
  } catch (error) {
    console.error("Database Error processing new payment:", error.message);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-payments', (event, filters) => {
  try {
    let baseQuery = `
      SELECT 
        P.payment_ID,
        P.payment_Amount,
        P.payment_Date,
        P.payment_Remarks,
        T.transaction_ID,
        T.balance,
        C.client_ID,
        C.client_Name
      FROM Payment P
      JOIN Transactions T ON P.transaction_ID = T.transaction_ID
      JOIN Client C ON T.client_ID = C.client_ID
    `;
    
    const whereClauses = [];
    const params = [];

    if (filters?.searchTerm) {
      whereClauses.push('C.client_Name LIKE ?');
      params.push(`%${filters.searchTerm}%`);
    }
    if (filters?.withBalance) {
      whereClauses.push('T.balance > 0');
    }

    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const sortColumn = {
      date: 'P.payment_Date',
      amount: 'P.payment_Amount',
      balance: 'T.balance'
    }[filters?.sort] || 'P.payment_Date';
    
    const sortOrder = ['ASC', 'DESC'].includes(filters?.sortOrder?.toUpperCase()) ? filters.sortOrder.toUpperCase() : 'DESC'; // Default to DESC (most recent first)

    baseQuery += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const stmt = db.prepare(baseQuery);
    const payments = stmt.all(...params);
    
    return { success: true, data: payments };

  } catch (err) {
    console.error("Database Error fetching payments:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('delete-payment', (event, paymentId) => {
  const transaction = db.transaction(() => {
    const paymentInfoStmt = db.prepare(`
      SELECT 
        P.transaction_ID, P.payment_Amount
      FROM Payment P
      WHERE P.payment_ID = ?
    `);
    const payment = paymentInfoStmt.get(paymentId);

    if (!payment) {
      throw new Error("Payment record not found.");
    }

    const deletePaymentStmt = db.prepare('DELETE FROM Payment WHERE payment_ID = ?');
    deletePaymentStmt.run(paymentId);

    const updateTransactionStmt = db.prepare(`
      UPDATE Transactions
      SET balance = balance + ?
      WHERE transaction_ID = ?
    `);
    updateTransactionStmt.run(payment.payment_Amount, payment.transaction_ID);

    return { success: true };
  });

  try {
    transaction();
    return { success: true };
  } catch (error) {
    console.error("Database Error during DELETE:", error.message);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('edit-payment', (event, data) => {
  const { paymentId, newAmount, newDate, newRemarks } = data;

  if (isNaN(newAmount) || newAmount < 0) {
    return { success: false, error: "New payment amount must be a non-negative number." };
  }

  const transaction = db.transaction(() => {
    const oldPaymentStmt = db.prepare('SELECT transaction_ID, payment_Amount FROM Payment WHERE payment_ID = ?');
    const oldPayment = oldPaymentStmt.get(paymentId);

    if (!oldPayment) {
      throw new Error("Original payment record not found.");
    }

    const amountDifference = oldPayment.payment_Amount - newAmount; // Old Amount - New Amount

    const updatePaymentStmt = db.prepare(`
      UPDATE Payment
      SET payment_Amount = ?, payment_Date = ?, payment_Remarks = ?
      WHERE payment_ID = ?
    `);
    updatePaymentStmt.run(newAmount, newDate, newRemarks, paymentId);

    const updateTransactionStmt = db.prepare(`
      UPDATE Transactions
      SET balance = balance + ?
      WHERE transaction_ID = ?
    `);
    updateTransactionStmt.run(amountDifference, oldPayment.transaction_ID);

    return { success: true, transactionId: oldPayment.transaction_ID };
  });

  try {
    transaction();
    return { success: true };
  } catch (error) {
    console.error("Database Error during EDIT:", error.message);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-recent-transactions', (event) => {
  try {
    const sql = `
      SELECT 
        T.transaction_ID, 
        T.balance,
        CL.client_Name,
        T.transaction_Date 
      FROM Transactions T
      JOIN Client CL ON T.client_ID = CL.client_ID
      /* Order by Transaction Date Descending (most recent first) */
      ORDER BY T.transaction_Date DESC
    `;
    
    const stmt = db.prepare(sql);
    const transactions = stmt.all();

    return { success: true, data: transactions };
  } catch (err) {
    console.error("Database Error fetching recent transactions:", err.message);
    return { success: false, error: err.message };
  }
});

// rental functions

ipcMain.handle('get-rents-history', (event, filters) => {
  try {
    let baseQuery = `
      SELECT 
        R.rent_ID, R.rentDate, R.returnDate, R.costume_Returned, R.costume_Fee,
        C.costume_Name, C.costume_ID,
        CL.client_Name,
        T.balance,
        T.transaction_ID
      FROM Rents R
      JOIN Costume C ON R.costume_ID = C.costume_ID
      JOIN Transactions T ON R.transaction_ID = T.transaction_ID
      JOIN Client CL ON T.client_ID = CL.client_ID
    `;
    
    const whereClauses = [];
    const params = [];

    if (filters?.searchTerm) {
      whereClauses.push('CL.client_Name LIKE ? OR C.costume_Name LIKE ?');
      params.push(`%${filters.searchTerm}%`, `%${filters.searchTerm}%`);
    }

    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    baseQuery += ` 
      ORDER BY 
        R.costume_Returned ASC, 
        R.rentDate DESC,
        R.returnDate ASC
    `;

    const stmt = db.prepare(baseQuery);
    const rents = stmt.all(...params);
    
    return { success: true, data: rents };

  } catch (err) {
    console.error("Database Error fetching rent history:", err.message);
    return { success: false, error: err.message };
  }
});


ipcMain.handle('set-costume-returned', (event, rentData) => {
  const { rentId, costumeId, transactionId } = rentData;

  const transaction = db.transaction(() => {
    const updateRentStmt = db.prepare(`
      UPDATE Rents
      SET costume_Returned = 1, returnDate = date('now') 
      WHERE rent_ID = ?
    `);
    updateRentStmt.run(rentId);

    const updateCostumeStmt = db.prepare(`
      UPDATE Costume
      SET costume_Available = 1
      WHERE costume_ID = ?
    `);
    updateCostumeStmt.run(costumeId);

    return { success: true };
  });

  try {
    transaction();
    return { success: true };
  } catch (error) {
    console.error("Database Error setting costume as returned:", error.message);
    return { success: false, error: error.message };
  }
});

// Rental Processes

ipcMain.handle('get-available-costumes', (event) => {
  try {
    const stmt = db.prepare('SELECT * FROM Costume WHERE costume_Available = 1');
    const costumes = stmt.all();

    const costumesWithImages = costumes.map(costume => {
      if (costume.costume_Image) {
        return {
          ...costume, costume_Image: costume.costume_Image.toString('base64') }
        }
      return costume });

    return { success: true, data: costumesWithImages
  }} catch (error) {
    console.error("Database Error in main.js:", error.message);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('process-rental', (event, rentalData) => {
  const { clientId, costumeIds, eventId, rentalDate, returnDate, paymentAmount, paymentRemarks } = rentalData;

  const transaction = db.transaction(() => {
    const getCostumeFeeStmt = db.prepare('SELECT costume_Price FROM Costume WHERE costume_ID = ?');
    let totalCostumeFee = 0;
    for (const costumeId of costumeIds) {
      const costumeInfo = getCostumeFeeStmt.get(costumeId);
      if (!costumeInfo) {
        throw new Error(`Costume with ID ${costumeId} not found.`);
      }
      totalCostumeFee += costumeInfo.costume_Price; 
    }

    const initialBalance = totalCostumeFee - paymentAmount;
    const transactionStmt = db.prepare('INSERT INTO Transactions (client_ID, transaction_Date, balance) VALUES (?, ?, ?)');
    const info = transactionStmt.run(clientId, rentalDate, initialBalance);
    const transactionId = info.lastInsertRowid;

    const paymentStmt = db.prepare('INSERT INTO Payment (transaction_ID, payment_Date, payment_Amount, payment_Remarks) VALUES (?, ?, ?, ?)');
    if (paymentAmount > 0) { 
        paymentStmt.run(transactionId, rentalDate, paymentAmount, paymentRemarks || 'Initial Rental Payment');
    }
    const rentStmt = db.prepare(`
      INSERT INTO Rents (transaction_ID, costume_ID, costume_Fee, event_ID, rentDate, returnDate, costume_returned)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `);
    const updateCostumeStmt = db.prepare('UPDATE Costume SET costume_Available = 0 WHERE costume_ID = ?');

    for (const costumeId of costumeIds) {
      const costumeInfo = getCostumeFeeStmt.get(costumeId); 
      const costumeFee = costumeInfo.costume_Price;
      rentStmt.run(transactionId, costumeId, costumeFee, eventId, rentalDate, returnDate);
      updateCostumeStmt.run(costumeId);
    }
    return { transactionId };
  });
  try {
    const { transactionId } = transaction();
    return { success: true, transactionId: transactionId };
  } catch (error) {
    console.error("Database Error processing rental:", error.message);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-transactions-by-client', (event, clientId) => {
  try {
    const sql = `
      SELECT 
        T.transaction_ID, 
        T.balance,
        CL.client_Name,
        T.client_ID,
        T.transaction_Date 
      FROM Transactions T
      JOIN Client CL ON T.client_ID = CL.client_ID
      WHERE T.client_ID = ? /* <-- FILTER by the client ID */
      ORDER BY T.transaction_Date DESC
    `;
    
    const stmt = db.prepare(sql);
    // Use the clientId parameter to safely filter the transactions
    const transactions = stmt.all(clientId); 

    return { success: true, data: transactions };
  } catch (err) {
    console.error("Database Error fetching client transactions:", err.message);
    return { success: false, error: err.message };
  }
});


// charges

ipcMain.handle('add-charge', (event, chargeData) => {
  const { transactionId, amount, description, chargeDate } = chargeData;

  if (isNaN(amount) || amount <= 0) {
    return { success: false, error: "Charge amount must be a positive number." };
  }

  const transaction = db.transaction(() => {
    const chargeStmt = db.prepare(`
      INSERT INTO Charges (transaction_ID, charge_Date, charge_Description, charge_Amount) 
      VALUES (?, ?, ?, ?)
    `);
    const chargeInfo = chargeStmt.run(transactionId, chargeDate, description, amount);
    const chargeId = chargeInfo.lastInsertRowid;

    const updateTransactionStmt = db.prepare(`
      UPDATE Transactions
      SET balance = balance + ?
      WHERE transaction_ID = ?
    `);
    updateTransactionStmt.run(amount, transactionId);

    return { chargeId };
  });

  try {
    const { chargeId } = transaction();
    return { success: true, chargeId };
  } catch (error) {
    console.error("Database Error processing charge:", error.message);
    return { success: false, error: error.message };
  }
});

// dashboard

ipcMain.handle('get-general-stats', (event) => {
  try {
    const totalCostumesStmt = db.prepare('SELECT COUNT(costume_ID) AS total FROM Costume');
    const availableCostumesStmt = db.prepare('SELECT COUNT(costume_ID) AS available FROM Costume WHERE costume_Available = 1');
    const rentedCostumesStmt = db.prepare('SELECT COUNT(costume_ID) AS rented FROM Costume WHERE costume_Available = 0');
    const totalBalanceStmt = db.prepare('SELECT COALESCE(SUM(balance), 0) AS total_due FROM Transactions WHERE balance > 0');
    const totalClientsStmt = db.prepare('SELECT COUNT(client_ID) AS total_clients FROM Client');
    const totalRevenueStmt = db.prepare('SELECT COALESCE(SUM(payment_Amount), 0) AS total_revenue FROM Payment');

    return { 
      success: true, 
      data: {
        total: totalCostumesStmt.get().total,
        available: availableCostumesStmt.get().available,
        rented: rentedCostumesStmt.get().rented,
        totalBalanceDue: totalBalanceStmt.get().total_due,
        totalRevenue: totalRevenueStmt.get().total_revenue,
        totalClients: totalClientsStmt.get().total_clients
      }
    };
  } catch (err) {
    console.error("Dashboard Error (General Stats):", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-dashboard-lists', (event) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // 1. Unreturned/Overdue Alert (Assuming due date is returnDate)
    const returnsDueStmt = db.prepare(`
      SELECT COUNT(rent_ID) AS count 
      FROM Rents
      WHERE costume_Returned = 0 AND returnDate <= date('now')
    `);
    
    // 2. Upcoming Events Alert (Events scheduled for today or tomorrow)
    const upcomingEventsStmt = db.prepare(`
      SELECT event_Name, event_Date FROM Event
      WHERE event_Date >= date('now')
      ORDER BY event_Date ASC LIMIT 5
    `);
    
    // 3. Recently Rented Costumes (JOIN Rents, Costume, Client)
    const recentRentalsStmt = db.prepare(`
      SELECT 
        R.rentDate, C.costume_Name, CL.client_Name 
      FROM Rents R
      JOIN Costume C ON R.costume_ID = C.costume_ID
      JOIN Transactions T ON R.transaction_ID = T.transaction_ID
      JOIN Client CL ON T.client_ID = CL.client_ID
      ORDER BY R.rentDate DESC LIMIT 5
    `);
    
    // 4. Recently Added Clients
    const recentClientsStmt = db.prepare(`
      SELECT client_Name 
      FROM Client 
      ORDER BY client_ID DESC LIMIT 3
    `);

    return {
      success: true,
      data: {
        returnsDueCount: returnsDueStmt.get().count,
        upcomingEventsList: upcomingEventsStmt.all(),
        recentRentals: recentRentalsStmt.all(),
        recentClients: recentClientsStmt.all()
      }
    };
  } catch (err) {
    console.error("Dashboard Error (List Data):", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-recent-clients', (event) => {
  try {
    const recentClientsStmt = db.prepare(`
      SELECT client_ID, client_Name 
      FROM Client 
      ORDER BY client_ID DESC 
      LIMIT 5
    `);
    
    return { 
      success: true, 
      data: recentClientsStmt.all()
    };
  } catch (err) {
    console.error("Dashboard Error (Recent Clients):", err.message);
    return { success: false, error: err.message };
  }
});