import StatusDisplayer from "./statusDisplayer";

const secondsInHour = 60 * 60;
const secondsInMinute = 60;

function toDurationString(seconds) {
  if (seconds < 0) {
    return "";
  }

  var remaining = seconds;

  var hours = Math.floor(remaining / secondsInHour);
  remaining -= hours * secondsInHour;

  var minutes = Math.floor(remaining / secondsInMinute);
  remaining -= minutes * secondsInMinute;

  var hoursStr = String(hours).padStart(2, 0);
  var minStr = String(minutes).padStart(2, 0);
  var secStr = String(remaining).padStart(2, 0);
  
  return hoursStr + ":" + minStr + ":" + secStr;
}

const containerId = "timer-overlay"
const textId = "timer-overlay-statusText"

/**
 * Displayer that tracks the time spent recording as well as an indication of that recording
 */
export default class RecordingTimerStatusDisplayer extends StatusDisplayer {

  constructor() {
    super();
    this.timerSeconds = 0;
    this.timerIntervalId = null;
    
    // set to visible
    document.getElementById(containerId).hidden = false;
  }

  timerTick() {
    this.timerSeconds = this.timerSeconds +1;
    this.updateLabel();
  }

  updateLabel() {
    document.getElementById(textId).textContent = toDurationString(this.timerSeconds);
  }

  onStart() {
    console.log('OnStart');
    this.timerSeconds = 0;

    this.timerIntervalId = setInterval(this.timerTick.bind(this), 1000);
  }

  onStop() {
    console.log('OnStop');
    clearInterval(this.timerIntervalId);
    this.timerSeconds = 0;
    this.updateLabel();
  }

}