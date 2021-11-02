import { OBSEvents, OBSListener } from "./obsListener";

/**
 * Component responsible for handling events on the main process
 */
export default class MainOBSListener extends OBSListener {
   constructor(window) {
      super();
      this.window = window;
   }

   notify(event)  {
      console.log('MainOBSListener: ' + event);
      // TODO not sure if displayers are worth it now or not
      switch(event) {
         case OBSEvents.RecordingStarted:
            this.window.flashFrame(true);
            break;
            case OBSEvents.RecordingStopped:
               this.window.flashFrame(false);
               break;
      }
   }
}