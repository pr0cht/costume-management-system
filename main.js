const { app, BrowserWindow, Tray } = require('electron');

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    title: "Costume Management System",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    app.quit();
  });
    const tray = new Tray('assets/tray_icon.jpg');
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


