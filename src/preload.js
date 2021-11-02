const { contextBridge } = require("electron");
import OBSDispatcher from "./obs/obsDispatcher";
console.log('load preload');

const obsDispatcher = new OBSDispatcher();

// contextBridge.exposeInMainWorld(
//   'obsDispatcher', {
//     registerListener: (listener) => {
//       obsDispatcher.registerListener(listener);
//     }
//   }
// )

// contextBridge.exposeInMainWorld(
//   'jan', {
//     foo: () => { console.log('Exposed') }
//   }
// )

setInterval(obsDispatcher.dispatch, 2000);