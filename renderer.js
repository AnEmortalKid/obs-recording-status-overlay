window.obs.on('RecordingStarted', (data) => {
  console.log(`Recording Start: ${data.recordingFilename}`);

  window.ipcRenderer.invoke('recordingStarted');
});

window.obs.on('RecordingStopped', (data) => {
  console.log(`Recording Stop: ${data.recordingFilename}`);

  // TODO draw stuff

  window.ipcRenderer.invoke('recordingStopped');
});
