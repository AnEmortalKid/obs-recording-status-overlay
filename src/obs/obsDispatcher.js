
/**
 * Component responsible for listening to OBS events and dispatching them to a set of listeners
 */
export default class OBSDispatcher {

  // connect to OBS
  constructor() {
    // TODO connect to OBS
    this.listeners = [];
    console.log('Init: ' + this.listeners);
  }

  registerListener(listener) {
    console.log('Registering: ' + listener);

    var newLen = this.listeners.push(listener);
    console.log(newLen);
  }

  deregisterListener(listener) {
    this.listeners.remove(listener);
  }

  dispatch() {
    console.log('Dispatching @' + new Date());
    for(const listener of this.listeners) {
        listener.notify();
    }
    
  }
}