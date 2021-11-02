import StatusDisplayer from "./statusDisplayer";

export default class TrayStatusDisplayer extends StatusDisplayer {
  onStart() {
    console.log("Display in tray");
  }
}