(() => {
'use strict';
const $=s=>document.querySelector(s), data=window.VA_CATALOGUE;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ext='target="_blank" rel="noopener noreferrer"';
const today=new Date().toLocaleDateString('en-CA');
const date=s=>s.split('-').reverse().join('.');
const featured=[4,7,10,12,16,17].map(i=>data.releases[i]);
$('[data-releases]').innerHTML=featured.map(r=>`<a class="release" href="${escape(r.url)}" ${ext}><div class="release-art"><img src="${escape(r.image)}" alt="Обложка ${escape(r.title)}" width="250" height="250" loading="lazy"><span aria-hidden="true">↗</span></div><div class="release-meta"><div><h3>${escape(r.title)}</h3><p>${escape(r.label)}</p></div><span>${date(r.date)}</span></div></a>`).join('');
document.querySelectorAll('.release-art img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;const p=document.createElement('p');p.className='art-fallback';p.textContent=img.alt.replace('Обложка ','');img.parentElement.prepend(p)},{once:true}));
const search=$('[data-release-search]'),year=$('[data-release-year]'),archive=$('[data-archive]'),more=$('[data-more-releases]');let limit=12;
[...new Set(data.releases.map(r=>r.date.slice(0,4)))].forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;year.append(o)});
function renderArchive(focusNew=false){const found=data.releases.filter(r=>(!year.value||r.date.startsWith(year.value))&&`${r.title} ${r.label}`.toLowerCase().includes(search.value.trim().toLowerCase()));const old=archive.children.length;
archive.innerHTML=found.slice(0,limit).map(r=>`<a class="archive-row" href="${escape(r.url)}" ${ext}><time datetime="${r.date}">${date(r.date)}</time><span class="archive-title">${escape(r.title)}${r.date>today?'<small>СКОРО</small>':''}</span><span class="archive-label">${escape(r.label)}</span><span aria-hidden="true">↗</span></a>`).join('');
$('[data-release-count]').textContent=found.length?`Показано ${Math.min(limit,found.length)} из ${found.length}`:'Ничего не найдено. Попробуйте другое название или год.';more.hidden=limit>=found.length;
if(focusNew)archive.children[old]?.focus({preventScroll:true});}
search.addEventListener('input',()=>{limit=12;renderArchive()});year.addEventListener('change',()=>{limit=12;renderArchive()});more.addEventListener('click',()=>{limit+=18;renderArchive(true)});renderArchive();

const audio=$('[data-audio]'),play=$('[data-play]'),progress=$('[data-progress]'),status=$('[data-audio-status]');
const tracks=data.tracks, trackSearch=$('[data-track-search]'),trackList=$('[data-tracks]');let current=0,trackLimit=6,request=0;
const format=t=>`${Math.floor((t||0)/60)}:${String(Math.floor((t||0)%60)).padStart(2,'0')}`;
function renderTracks(focusNew=false){const old=trackList.children.length;const found=tracks.map((r,i)=>({...r,index:i})).filter(r=>`${r.title} ${r.artist}`.toLowerCase().includes(trackSearch.value.trim().toLowerCase()));
trackList.innerHTML=found.slice(0,trackLimit).map(r=>`<button class="track" type="button" data-track="${r.index}" aria-label="Превью: ${escape(r.title)}" aria-pressed="false"><span class="number">${String(r.index+1).padStart(2,'0')}</span><span class="track-info">${escape(r.title)}<small>${escape(r.artist)}</small></span><span aria-hidden="true">▶</span></button>`).join('');
if(!found.length){const p=document.createElement('p');p.className='source-note';p.textContent='Трек не найден. Попробуйте другое название.';trackList.append(p)}
$('[data-more-tracks]').hidden=trackLimit>=found.length;state();if(focusNew)trackList.children[old]?.focus({preventScroll:true});}
function state(){const running=!audio.paused;document.body.classList.toggle('is-playing',running);play.textContent=running?'Ⅱ':'▶';play.setAttribute('aria-label',running?'Пауза':'Воспроизвести превью');trackList.querySelectorAll('[data-track]').forEach(b=>{const active=Number(b.dataset.track)===current;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active&&running));b.lastElementChild.textContent=active&&running?'Ⅱ':'▶'})}
function select(i){request++;audio.pause();audio.removeAttribute('src');audio.load();current=(i+tracks.length)%tracks.length;const t=tracks[current];$('[data-now]').textContent=t.title;$('[data-apple-link]').href=t.url;$('[data-itunes-link]').href=t.url+'&app=itunes';progress.value=0;$('[data-time]').textContent='0:00 / 0:00';status.textContent='';state()}
function stopSpotify(){const frame=$('[data-spotify] iframe');if(frame){frame.remove();const p=$('[data-spotify] p');if(p)p.textContent='Плеер Spotify остановлен.';$('[data-load-spotify]').hidden=false}}
async function start(){stopSpotify();const token=++request;if(!audio.getAttribute('src'))audio.src=tracks[current].preview;status.textContent='Загрузка превью…';try{await audio.play();if(token===request)status.textContent=''}catch(e){if(token===request&&e.name!=='AbortError')status.textContent='Превью недоступно. Откройте полную версию в Apple Music.'}state()}
trackList.addEventListener('click',e=>{const b=e.target.closest('[data-track]');if(!b)return;const i=Number(b.dataset.track);if(i===current&&!audio.paused){request++;audio.pause()}else{if(i!==current)select(i);start()}});
play.addEventListener('click',()=>{if(audio.paused)start();else{request++;audio.pause();status.textContent=''}});
// Selecting a neighbour never starts it; finishing a preview never starts another.
$('[data-prev]').addEventListener('click',()=>select(current-1));$('[data-next]').addEventListener('click',()=>select(current+1));
$('[data-mute]').addEventListener('click',()=>{audio.muted=!audio.muted;$('[data-mute]').textContent=audio.muted?'Звук выкл.':'Звук вкл.';$('[data-mute]').setAttribute('aria-pressed',String(audio.muted))});
audio.addEventListener('play',state);audio.addEventListener('pause',state);audio.addEventListener('ended',()=>{status.textContent='Превью завершено. Полная версия — в Apple Music.';state()});audio.addEventListener('error',()=>{if(audio.getAttribute('src'))status.textContent='Превью недоступно. Откройте полную версию в Apple Music.';state()});
function updateTime(){const d=Number.isFinite(audio.duration)?audio.duration:0;progress.value=d?audio.currentTime/d*100:0;$('[data-time]').textContent=`${format(audio.currentTime)} / ${format(d)}`;progress.setAttribute('aria-valuetext',`${format(audio.currentTime)} из ${format(d)}`)}
audio.addEventListener('timeupdate',updateTime);audio.addEventListener('loadedmetadata',updateTime);progress.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(progress.value)/100*audio.duration});
trackSearch.addEventListener('input',()=>{trackLimit=6;renderTracks()});$('[data-more-tracks]').addEventListener('click',()=>{trackLimit+=8;renderTracks(true)});renderTracks();select(0);
window.addEventListener('pagehide',()=>{request++;audio.pause();stopSpotify()});
const spotifyButton=$('[data-load-spotify]');spotifyButton.addEventListener('click',()=>{request++;audio.pause();const iframe=document.createElement('iframe');iframe.title='Spotify — музыка Ver-Dikt';iframe.src='https://open.spotify.com/embed/artist/5xu7pge6IjHBZN0bfjsbnj?theme=0';iframe.allow='encrypted-media; fullscreen; picture-in-picture';iframe.loading='lazy';$('[data-spotify]').append(iframe);spotifyButton.hidden=true;});
$('.streaming').addEventListener('toggle',()=>{if(!$('.streaming').open)stopSpotify()});
})();
