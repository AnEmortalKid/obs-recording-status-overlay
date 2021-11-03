import TrayStatusDisplayer from "../status/trayStatusDisplayer";
import { OBSEvents, OBSListener } from "./obsListener";

/**
 * Component responsible for handling events on the main process
 */
export default class MainOBSListener extends OBSListener {
   // TODO pass listeners and dispatchio bashio
   constructor(window) {
      super();
      this.window = window;
      this.td = new TrayStatusDisplayer(window);
   }

   notify(event)  {
      console.log('MainOBSListener: ' + event);
      // TODO not sure if displayers are worth it now or not
      switch(event) {
         case OBSEvents.RecordingStarted:
            this.td.onStart();
            break;
         case OBSEvents.RecordingStopped:
            this.td.onStop();
            break;
      }
   }
}