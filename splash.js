/* splash.js - Плавная заставка */
(function(){
  const FADE_OUT_DELAY = 2500; // 2.5 секунды
  const REMOVE_DELAY = 3300;

  const splash = document.getElementById('splash');
  if (!splash) return;

  const center = splash.querySelector('.splash-center');

  function startLaunch() {
    if (splash.classList.contains('launch')) return;
    splash.classList.add('launch');

    setTimeout(() => {
      splash.classList.add('removing');
    }, 800);

    setTimeout(() => cleanup(), REMOVE_DELAY);
  }

  function cleanup() {
    center.removeEventListener('click', startLaunch);
    center.removeEventListener('keydown', onKeydown);
    center.removeEventListener('touchstart', startLaunch);

    if (splash && splash.parentNode) {
      splash.parentNode.removeChild(splash);
    }

    try {
      window.dispatchEvent(new CustomEvent('splash:finished'));
    } catch(e) {}
  }

  function onKeydown(e){
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      startLaunch();
    }
  }

  center.addEventListener('click', startLaunch, {passive: true});
  center.addEventListener('touchstart', startLaunch, {passive: true});
  center.addEventListener('keydown', onKeydown);

  setTimeout(() => {
    startLaunch();
  }, FADE_OUT_DELAY);

  setTimeout(() => {
    if (!splash.classList.contains('launch')) {
      startLaunch();
    }
  }, 3500);
})();