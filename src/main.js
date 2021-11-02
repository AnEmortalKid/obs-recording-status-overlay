const { app, BrowserWindow, ipcMain } = require('electron');
import StatusDisplayer from './status/statusDisplayer';
import TrayStatusDisplayer from './status/trayStatusDisplayer';

import OBSDispatcher from './obs/obsDispatcher';
import MainOBSListener from './obs/mainObsListener';
import RendererOBSListener from './obs/rendererObsListener';
import { OBSEvents } from './obs/obsListener';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


// TODO load settings
const appSettings = {
  obs: {
    port: "4444"
  }
}

const obsDispatcher = new OBSDispatcher(appSettings);

let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  console.log('PreloadEntry: ' + MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  var sd = new StatusDisplayer();
  sd.onStart();
  sd.onStop();

  //const trayStatus = new TrayStatusDisplayer(mainWindow);

  const mainListener = new MainOBSListener(mainWindow);
  const renderListener = new RendererOBSListener(mainWindow.webContents);

  obsDispatcher.registerListener(mainListener);
  obsDispatcher.registerListener(renderListener);
  
  // play function atm
  function dispatcher() {
    obsDispatcher.dispatch(OBSEvents.RecordingStarted);
  }

  // setInterval(dispatcher, 2000);

  obsDispatcher.initialize();
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

ipcMain.handle('onRecordingStarted', (e) => {
  console.log('handle.onRecordingStarted');
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
