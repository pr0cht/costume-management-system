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