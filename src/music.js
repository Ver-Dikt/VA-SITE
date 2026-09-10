(() => {
'use strict';
const $=s=>document.querySelector(s),data=window.VA_CATALOGUE;
const audio=$('[data-audio]'),play=$('[data-play]'),progress=$('[data-progress]'),status=$('[data-audio-status]');
const tracks=data.tracks,art=$('[data-track-art]');
let current=0,request=0;
const format=t=>`${Math.floor((t||0)/60)}:${String(Math.floor((t||0)%60)).padStart(2,'0')}`;
const largeArt=url=>url ? url.replace(/\/\d+x\d+bb\.(jpg|webp)/i,'/600x600bb.$1') : '';
function state(){
  const running=!audio.paused;
  document.body.classList.toggle('is-playing',running);
  play.innerHTML=VA_ICON(running?'pause':'play');
  play.setAttribute('aria-label',running?'Пауза':'Воспроизвести превью');

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
  document.dispatchEvent(new Event('va:trackchange'));
}
async function start(){
  const token=++request;
  if(!audio.getAttribute('src'))audio.src=tracks[current].preview;
  status.textContent='Загрузка превью…';
  try{await audio.play();if(token===request)status.textContent=''}
  catch(error){if(token===request&&error.name!=='AbortError')status.textContent='Превью недоступно. Откройте полную версию в Apple Music.'}
  state();
}
play.addEventListener('click',()=>{if(audio.paused)start();else{request++;audio.pause();status.textContent=''}});
$('[data-prev]').addEventListener('click',()=>select(current-1));
$('[data-next]').addEventListener('click',()=>select(current+1));
$('[data-mute]').addEventListener('click',()=>{audio.muted=!audio.muted;$('[data-mute]').innerHTML=VA_ICON(audio.muted?'mute':'volume',audio.muted?'Звук выкл.':'Звук вкл.');$('[data-mute]').setAttribute('aria-pressed',String(audio.muted))});
audio.addEventListener('play',state); audio.addEventListener('pause',state);
audio.addEventListener('ended',()=>{status.textContent='Превью завершено. Полная версия — в Apple Music.';state()});
audio.addEventListener('error',()=>{if(audio.getAttribute('src'))status.textContent='Превью недоступно. Откройте полную версию в Apple Music.';state()});
function updateTime(){const duration=Number.isFinite(audio.duration)?audio.duration:0;progress.value=duration?audio.currentTime/duration*100:0;$('[data-time]').textContent=`${format(audio.currentTime)} / ${format(duration)}`;progress.setAttribute('aria-valuetext',`${format(audio.currentTime)} из ${format(duration)}`)}
audio.addEventListener('timeupdate',updateTime); audio.addEventListener('loadedmetadata',updateTime);
progress.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(progress.value)/100*audio.duration});
art.addEventListener('error',()=>{art.removeAttribute('src');art.alt='Обложка временно недоступна'});
$('[data-prev]').innerHTML=VA_ICON('previous');$('[data-next]').innerHTML=VA_ICON('next');$('[data-mute]').innerHTML=VA_ICON('volume','Звук вкл.');select(0);
window.addEventListener('pagehide',()=>{request++;audio.pause()});
})();

