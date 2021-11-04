const {
  app,
  BrowserWindow,
  Tray,
  nativeTheme,
  Menu,
  ipcMain,
  MenuItem,
} = require("electron");

import { createSettingsWindow } from "./settings/settingsWindow";

const path = require("path");

const debug = false;

import OBSDispatcher from "./obs/obsDispatcher";
import MainOBSListener from "./obs/mainObsListener";
import RendererOBSListener from "./obs/rendererObsListener";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let tray;

// TODO load settings
const appSettings = {
  obs: {
    server: {
      port: "4444",
    },
    reconnect: {
      intervalMS: 2000,
    },
  },
  overlay: {
    mode: "timer",
  },
};

const getIcon = () => {
  // if (process.platform === "win32") return "icon-light@2x.ico";
  // if (nativeTheme.shouldUseDarkColors) return "icon-light.png";
  return "tray_icon.png";
};

const obsDispatcher = new OBSDispatcher(appSettings);

let mainWindow;
let settingsWindow;

function createSettings() {
  if (settingsWindow != null) {
    return;
  }

  settingsWindow = createSettingsWindow(mainWindow, appSettings);
  settingsWindow.on("close", () => {
    // dispose of ref
    // I bet we can just do a close/hide and re-init instead
    settingsWindow = null;
  });
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    backgroundColor: "#1A2933",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // TODO figure out how to make movable without title bar
  // TODO fiugre out how to hide the frame

  // TODO lock modes
  // mainWindow.setPosition(0,0);
  // mainWindow.setMenuBarVisibility(true);
  // mainWindow.setFullScreenable(false);
  // mainWindow.setResizable(false);
  // mainWindow.setMovable(true);
  // unlockApp();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  const mainListener = new MainOBSListener(mainWindow);
  const renderListener = new RendererOBSListener(mainWindow.webContents);

  obsDispatcher.registerListener(mainListener);
  obsDispatcher.registerListener(renderListener);

  mainWindow.on("ready-to-show", () => {
    mainWindow.webContents.send("App.Initialize", appSettings);
    // TODO this needs to move to worker pool
    obsDispatcher.initialize();
  });

  // DEBUG mode
  if (debug) {
    // Open the DevTools.
    mainWindow.setSize(600, 800);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.setIcon(
    path.resolve(__dirname, "images", "obs_status_overlay_logo.png")
  );
  // TODO bind to tray button
  // createSettings();

  tray = new Tray(path.join(__dirname, "images", getIcon()));
  if (process.platform === "win32") {
    tray.on("click", tray.popUpContextMenu);
  }

  updateMenu();

  tray.setToolTip("OBS Status Overlay");
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    tray.destroy();
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("settings-dialog-close", () => {
  if (settingsWindow) {
    console.log("Close");
    settingsWindow.close();
  }
});

ipcMain.on("settings-dialog-apply", (event, settings) => {
  if (settingsWindow) {
    console.log("Apply");
    console.log(JSON.stringify(settings));
    settingsWindow.close();
  }
});

function lockApp() {
  mainWindow.setFullScreenable(false);
  mainWindow.setResizable(false);
  mainWindow.setMovable(false);
}

function unlockApp() {
  mainWindow.setFullScreenable(true);
  mainWindow.setResizable(true);
  mainWindow.setMovable(true);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const updateMenu = () => {
  const menu = new Menu();

  const settingsItem = new MenuItem({
    label: "Settings",
    click() {
      createSettings();
    },
  });

  // TODO set initial state.
  const lockItem = new MenuItem({
    label: "Locked",
    type: "checkbox",
    click(menuItem) {
      if (menuItem.checked) {
        lockApp();
      } else {
        unlockApp();
      }
    },
  });

  const quitItem = new MenuItem({
    label: "Quit",
    click() {
      app.quit();
    },
  });

  menu.append(settingsItem);
  menu.append(new MenuItem({ type: "separator" }));
  menu.append(lockItem);
  menu.append(new MenuItem({ type: "separator" }));
  menu.append(quitItem);

  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: "Settings",
  //     click() {

  //     },
  //   },
  //  ,
  //   {

  //     click(menuItem) {
  //       console.log(menuItem.checked);
  //     },
  //   },

  // ]);

  tray.setContextMenu(menu);
};
