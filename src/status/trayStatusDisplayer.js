const path = require("path");

export default class TrayStatusDisplayer {

  constructor(win) {
    this.win = win;
  }

  onStart() {
    console.log("trayStatus.onStart");
    

    this.win.setOverlayIcon(path.resolve(__dirname, "images", "red_circle_md.png"), 'A recording has begun.');
  }

  onStop() {
    console.log("trayStatus.onStop");
    this.win.setOverlayIcon(null, 'A recording has stopped.');
  }
}