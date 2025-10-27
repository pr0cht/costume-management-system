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

ipcMain.handle('get-clients', (event) => {
  try {
    const stmt = db.prepare('SELECT * FROM Client');
    const clients = stmt.all();

    return { success: true, data: clients };
  } catch (err) {
    console.error("Database Error in main.js:", err.message);
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

// processes

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


