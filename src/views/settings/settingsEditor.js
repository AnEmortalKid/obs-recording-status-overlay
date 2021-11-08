//  this.form.addEventListener("submit", submissionAction);

// TODO make class?

//  this.form = document.getElementById("settings-form");

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
  const obsServerPortInput = document.getElementById(obsServerPort);
  const obsServerPassInput = document.getElementById(obsServerPass);
  const obsReconnectIntevalInput = document.getElementById(obsReconnectInteval);
  const overlayModeSelect = document.getElementById(overlayMode);

  return {
    obs: {
      server: {
        port: obsServerPortInput.value,
        password: obsServerPassInput.value,
      },
      reconnect: {
        intervalMS: obsReconnectIntevalInput.value * 1000,
      },
    },
    overlay: {
      mode: overlayModeSelect.value.toLowerCase(),
    },
  };
}

function bindButtons() {
  var applyBtn = document.getElementById("settings-apply-btn");
  applyBtn.addEventListener("click", (event) => {
    console.log("Saving");
    ipcRenderer.send("Settings.Dialog.Apply", bindFromForm());
  });

  var cancelBtn = document.getElementById("settings-cancel-btn");
  cancelBtn.addEventListener("click", (event) => {
    console.log("Cancel");
    ipcRenderer.send("Settings.Dialog.Cancel");
  });
}

ipcRenderer.on("Settings.Initialize", (event, appSettings) => {
  console.log("Received Settings.Initialize");
  console.log(JSON.stringify(appSettings));
  bindToForm(appSettings);
  bindButtons();
});
