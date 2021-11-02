
export class OBSListener {
    constructor()  {
        if (this.constructor == OBSListener) {
            throw new Error("OBSListener is a specification");
        }
    }

    /**
     * Notifies the listener that the specified event was fired
     * @param {OBSEvents} event 
     */
    notify(event) {
        throw new Error("Unimplemented method");
    }
}

export const OBSEvents = {
    RecordingStarted: "RecordingStarted",
    RecordingStopped: "RecordingStopped"
}
