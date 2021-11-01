const OBSWebSocket = require('obs-websocket-js');
const { contextBridge, ipcRenderer } = require('electron')

let obs;
let obsConnected = false;

function connectToObs() {
  obs = new OBSWebSocket();
  obs.connect({
      address: 'localhost:4444'
  })
  .then(() => {
      console.log(`Success! We're connected & authenticated.`);
      obsConnected = true;
  })
  .catch(err => { // Promise convention dicates you have a catch on every chain.
      console.log(err);
  });
}

connectToObs();

contextBridge.exposeInMainWorld(
    'obs', {
        // expose the required apis
        on: (eventName, callback) => {
            obs.on(eventName, callback);
        },
        disconnect: () => {
          obs.disconnect();
        },
        isConnected: () => {
          console.log('obs.isConnected: ' + obsConnected);
          return obsConnected;
        },
        connect: () => {
          connectToObs();
        }
     }
);

contextBridge.exposeInMainWorld(
    'ipcRenderer', {
        invoke: (name, args) => {
            ipcRenderer.invoke(name, args);
        }
    }
);
