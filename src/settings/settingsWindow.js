import { BrowserWindow } from "electron";
import { SettingsEvents } from "./schema";
const path = require("path");

export function createSettingsWindow(mainWindow, appSettings) {
  const settingsWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    backgroundColor: "#1A2933",
    autoHideMenuBar: true,
    show: false,
    width: 425,
    height: 575,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  settingsWindow.loadURL(
    path.resolve(__dirname, "views", "settings", "index.html")
  );

  settingsWindow.once("ready-to-show", () => {
    settingsWindow.show();
    settingsWindow.webContents.send("Settings.Initialize", appSettings);
  });

  return settingsWindow;
}
