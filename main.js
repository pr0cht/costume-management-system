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
  // ✅ Log what the backend receives. Check this in your TERMINAL.
  console.log('Backend received filters:', filters);

  try {
    let baseQuery = 'SELECT * FROM Costume';
    const whereClauses = [];
    const params = [];

    // --- Build WHERE clauses safely ---
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

    // --- Build ORDER BY clause safely ---
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