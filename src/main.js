require("dotenv").config();

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
import {
  schemaDefaults,
  schemaDefinition,
  SettingsEvents,
} from "./settings/schema";

const path = require("path");

const debug = process.env.DEBUG;

import OBSDispatcher from "./obs/obsDispatcher";
import MainOBSListener from "./obs/mainObsListener";
import RendererOBSListener from "./obs/rendererObsListener";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let tray;

const Store = require("electron-store");

const store = new Store({ schema: schemaDefinition, defaults: schemaDefaults });

// store.set(appSettings);
console.log(`Settings: ${JSON.stringify(store.store)}`);

const getIcon = () => {
  // if (process.platform === "win32") return "icon-light@2x.ico";
  // if (nativeTheme.shouldUseDarkColors) return "icon-light.png";
  return "tray_icon.png";
};

const obsDispatcher = new OBSDispatcher(store.get("obs"));

let mainWindow;
let settingsWindow;

function createSettings() {
  if (settingsWindow != null) {
    return;
  }

  const editables = {
    obs: store.get("obs"),
    overlay: store.get("overlay"),
  };

  settingsWindow = createSettingsWindow(mainWindow, editables);
  settingsWindow.on("close", () => {
    // dispose of ref
    // I bet we can just do a close/hide and re-init instead
    settingsWindow = null;
  });
}

function initRenderer() {
  mainWindow.webContents.send("App.Initialize", store.get("overlay"));
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    backgroundColor: "#1A2933",
    // frame: debug ? debug : true,
    frame: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setFullScreenable(false);
  mainWindow.setAlwaysOnTop(true);

  const appPrefs = store.get("application");

  if (appPrefs) {
    if (appPrefs.locked) {
      lockApp();
    } else {
      unlockApp();
    }

    if (appPrefs.bounds) {
      mainWindow.setBounds(appPrefs.bounds);
    }
  }

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  const mainListener = new MainOBSListener(mainWindow);
  const renderListener = new RendererOBSListener(mainWindow.webContents);

  obsDispatcher.registerListener(mainListener);
  obsDispatcher.registerListener(renderListener);

  mainWindow.on("ready-to-show", () => {
    initRenderer();
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

ipcMain.on(SettingsEvents.DIALOG.CANCEL, () => {
  if (settingsWindow) {
    console.log("Close");
    settingsWindow.close();
  }
});

ipcMain.on(SettingsEvents.DIALOG.APPLY, (event, settings) => {
  if (settingsWindow) {
    // set each part to ensure they're the right type after serializing
    const fixedObs = {
      server: {
        port: parseInt(settings.obs.server.port),
        password: settings.obs.server.password,
      },
      reconnect: {
        intervalMS: parseInt(settings.obs.reconnect.intervalMS),
      },
    };
    store.set("obs", fixedObs);

    const oldOverlay = store.get("overlay");
    if (oldOverlay.mode != settings.overlay.mode) {
      store.set("overlay", settings.overlay);
      initRenderer();
    }

    settingsWindow.close();
  }
});

function lockApp() {
  mainWindow.setResizable(false);
  mainWindow.setMovable(false);
  mainWindow.setIgnoreMouseEvents(true);

  const bounds = mainWindow.getBounds();
  store.set("application.bounds", bounds);
  store.set("application.locked", true);
}

function unlockApp() {
  mainWindow.setResizable(true);
  mainWindow.setMovable(true);
  mainWindow.setIgnoreMouseEvents(false);

  store.set("application.locked", false);
}

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

  lockItem.checked = store.get("application.locked");

  const quitItem = new MenuItem({
    label: "Quit",
    click() {
      // TODO store bounds as well?
      app.quit();
    },
  });

  menu.append(settingsItem);
  menu.append(new MenuItem({ type: "separator" }));
  menu.append(lockItem);
  menu.append(new MenuItem({ type: "separator" }));
  menu.append(quitItem);

  tray.setContextMenu(menu);
};
