const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  Notification,
} = require("electron");
const path = require("path");
const { clearInterval } = require("timers");

let win;

// TODO Tray

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
    },
    // Desktop has icon
    // type: 'toolbar',
    // transparent: true,
    // frame: false,
    autoHideMenuBar: true,
    // resizable:false,
    // minimizable: false,
    alwaysOnTop: true,
  });

  win.loadFile("index.html");

  win.setPosition(0, 0);

  win.setAlwaysOnTop(true, "screen-saver");
  win.setFullScreenable(false);
  win.setVisibleOnAllWorkspaces(true);

  win.on("minimize", (event) => {
    console.log("minimzed");
  });

  // todo request PNG plox
  const iconImg = path.join(__dirname, "images", "raccoon_logo.jpeg");
  win.setIcon(iconImg);
}

let trayRecordStatus;
let trayRecordAnimationId;

function trayStatusNotRecording() {
  win.setOverlayIcon(null, "RecordingStateAnimation.off");
  trayRecordStatus = false;
}

function trayStatusRecording() {
  win.setOverlayIcon(
    "./images/red_circle_md.png",
    "RecordingStateAnimation.on"
  );
  trayRecordStatus = true;
}

function windowStatusRecording() {
  win.setOpacity(1.0);
}

function windowStatusNotRecording() {
  win.setOpacity(0.1);
}

function startRecordingAnimation() {
  trayRecordAnimationId = setInterval(frame, 500);
  function frame() {
    if (trayRecordStatus) {
      trayStatusNotRecording();
    } else {
      trayStatusRecording();
    }
  }
}

// handler points
ipcMain.handle("recordingStarted", () => {
  trayStatusRecording();
  startRecordingAnimation();
  // win.setOpacity(1.0);
});

ipcMain.handle("recordingStopped", () => {
  clearInterval(trayRecordAnimationId);
  trayStatusNotRecording();
  // win.setOpacity(0.1);
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
  // TODO figure out disconnect
  // window.obs.disconnect();
});
