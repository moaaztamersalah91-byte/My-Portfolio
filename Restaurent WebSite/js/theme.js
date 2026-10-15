/* Taste House: single owner for appearance state. */
(function(){'use strict';
  const key='th_appearance';
  function get(){try{const raw=JSON.parse(localStorage.getItem(key));if(raw==='dark'||raw==='light')return raw;}catch(_){}return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
  function apply(value){const mode=value==='dark'?'dark':'light';document.documentElement.setAttribute('data-theme',mode);document.documentElement.style.colorScheme=mode;return mode;}
  function toggle(){const next=get()==='dark'?'light':'dark';try{localStorage.setItem(key,JSON.stringify(next));}catch(_){}return apply(next);}
  window.TasteTheme=Object.freeze({get,apply,toggle});apply(get());
})();
