console.log("load preload");

// const {
//     contextBridge,
//     ipcRenderer
// } = require("electron");

// contextBridge.exposeInMainWorld(
//   'settingsClient', {
//       save: (data) => {
//         ipcRenderer.send("settings-dialog-apply", data);
//       },
//       close: () => {
//           ipcRenderer.send("settings-dialog-close");
//       }
//   }
// );

// contextBridge.exposeInMainWorld(
//   'obsDispatcher', {
//     registerListener: (listener) => {
//       obsDispatcher.registerListener(listener);
//     }
//   }
// )
