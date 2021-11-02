
/**
 * Component responsible for listening to OBS events and dispatching them to a set of listeners
 */
export default class OBSDispatcher {

  // connect to OBS
  constructor() {
    // TODO connect to OBS
    this.listeners = []
  }

  registerListener(listener) {
    this.listeners.push(listener);
  }

  deregisterListener(listener) {
    this.listeners.remove(listener);
  }

  dispatch() {
    console.log('Dispatching ' + new Date());
  }
}