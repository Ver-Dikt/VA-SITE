(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  document.querySelectorAll('.music,.signal,.live-section,.press,.booking').forEach(section=>{
    const field=document.createElement('div');
    field.className='ice-field';field.setAttribute('aria-hidden','true');
    for(let i=0;i<3;i++){const shard=document.createElement('i');shard.className='ice-shard';field.append(shard)}
    section.prepend(field);
  });
  const controls=document.createElement('div');controls.className='polar-controls';
  const toggle=document.createElement('button');toggle.type='button';toggle.textContent='Эффекты: вкл.';toggle.setAttribute('aria-pressed','true');
  const booking=document.createElement('a');booking.href='#booking';booking.textContent='Booking ↗';
  controls.append(toggle,booking);document.body.append(controls);
  toggle.addEventListener('click',()=>{
    const off=document.body.classList.toggle('effects-off');
    toggle.setAttribute('aria-pressed',String(!off));toggle.textContent=off?'Эффекты: выкл.':'Эффекты: вкл.';
    const scene=$('.motion-toggle');
    if(scene&&!scene.hidden&&scene.getAttribute('aria-pressed')!==String(off))scene.click();
  });
  if('IntersectionObserver' in window){
    const links=[...document.querySelectorAll('#nav a')];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      links.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
    }),{rootMargin:'-15% 0px -65% 0px'});
    document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));
  }
  const note=document.createElement('details');note.className='stats-note';
  const summary=document.createElement('summary');summary.textContent='О показателях и источниках';
  const text=document.createElement('p');
  text.textContent='Публичный срез: 7 сентября 2026. Instagram — сумма подписчиков двух профилей (1 137 + 2 330), аудитории могут пересекаться. VK — сумма округлённых просмотров пяти сетов. Яндекс 1M+ — данные артистов, период ещё не указан. Apple Music — число доступных здесь превью, а не прослушиваний. Цифры не обновляются автоматически.';
  note.append(summary,text);$('.proof-strip').after(note);
  const streaming=document.createElement('details');streaming.className='service-player';
  const heading=document.createElement('summary');heading.textContent='Слушать в Spotify';
  const choices=document.createElement('div');choices.className='service-choices';
  const slot=document.createElement('div');slot.className='service-slot';
  const artists=[['Ver-Dikt','5xu7pge6IjHBZN0bfjsbnj'],['Andy Dav','4jc91GzW3bSdGd4lucJHbH']];
  artists.forEach(([name,id])=>{
    const button=document.createElement('button');button.type='button';button.textContent=name;button.className='button';button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>{
      $('audio').pause();
      choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      const frame=document.createElement('iframe');frame.title='Spotify — '+name;
      frame.src='https://open.spotify.com/embed/artist/'+id+'?theme=0';
      frame.allow='encrypted-media; fullscreen; picture-in-picture';frame.referrerPolicy='strict-origin-when-cross-origin';
      slot.replaceChildren(frame);
    });choices.append(button);
  });
  streaming.append(heading,choices,slot);$('.music-console').after(streaming);
  const stopStreaming=()=>{slot.replaceChildren();choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'))};
  streaming.addEventListener('toggle',()=>{if(!streaming.open)stopStreaming()});
  $('audio').addEventListener('play',stopStreaming);
  window.addEventListener('pagehide',stopStreaming);
  // Static local content only. External media never receives page or account credentials.
  document.querySelectorAll('iframe').forEach(frame=>{frame.referrerPolicy='strict-origin-when-cross-origin'});
})();
