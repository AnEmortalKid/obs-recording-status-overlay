const { ipcRenderer } = require("electron");

const obsServerPort = "input-obs.server.port";
const obsServerPass = "input-obs.server.password";
const obsReconnectInteval = "input-obs.reconnect.interval";
const overlayMode = "select-obs.overlay.mode";
const formId = "settings-form";

function bindToForm(appSettings) {
  const { obs, overlay } = appSettings;

  const obsServerPortInput = document.getElementById(obsServerPort);
  obsServerPortInput.value = obs.server.port;

  const obsServerPassInput = document.getElementById(obsServerPass);
  obsServerPassInput.value = obs.server.password ? obs.server.password : "";

  // input value is in seconds stored value is MS
  const obsReconnectIntevalInput = document.getElementById(obsReconnectInteval);
  obsReconnectIntevalInput.value = obs.reconnect.intervalMS / 1000;

  const overlayModeSelect = document.getElementById(overlayMode);
  overlayModeSelect.value = overlay.mode.toLowerCase();
}

function bindFromForm() {
  const obsServerPortInput = document.getElementById(obsServerPort).value;
  const obsServerPassInput = document.getElementById(obsServerPass).value;
  const obsReconnectIntevalInput =
    document.getElementById(obsReconnectInteval).value;
  const overlayModeSelect = document.getElementById(overlayMode).value;

  console.log("Binding " + obsServerPortInput);
  return {
    obs: {
      server: {
        port: obsServerPortInput,
        password: obsServerPassInput,
      },
      reconnect: {
        intervalMS: obsReconnectIntevalInput * 1000,
      },
    },
    overlay: {
      mode: overlayModeSelect.toLowerCase(),
    },
  };
}

function bindButtons() {
  var applyBtn = document.getElementById("settings-apply-btn");
  applyBtn.addEventListener("click", (event) => {
    ipcRenderer.send("Settings.Dialog.Apply", bindFromForm());
  });

  var cancelBtn = document.getElementById("settings-cancel-btn");
  cancelBtn.addEventListener("click", (event) => {
    ipcRenderer.send("Settings.Dialog.Cancel");
  });
}

ipcRenderer.on("Settings.Initialize", (event, appSettings) => {
  console.log("Received Settings.Initialize");
  console.log(JSON.stringify(appSettings));
  bindToForm(appSettings);
  bindButtons();
});
