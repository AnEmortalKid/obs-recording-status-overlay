import "./index.css";
import { OBSEvents } from "./obs/obsListener";
import LogoStatusDisplayer from "./status/logoStatusDisplayer";
import RecordingTimerStatusDisplayer from "./status/recordingTimerStatusDisplayer";
const { ipcRenderer } = require("electron");

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack'
);

let displayer;

ipcRenderer.on(OBSEvents.RecordingStarted, () => {
  console.log("renderer.RecordingStarted");

  displayer.onStart();
});

ipcRenderer.on(OBSEvents.RecordingStopped, () => {
  console.log("renderer.RecordingStopped");
  displayer.onStop();
});

ipcRenderer.on("App.Initialize", (event, overlay) => {
  // TODO pass mode specific config
  const mode = overlay.mode;

  // hide all displayers
  document.getElementById("timer-overlay").hidden = true;
  document.getElementById("logo-overlay").hidden = true;

  switch (mode) {
    case "timer":
      displayer = new RecordingTimerStatusDisplayer();
      break;
    case "logo":
      displayer = new LogoStatusDisplayer();
      break;
  }
});

ipcRenderer.on("App.Background", (event, transparent) => {
  const root = document.getElementById("root");
  if (transparent) {
    root.classList.add("transparent-bg");
    root.classList.remove("full-bg");
  } else {
    root.classList.remove("transparent-bg");
    root.classList.add("full-bg");
  }
});
