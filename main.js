const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require("path");
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'db', 'cms.db');
const db = new Database(dbPath);

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    title: "Costume Management System",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  Menu.setApplicationMenu(null);

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


// Database handlers
const { ipcMain } = require('electron');

ipcMain.handle('add-costume', async (event, costumeData) => {
  const { name, origin, type, gender, size, price, inclusions, available, img } = costumeData;

  const statement = db.prepare(`
    INSERT INTO Costumes (costume_Name, costume_Origin, costume_Type, 
    costume_Size, costume_Gender, costume_Price, costume_Inclusion, 
    costume_Available, costume_Image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = statement.run(name, origin, type, size, gender, price, inclusions, available, img);
  return { success: true, lastID: result.lastInsertRowid };
});