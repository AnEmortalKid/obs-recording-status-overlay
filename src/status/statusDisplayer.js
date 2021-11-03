
/**
 * A StatusDisplayer is a component capable of displaying the RecordingStatus and its transitions.
 */
export default class StatusDisplayer {
    constructor()  {
        if (this.constructor == StatusDisplayer) {
            throw new Error("StatusDisplayer is a specification");
        }
    }

    /**
     * Notifies the displayer that a StartRecording event was captured
     */
    onStart() {
      throw new Error("Unimplemented method");
    }
    
    /**
     * Notifies the displayer that a StopRecording event was captured
     */
    onStop() {
      throw new Error("Unimplemented method");
    }
}
