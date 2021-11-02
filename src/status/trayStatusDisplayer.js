import StatusDisplayer from "./statusDisplayer";

export default class TrayStatusDisplayer extends StatusDisplayer {

  constructor(win) {
    super();
    this.win = win;
  }

  onStart() {
    console.log("trayStatus.onStart");
    this.win.flashFrame(true);
  }

  onStop() {
    console.log("trayStatus.onStop");
    this.win.flashFrame(false);
  }
}