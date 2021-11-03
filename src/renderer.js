import './index.css';
import { OBSEvents } from './obs/obsListener';
import LogoStatusDisplayer from './status/logoStatusDisplayer';
import RecordingTimerStatusDisplayer from './status/recordingTimerStatusDisplayer'
const { ipcRenderer } = require('electron');

console.log('👋 This message is being logged by "renderer.js", included via webpack');


let displayer;

ipcRenderer.on(OBSEvents.RecordingStarted, () => {
  console.log('renderer.RecordingStarted');

  displayer.onStart();
});

ipcRenderer.on(OBSEvents.RecordingStopped, () => {
  console.log('renderer.RecordingStopped');
  displayer.onStop();
});

ipcRenderer.on("App.Initialize", (event, appSettings) => {
  // TODO pass mode specific config
  const mode = appSettings.overlay.mode;
  switch(mode) {
    case "timer":
      displayer = new RecordingTimerStatusDisplayer();
      break;
    case "logo":
        displayer = new LogoStatusDisplayer();
      break;
  }
});