const { app, BrowserWindow, ipcMain, screen, Notification  } = require('electron')
const path = require('path');
const { clearInterval } = require('timers');
// const OBSWebSocket = require('obs-websocket-js');
// const obs = new OBSWebSocket();

// TODO setup obs and renderer per
// https://stackoverflow.com/questions/44391448/electron-require-is-not-defined example wiht 59 and preload


let win;

function createWindow () {
  win = new BrowserWindow({
    width: 80,
    height: 80,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
    },
    type: 'toolbar',
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    resizable:false,
    minimizable: false,
    alwaysOnTop: true
  })
  
    win.loadFile('index.html')

    win.setPosition(0,0);

    // TODO set fullscreen on top of everything

    win.setAlwaysOnTop(true, "screen-saver", 0);
    win.setFullScreenable(false);
    win.setVisibleOnAllWorkspaces(true);

    win.on('minimize', (event) => {
      console.log('minimzed');

    });

    // todo notif based?

    // TODO set icon
    // win.setIcon('./raccon_record.jpeg')

    // TODO browserify build shit
}



  let trayRecordStatus;
  let trayRecordAnimationId;

  function startRecordingAnimation() {
    trayRecordAnimationId = setInterval(frame, 500);
    function frame() {
      if(trayRecordStatus) {
        win.setOverlayIcon(null, 'RecordingStateAnimation.off');
        trayRecordStatus = false;
      }
      else {
        win.setOverlayIcon('./red-circle-md.png', 'RecordingStateAnimation.on');
        trayRecordStatus = true;
      }
    }
}

  // handler points
  ipcMain.handle('recordingStarted', () => {
    startRecordingAnimation();
  });

  ipcMain.handle('recordingStopped', () => {
    clearInterval(trayRecordAnimationId);
  });

  app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) { createWindow() }
    })

    const NOTIFICATION_TITLE = 'Basic Notification'
    const NOTIFICATION_BODY = 'Notification from the Main process'

    function showNotification () {
      new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
    }
    showNotification();
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })


