(() => {
'use strict';
const shell=document.querySelector('[data-site-audio]');
if(!shell)return;
const audio=shell.querySelector('[data-site-audio-track]');
const play=shell.querySelector('[data-site-audio-play]');
const mute=shell.querySelector('[data-site-audio-mute]');
const status=shell.querySelector('[data-site-audio-status]');
const preview=document.querySelector('[data-audio]');
let blocked=false;
audio.volume=.55;

function render(){
  const running=!audio.paused;
  shell.classList.toggle('is-playing',running);
  play.setAttribute('aria-label',running?'Поставить фоновую музыку на паузу':'Включить фоновую музыку');
  mute.innerHTML=VA_ICON(audio.muted?'mute':'volume');
  mute.setAttribute('aria-label',audio.muted?'Включить звук':'Выключить звук');
  mute.setAttribute('aria-pressed',String(audio.muted));
  status.textContent=running?(audio.muted?'Играет без звука':'Сейчас играет'):(blocked?'Включить музыку':'На паузе');
}

async function start(){
  if(preview&&!preview.paused)preview.pause();
  try{await audio.play();blocked=false}catch(error){if(error.name!=='AbortError')blocked=true}
  render();
}

play.addEventListener('click',()=>{if(audio.paused)start();else audio.pause()});
mute.addEventListener('click',()=>{audio.muted=!audio.muted;if(audio.paused)start();render()});
audio.addEventListener('play',render);audio.addEventListener('pause',render);audio.addEventListener('volumechange',render);
audio.addEventListener('error',()=>{blocked=true;status.textContent='Трек недоступен'});
if(preview)preview.addEventListener('play',()=>{if(!audio.paused)audio.pause()});
render();
start();
})();
