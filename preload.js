const OBSWebSocket = require('obs-websocket-js');
const { contextBridge, ipcRenderer } = require('electron')

const obs = new OBSWebSocket();
// obs.connect({
//     address: 'localhost:4444'
// })
// .then(() => {
//     console.log(`Success! We're connected & authenticated.`);

//     return obs.send('GetSceneList');
// })
// .then(data => {
//     console.log(`${data.scenes.length} Available Scenes!`);

//     data.scenes.forEach(scene => {
//         if (scene.name !== data.currentScene) {
//             console.log(`Found a different scene! Switching to Scene: ${scene.name}`);

//             obs.send('SetCurrentScene', {
//                 'scene-name': scene.name
//             });
//         }
//     });
// })
// .catch(err => { // Promise convention dicates you have a catch on every chain.
//     console.log(err);
// });

contextBridge.exposeInMainWorld(
    'obs', { 
        // expose the required apis
        on: (eventName, callback) => {
            obs.on(eventName, callback);
        }
     }
);

contextBridge.exposeInMainWorld(
    'ipcRenderer', {
        invoke: (name, args) => {
            console.log('preload.invoke')
            ipcRenderer.invoke(name, args);
        }
    }
);
