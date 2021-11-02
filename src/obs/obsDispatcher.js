import { OBSEvents } from './obsListener';

const OBSWebSocket = require('obs-websocket-js');

/**
 * Component responsible for listening to OBS events and dispatching them to a set of listeners
 */
export default class OBSDispatcher {
  
  // TODO turn into private stuff

  /**
   * 
   * @returns function that keeps looping
   */
  attemptConnection() {
   
    // connected and haven't removed intervalId
    if(this.obsInternal.isConnected && this.obsInternal.intervalId) {
      clearInterval(this.obsInternal.intervalId)
      this.obsInternal.intervalId = null;
      return;
    }

    this.obsInternal.socket = new OBSWebSocket();
    const obsSocket = this.obsInternal.socket;
    obsSocket.connect({
        address: 'localhost:' + this.obsSettings.port
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
        obsSocket.on('Exiting', (data) => {
          console.log("OBS Said Bye");
          obsSocket.disconnect();
          this.obsInternal = {
            isConnected: false,
            obsSocket: null,
            intervalId: null
          };
          this.initialize();
        });
        // TODO track Heartbeat in case it crashed
        // obsSocket.on('Heartbeat')
    })
    .catch(err => { // Promise convention dicates you have a catch on every chain.
        console.log(err);
        this.obsInternal.isConnected = false;
    });
  }

  // TODO connect/disconnect functions

  constructor(appSettings) {
    this.obsSettings = appSettings.obs;
    this.obsInternal = {
      isConnected: false,
      obsSocket: null,
      intervalId: null
    };

    this.listeners = [];
  }

  initialize() {
    console.log('initialize()');
    console.log(this.obsInternal);
    // TODO poll config
    this.obsInternal.intervalId = setInterval(this.attemptConnection.bind(this), 1000);
  }

  registerListener(listener) {
    console.log('Registering: ' + listener);

     this.listeners.push(listener);
  }

  deregisterListener(listener) {
    this.listeners.remove(listener);
  }

  dispatch(event) {
    console.log('Dispatching @' + new Date());
    for(const listener of this.listeners) {
        // TODO event
        listener.notify(event);
    }
  }
}