const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require("path");
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'db', 'cms.db');
const db = new Database(dbPath);

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 800,
    minHeight: 600,
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

ipcMain.handle('get-costumes', (event) => {
  try {
    const stmt = db.prepare('SELECT * FROM Costume');
    const costumes = stmt.all();
    const costumeWithImages = costumes.map(costume => {
      if (costume.costume_Image) {
        return{
          ...costume,
          costume_Image: costume.costume_Image.toString('base64')
        };
      }
      return costume;
  })
    return { success: true, data: costumeWithImages };
  } catch (err) {
    console.error("Database Error in main.js:", err.message);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('edit-costume', async (event, costumeData) => {
  const { id, name, origin, type, gender, size, price, inclusions, available, img } = costumeData;

  try {
    const imageBuffer = img ? Buffer.from(img) : null; 
    const sql = `
      UPDATE Costume
      SET costume_Name = ?, costume_Origin = ?, costume_Type = ?, 
          costume_Size = ?, costume_Gender = ?, costume_Price = ?, 
          costume_Inclusion = ?, costume_Available = ?, costume_Image = ?
      WHERE costume_ID = ?
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
      imageBuffer,
      id
    );
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
