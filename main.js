const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    frame: true,                                  
    icon: path.join(__dirname, 'assets', 'viewer!.ico'),
    webPreferences: { contextIsolation: true }
  });

  mainWindow.webContents.on('context-menu', (_event, params) => {
    const menu = Menu.buildFromTemplate([
      {
        label: 'Reload',
        click: () => {
          mainWindow.webContents.reload();
        }
      }
    ]);
    menu.popup({
      window: mainWindow,
      x: params.x,
      y: params.y
    });
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());