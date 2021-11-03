import { OBSListener } from "./obsListener";

/**
 * Component responsible for forwarding OBS events to a renderer
 */
export default class RendererOBSListener extends OBSListener {
  /**
   * @param {WebContents} webContents object to use to forward events
   */
  constructor(webContents) {
    super();
    this.webContents = webContents;
  }

  notify(event) {
    console.log("Forwarding: " + event);
    this.webContents.send(event, "from main");
  }
}
