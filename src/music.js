(() => {
'use strict';
const $=s=>document.querySelector(s),data=window.VA_CATALOGUE;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const audio=$('[data-audio]'),play=$('[data-play]'),progress=$('[data-progress]'),status=$('[data-audio-status]');
const tracks=data.tracks,trackSearch=$('[data-track-search]'),trackList=$('[data-tracks]'),art=$('[data-track-art]');
let current=0,trackLimit=8,request=0;
const format=t=>`${Math.floor((t||0)/60)}:${String(Math.floor((t||0)%60)).padStart(2,'0')}`;
const largeArt=url=>url ? url.replace(/\/\d+x\d+bb\.(jpg|webp)/i,'/600x600bb.$1') : '';
function renderTracks(focusNew=false){
  const old=trackList.children.length,query=trackSearch.value.trim().toLowerCase();
  const found=tracks.map((track,index)=>({...track,index})).filter(track=>`${track.title} ${track.artist}`.toLowerCase().includes(query));
  trackList.innerHTML=found.slice(0,trackLimit).map(track=>`<button class="track" type="button" data-track="${track.index}" aria-label="Превью: ${escape(track.title)}" aria-pressed="false"><span class="number">${String(track.index+1).padStart(2,'0')}</span><span class="track-info">${escape(track.title)}<small>${escape(track.artist)}</small></span><span aria-hidden="true">▶</span></button>`).join('');
  if(!found.length)trackList.innerHTML='<p class="source-note">Трек не найден. Попробуйте другое название.</p>';
  $('[data-more-tracks]').hidden=trackLimit>=found.length;
  state();
  if(focusNew)trackList.children[old]?.focus({preventScroll:true});
}
function state(){
  const running=!audio.paused;
  document.body.classList.toggle('is-playing',running);
  play.textContent=running?'Ⅱ':'▶';
  play.setAttribute('aria-label',running?'Пауза':'Воспроизвести превью');
  trackList.querySelectorAll('[data-track]').forEach(button=>{
    const active=Number(button.dataset.track)===current;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active&&running));
    button.lastElementChild.textContent=active&&running?'Ⅱ':'▶';
  });
}
function select(index){
  request++; audio.pause(); audio.removeAttribute('src'); audio.load();
  current=(index+tracks.length)%tracks.length;
  const track=tracks[current];
  $('[data-now]').textContent=track.title;
  $('[data-now-artist]').textContent=track.artist;
  $('[data-track-number]').textContent=String(current+1).padStart(2,'0');
  art.src=largeArt(track.image); art.alt=`Обложка ${track.title}`;
  $('[data-apple-link]').href=track.url;
  $('[data-itunes-link]').href=`${track.url}${track.url.includes('?')?'&':'?'}app=itunes`;
  progress.value=0; $('[data-time]').textContent='0:00 / 0:00'; status.textContent=''; state();
}
async function start(){
  const token=++request;
  if(!audio.getAttribute('src'))audio.src=tracks[current].preview;
  status.textContent='Загрузка превью…';
  try{await audio.play();if(token===request)status.textContent=''}
  catch(error){if(token===request&&error.name!=='AbortError')status.textContent='Превью недоступно. Откройте полную версию в Apple Music.'}
  state();
}
trackList.addEventListener('click',event=>{
  const button=event.target.closest('[data-track]'); if(!button)return;
  const index=Number(button.dataset.track);
  if(index===current&&!audio.paused){request++;audio.pause();status.textContent=''}
  else{if(index!==current)select(index);start()}
});
play.addEventListener('click',()=>{if(audio.paused)start();else{request++;audio.pause();status.textContent=''}});
$('[data-prev]').addEventListener('click',()=>select(current-1));
$('[data-next]').addEventListener('click',()=>select(current+1));
$('[data-mute]').addEventListener('click',()=>{audio.muted=!audio.muted;$('[data-mute]').textContent=audio.muted?'Звук выкл.':'Звук вкл.';$('[data-mute]').setAttribute('aria-pressed',String(audio.muted))});
audio.addEventListener('play',state); audio.addEventListener('pause',state);
audio.addEventListener('ended',()=>{status.textContent='Превью завершено. Полная версия — в Apple Music.';state()});
audio.addEventListener('error',()=>{if(audio.getAttribute('src'))status.textContent='Превью недоступно. Откройте полную версию в Apple Music.';state()});
function updateTime(){const duration=Number.isFinite(audio.duration)?audio.duration:0;progress.value=duration?audio.currentTime/duration*100:0;$('[data-time]').textContent=`${format(audio.currentTime)} / ${format(duration)}`;progress.setAttribute('aria-valuetext',`${format(audio.currentTime)} из ${format(duration)}`)}
audio.addEventListener('timeupdate',updateTime); audio.addEventListener('loadedmetadata',updateTime);
progress.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(progress.value)/100*audio.duration});
trackSearch.addEventListener('input',()=>{trackLimit=8;renderTracks()});
$('[data-more-tracks]').addEventListener('click',()=>{trackLimit+=10;renderTracks(true)});
art.addEventListener('error',()=>{art.removeAttribute('src');art.alt='Обложка временно недоступна'});
renderTracks(); select(0);
window.addEventListener('pagehide',()=>{request++;audio.pause()});
})();
