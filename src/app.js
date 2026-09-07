(() => {
'use strict';
const c=window.VA_CONTENT, $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const ext='target="_blank" rel="noopener noreferrer"';
$('[data-platforms]').innerHTML=c.platforms.map(([name,href])=>`<a href="${href}" ${ext}>${name} ↗</a>`).join('');
$('[data-socials]').innerHTML=c.social.map(([name,href])=>`<a href="${href}" ${ext}>${name} ↗</a>`).join('');
$('[data-videos]').innerHTML=c.videos.map(([name,place,img,id])=>`<article class="video"><div class="video-image"><iframe src="https://vkvideo.ru/video_ext.php?oid=-213504350&id=${id}&hd=2" title="${name} — live-сет Ver-Dikt & Andy Dav" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div><h3>${name}</h3><p>${place}</p><a href="https://vkvideo.ru/video-213504350_${id}" ${ext}>Открыть в VK Видео ↗</a></article>`).join('');
$('[data-bio]').textContent=c.bio;
$('[data-year]').textContent=new Date().getFullYear();
$('[data-downloads]').innerHTML=c.downloads.map(([name,desc,href])=>`<a href="${href}" download><span><strong>${name}</strong><small>${desc}</small></span><span class="arrow" aria-hidden="true">↓</span></a>`).join('');
const dialog=$('dialog'), gallery=$('[data-photos]');
c.photos.forEach(([img,alt])=>{const b=document.createElement('button');b.className='photo';b.type='button';b.setAttribute('aria-label',`Увеличить: ${alt}`);b.innerHTML=`<img src="assets/images/${img}.webp" alt="${alt}" loading="lazy"><span aria-hidden="true">↗</span>`;b.addEventListener('click',()=>{dialog.querySelector('img').src=`assets/images/${img}.webp`;dialog.querySelector('img').alt=alt;dialog.querySelector('p').textContent=alt;dialog.showModal();document.body.classList.add('modal-open')});gallery.append(b)});
$('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const menu=$('.menu-toggle'),nav=$('#nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню')}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
$('[data-copy]').addEventListener('click',async()=>{const status=$('[data-copy-status]');try{await navigator.clipboard.writeText(c.bio);status.textContent='Биография скопирована.'}catch{const selection=window.getSelection(),range=document.createRange();range.selectNodeContents($('[data-bio]'));selection.removeAllRanges();selection.addRange(range);status.textContent='Текст выделен. Скопируйте его вручную.'}});
})();
