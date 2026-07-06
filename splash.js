/* splash.js */
(function(){
  // Configurable timings (ms)
  const CLEANUP_DELAY = 900; // wait until animations finished plus small buffer

  const splash = document.getElementById('splash');
  if (!splash) return;

  const center = splash.querySelector('.splash-center');

  function startLaunch() {
    // guard double clicks
    if (splash.classList.contains('launch')) return;
    splash.classList.add('launch');

    // After animations, fade out the overlay and then remove from DOM & clean up
    setTimeout(() => {
      splash.classList.add('removing');
    }, 520); // start fading overlay slightly before full logo animation ends to make it smooth

    // Final cleanup
    setTimeout(() => cleanup(), CLEANUP_DELAY);
  }

  function cleanup() {
    // Remove event listeners
    center.removeEventListener('click', startLaunch);
    center.removeEventListener('keydown', onKeydown);

    // Remove splash from DOM to free memory and stop painting
    if (splash && splash.parentNode) {
      splash.parentNode.removeChild(splash);
    }
    // Optional: dispatch an event so app can know splash finished
    try {
      window.dispatchEvent(new CustomEvent('splash:finished'));
    } catch(e){}
  }

  function onKeydown(e){
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      startLaunch();
    }
  }

  // Attach listeners
  center.addEventListener('click', startLaunch, {passive:true});
  center.addEventListener('keydown', onKeydown);

  // Optional: auto-skip after 6s in case user doesn't click
  const AUTO_SKIP_MS = 6000;
  const autoSkipTimer = setTimeout(() => {
    startLaunch();
  }, AUTO_SKIP_MS);

  // If the splash is removed before the timer, clear the timer in cleanup path
  // (cleanup will run anyway after animation).
})();
