import AppIconStatusDisplayer from "../status/trayStatusDisplayer";
import { OBSEvents, OBSListener } from "./obsListener";

/**
 * Component responsible for handling events on the main process
 */
export default class MainOBSListener extends OBSListener {
  // TODO pass listeners and dispatchio bashio
  constructor(window) {
    super();
    this.window = window;
    this.displayer = new AppIconStatusDisplayer(window);
  }

  notify(event) {
    console.log("MainOBSListener: " + event);
    switch (event) {
      case OBSEvents.RecordingStarted:
        this.displayer.onStart();
        break;
      case OBSEvents.RecordingStopped:
        this.displayer.onStop();
        break;
    }
  }
}
