
console.log('Renderer loaded');

function setListeners() {
  window.obs.on('RecordingStarted', (data) => {
    console.log(`Recording Start: ${data.recordingFilename}`);
  
    window.ipcRenderer.invoke('recordingStarted');
    document.getElementById("logo").classList.add("recording");
  });
  
  window.obs.on('RecordingStopped', (data) => {
    console.log(`Recording Stop: ${data.recordingFilename}`);
    window.ipcRenderer.invoke('recordingStopped');
    document.getElementById("logo").classList.remove("recording");
  });
}

// TODO need to log to events for disconnect/connect
let checkConnectionInterval;

function establishConnection() {
  console.log('establishConnection');
  if(window.obs.isConnected()) {
    setListeners();
    clearInterval(checkConnectionInterval);
  }
  else {
    console.log('Attempt connect');
    window.obs.connect();
  }
}

checkConnectionInterval = setInterval(establishConnection, 1000);
