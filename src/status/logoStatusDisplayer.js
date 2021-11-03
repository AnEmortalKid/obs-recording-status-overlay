
const containerId = "logo-overlay"
const imgId = "logo-overlay-image"

export default class LogoStatusDisplayer {

    constructor() {
        // set to visible
        document.getElementById(containerId).hidden = false;
        
        // start with it hidden
        document.getElementById(imgId).classList.toggle('fadeOut');
      }

      toggleFade() {
        document.getElementById(imgId).classList.toggle('fadeOut');
      }

    onStart() {
        console.log('LogoStatuSidsplayer.onStart');
        this.toggleFade();
    }
    
    onStop() {
        console.log('LogoStatusDisplayer.onStop');
        this.toggleFade();
    }
}