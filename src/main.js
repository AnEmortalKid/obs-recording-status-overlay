const { app, BrowserWindow, Tray, nativeTheme, Menu } = require('electron');

const path = require('path');

const debug = false;

import OBSDispatcher from './obs/obsDispatcher';
import MainOBSListener from './obs/mainObsListener';
import RendererOBSListener from './obs/rendererObsListener';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let tray;

// TODO load settings
const appSettings = {
  obs: {
    server: {
      port: "4444"
    },
    reconnect: {
      interval: 2000
    },
  },
  overlay: {
    mode: "logo"
  }
}

const getIcon = () => {
  if (process.platform === 'win32') return 'icon-light@2x.ico';
  if (nativeTheme.shouldUseDarkColors) return 'icon-light.png';
  return 'icon-dark.png';
};

const obsDispatcher = new OBSDispatcher(appSettings);

let mainWindow;
const createWindow = () => {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    backgroundColor: "#1A2933",
    frame: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // TODO lock modes
  // mainWindow.setMenuBarVisibility(false);
  // mainWindow.setFullScreenable(false);
  // mainWindow.setResizable(false);
  // mainWindow.setMovable(true);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  const mainListener = new MainOBSListener(mainWindow);
  const renderListener = new RendererOBSListener(mainWindow.webContents);

  obsDispatcher.registerListener(mainListener);
  obsDispatcher.registerListener(renderListener);
  
  mainWindow.on('ready-to-show', () => {
    mainWindow.webContents.send("App.Initialize", appSettings);
    // TODO this needs to move to worker pool
    obsDispatcher.initialize();
  });
  
  // DEBUG mode
  if(debug) {
    // Open the DevTools.
    mainWindow.setSize(400, 400);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.setIcon(path.resolve(__dirname, "images", "raccoon_logo.jpeg"));


  tray = new Tray(path.join(__dirname, "images", getIcon()));
  tray.setPressedImage(path.join(__dirname, "images", 'icon-light.png'));

  if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu);
  }

  updateMenu();

  tray.setToolTip('OBS Status Recorder');
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const updateMenu = () => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Create New Clipping',
      click() { () => { console.log("New Clip Please") } }
    },
    { type: 'separator' },
    { label: 'ClickMe', click() { console.log('Click')}},
    {
      label: 'Quit',
      click() { app.quit(); }
    }
  ]);

  tray.setContextMenu(menu);
};
