(() => {
  'use strict';
  const paths = {
    external: '<path d="M14 3h7v7M21 3l-9 9"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    down: '<path d="M12 3v15M6 12l6 6 6-6"/>',
    up: '<path d="M12 21V6M6 12l6-6 6 6"/>',
    play: '<path class="fill" d="m8 5 11 7-11 7z"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    previous: '<path d="M18 5 9 12l9 7M6 5v14"/>',
    next: '<path d="m6 5 9 7-9 7M18 5v14"/>',
    volume: '<path d="M11 5 6 9H3v6h3l5 4zM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
    mute: '<path d="M11 5 6 9H3v6h3l5 4zM16 9l5 6M21 9l-5 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    expand: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'
  };
  window.VA_ICON=(name,label='')=>`<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name]||paths.external}</svg>${label?`<span>${label}</span>`:''}`;
  window.VA_BRAND=(name,label='')=>`<img class="brand-icon" src="assets/icons/brands/${name}.${name==='yandexmusic'||name==='zvuk'?'ico':'svg'}" alt="" aria-hidden="true">${label?`<span>${label}</span>`:''}`;
})();
