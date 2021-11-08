import { OBSEvents } from "./obsListener";

const OBSWebSocket = require("obs-websocket-js");

/**
 * Component responsible for listening to OBS events and dispatching them to a set of listeners
 */
export default class OBSDispatcher {
  // TODO turn into private stuff

  // TODO figure out why it reconnects multiple times
  // TODO see if we can figure out a connection id or something to avoid reconnect

  /**
   *
   * @returns function that keeps looping
   */
  attemptConnection() {
    // connected and haven't removed intervalId
    if (this.obsInternal.isConnected && this.obsInternal.intervalId) {
      clearInterval(this.obsInternal.intervalId);
      this.obsInternal.intervalId = null;
      return;
    }

    this.obsInternal.socket = new OBSWebSocket();
    const obsSocket = this.obsInternal.socket;
    obsSocket
      .connect({
        address: "localhost:" + this.obsSettings.server.port,
      })
      .then(() => {
        console.log(`Success! We're connected & authenticated.`);
        this.obsInternal.isConnected = true;

        // TODO forloop this
        obsSocket.on(OBSEvents.RecordingStarted, (data) => {
          this.dispatch(OBSEvents.RecordingStarted);
        });
        obsSocket.on(OBSEvents.RecordingStopped, (data) => {
          this.dispatch(OBSEvents.RecordingStopped);
        });

        // TODO make this pretty
        obsSocket.on("Exiting", (data) => {
          console.log("OBS Said Bye");
          obsSocket.disconnect();
          this.obsInternal = {
            isConnected: false,
            obsSocket: null,
            intervalId: null,
          };
          this.initialize();
        });
        // TODO track Heartbeat in case it crashed
        // obsSocket.on('Heartbeat')
      })
      // TODO poll initial state in case we're in the middle of a recording when the app is opened
      .catch((err) => {
        // Promise convention dicates you have a catch on every chain.
        console.log(
          `Attempt to connect to obs ended with ${err.error} \nRetrying in ${this.obsSettings.reconnect.intervalMS} milliseconds.`
        );
        this.obsInternal.isConnected = false;
      });
  }

  // TODO connect/disconnect functions

  constructor(obsSettings) {
    this.obsSettings = obsSettings;
    this.obsInternal = {
      isConnected: false,
      obsSocket: null,
      intervalId: null,
    };

    this.listeners = [];
  }

  initialize() {
    // TODO poll config
    this.obsInternal.intervalId = setInterval(
      this.attemptConnection.bind(this),
      this.obsSettings.reconnect.intervalMS
    );
  }

  registerListener(listener) {
    console.log("Registering: " + listener);

    this.listeners.push(listener);
  }

  deregisterListener(listener) {
    this.listeners.remove(listener);
  }

  dispatch(event) {
    console.log("Dispatching @" + new Date());
    for (const listener of this.listeners) {
      // TODO event
      listener.notify(event);
    }
  }
}
