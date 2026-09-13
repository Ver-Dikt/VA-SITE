(() => {
  'use strict';
  const files=['010','012','025','036','037','052','054','057','058','061','062','065','066','070','073','075','076','079','082','090','107','114','115','117'];
  const portrait=new Set(['010','012','037','054','079','115','117']);
  const grid=document.querySelector('[data-photo-grid]');
  grid.innerHTML=files.map((name,index)=>`<a class="photo-card ${portrait.has(name)?'portrait':'landscape'}" href="assets/photos/originals/${name}.jpg" download="Ver-Dikt-and-Andy-Dav-${name}.jpg" aria-label="Скачать промофотографию ${name} в полном разрешении"><img src="assets/photos/thumbs/${name}.webp" alt="Промофотография Ver-Dikt и Andy Dav ${name}" width="900" height="900" ${index<6?'fetchpriority="high"':'loading="lazy"'} decoding="async"><span class="photo-action"><span>ФОТО ${String(index+1).padStart(2,'0')}</span><span>Скачать оригинал ↓</span></span></a>`).join('');
  document.querySelector('[data-count]').textContent=files.length;
  document.querySelector('[data-year]').textContent=new Date().getFullYear();
})();
