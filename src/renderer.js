import './index.css';
import { OBSEvents } from './obs/obsListener';
import StatusDisplayer from './status/statusDisplayer'
const { ipcRenderer } = require('electron');

console.log('👋 This message is being logged by "renderer.js", included via webpack');

var sd = new StatusDisplayer();
sd.onStart();
sd.onStop();

ipcRenderer.on(OBSEvents.RecordingStarted, () => {
  console.log('renderer.RecordingStarted');
});

ipcRenderer.on(OBSEvents.RecordingStopped, () => {
  console.log('renderer.RecordingStopped');
});
