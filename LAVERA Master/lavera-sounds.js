/* LAVÉRA Sound System - v9
   Uses the script URL to resolve audio files correctly from every page.
*/
(() => {
  const script = document.currentScript;
  const baseUrl = script ? new URL('./assets/sounds/', script.src).href : new URL('assets/sounds/', document.baseURI).href;
  const files = {
    click: 'click.wav', cart: 'add-to-cart.wav', success: 'success.wav',
    notification: 'notification.wav', error: 'error.wav', adminBell: 'admin-bell.wav', stockAlarm: 'stock-alarm.wav'
  };
  const cache = {};
  let muted = localStorage.getItem('lavera_sounds_muted') === '1';

  function play(key) {
    if (muted || !files[key]) return;
    try {
      let audio = cache[key];
      if (!audio) {
        audio = cache[key] = new Audio(new URL(files[key], baseUrl).href);
        audio.preload = 'auto';
      }
      audio.currentTime = 0;
      audio.volume = key === 'stockAlarm' ? 0.34 : (key === 'adminBell' || key === 'notification' ? 0.38 : 0.24);
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    } catch (_) {}
  }

  // First real user interaction unlocks/starts audio in browsers that require a gesture.
  document.addEventListener('click', (e) => {
    const el = e.target.closest && e.target.closest('button, a, [role="button"]');
    if (!el) return;
    const custom = el.dataset.sound;
    if (custom === 'off') return;
    play(custom && files[custom] ? custom : 'click');
  }, true);

  // Expose API for app.js and other pages.
  window.LAVERA_SOUNDS = {
    click: () => play('click'), cart: () => play('cart'), success: () => play('success'),
    notification: () => play('notification'), adminBell: () => play('adminBell'), stockAlarm: () => play('stockAlarm'), error: () => play('error'),
    mute: () => { muted = true; localStorage.setItem('lavera_sounds_muted','1'); },
    unmute: () => { muted = false; localStorage.setItem('lavera_sounds_muted','0'); },
    isMuted: () => muted
  };
})();
