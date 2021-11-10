import StatusDisplayer from "./statusDisplayer";

const path = require("path");

/**
 * A StatusDisplayer that uses the Application's Icon
 */
export default class AppIconStatusDisplayer extends StatusDisplayer {
  constructor(win) {
    super();
    this.win = win;
    this.recordAnimationId = null;
    this.displayingOverlay = false;
  }

  statusRecording() {
    this.win.setOverlayIcon(
      path.resolve(__dirname, "images", "alert-red.png"),
      "A recording has begun."
    );
  }

  statusNotRecording() {
    this.win.setOverlayIcon(null, "A recording has stopped.");
  }

  startRecordingAnimation() {
    this.recordAnimationId = setInterval(frame.bind(this), 500);

    function frame() {
      if (this.displayingOverlay) {
        this.statusNotRecording();
        this.displayingOverlay = false;
      } else {
        this.statusRecording();
        this.displayingOverlay = true;
      }
    }
  }

  onStart() {
    console.log("trayStatus.onStart");

    this.displayOverlay = true;
    this.statusRecording();

    this.startRecordingAnimation();
  }

  onStop() {
    console.log("trayStatus.onStop");
    clearInterval(this.recordAnimationId);
    this.statusNotRecording();
  }
}
