(() => {
  'use strict';
  const region=document.querySelector('.video-journey');
  const video=document.querySelector('.journey-video');
  if(!region||!video)return;
  let loaded=false,visible=false;
  const load=()=>{
    if(loaded)return;
    loaded=true;
    video.querySelectorAll('source[data-src]').forEach(source=>{source.src=source.dataset.src});
    video.load();
  };
  const update=()=>{
    if(visible&&!document.hidden){load();video.play().catch(()=>{})}
    else video.pause();
  };
  video.addEventListener('canplay',()=>video.classList.add('is-ready'),{once:true});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update()},{rootMargin:'500px 0px'}).observe(region);
  document.addEventListener('visibilitychange',update);
  window.addEventListener('pagehide',()=>video.pause());
})();
