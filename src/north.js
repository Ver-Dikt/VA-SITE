(() => {
  'use strict';
  const $=s=>document.querySelector(s);
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
  const link=(label,href)=>{
    const a=document.createElement('a');a.textContent=label;a.href=href;
    if(!href.startsWith('#')){a.target='_blank';a.rel='noopener noreferrer'}
    return a;
  };
  const groups=[
    ['Яндекс Музыка',window.VA_CONTENT.platforms.slice(0,2)],
    ['Spotify',window.VA_CONTENT.platforms.slice(2,4)],
    ['Apple Music',window.VA_CONTENT.platforms.slice(4,6)],
    ['SoundCloud',window.VA_CONTENT.platforms.slice(6,8)],
    ['Beatport',window.VA_CONTENT.platforms.slice(8,10)],
    ['Звук',window.VA_CONTENT.platforms.slice(10,12)]
  ];
  $('[data-platforms]').replaceChildren(...groups.map(([name,entries])=>{
    const card=document.createElement('div');card.className='platform-pair';
    const title=document.createElement('h3');title.textContent=name;
    const links=document.createElement('div');
    entries.forEach(([label,url])=>links.append(link(label.split(' · ')[1]+' ↗',url)));
    card.append(title,links);return card;
  }));
  const metricDestinations=[
    [['Ver-Dikt ↗',groups[0][1][0][1]],['Andy Dav ↗',groups[0][1][1][1]]],
    [['Ver-Dikt ↗','https://instagram.com/verdiktmusic/'],['Andy Dav ↗','https://instagram.com/andydavmusic/']],
    [['Канал дуэта ↗','https://t.me/verdiktandydav']],
    [['Пять live-сетов ↓','#live']],
    [['Ver-Dikt ↗',groups[4][1][0][1]],['Andy Dav ↗',groups[4][1][1][1]]],
    [['Выбрать трек ↓','#listen']]
  ];
  document.querySelectorAll('.proof-strip>a').forEach((original,index)=>{
    const card=document.createElement('div');card.className='metric-card';
    card.append(...original.childNodes);
    const links=document.createElement('div');links.className='metric-links';
    metricDestinations[index].forEach(([label,url])=>links.append(link(label,url)));
    card.append(links);original.replaceWith(card);
  });
  const note=document.createElement('details');note.className='stats-note';
  const summary=document.createElement('summary');summary.textContent='О показателях и источниках';
  const text=document.createElement('p');
  text.textContent='Публичный срез: 7 сентября 2026. Instagram — сумма подписчиков двух профилей (1 137 + 2 330), аудитории могут пересекаться. VK — сумма округлённых просмотров пяти сетов. Яндекс 1M+ — данные артистов, период ещё не указан. Apple Music — число доступных здесь превью, а не прослушиваний. Цифры не обновляются автоматически.';
  note.append(summary,text);$('.proof-strip').after(note);
  const streaming=document.createElement('details');streaming.className='service-player';
  const heading=document.createElement('summary');heading.textContent='Официальные плееры · Spotify и Apple Music';
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
  const apple=document.createElement('button');apple.type='button';apple.className='button';apple.textContent='Apple Music · выбранный трек';apple.setAttribute('aria-pressed','false');
  apple.addEventListener('click',()=>{
    $('audio').pause();
    choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===apple)));
    const url=new URL($('[data-apple-link]').href);
    if(url.hostname!=='music.apple.com')return;
    url.hostname='embed.music.apple.com';
    const frame=document.createElement('iframe');frame.title='Apple Music — '+$('[data-now]').textContent;
    frame.src=url.href;frame.allow='autoplay; encrypted-media; fullscreen';frame.referrerPolicy='strict-origin-when-cross-origin';
    slot.replaceChildren(frame);
  });choices.append(apple);
  const help=document.createElement('p');help.className='stream-help';help.textContent='Полное воспроизведение зависит от аккаунта, подписки и доступности сервиса. Прослушивание учитывается выбранной платформой по её правилам. Превью выше — для знакомства с треком.';
  streaming.append(heading,help,choices,slot);$('.music-console').after(streaming);
  const stopStreaming=()=>{slot.replaceChildren();choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'))};
  streaming.addEventListener('toggle',()=>{if(!streaming.open)stopStreaming()});
  $('audio').addEventListener('play',stopStreaming);
  document.addEventListener('va:trackchange',stopStreaming);
  window.addEventListener('pagehide',stopStreaming);
  // Static local content only. External media never receives page or account credentials.
  document.querySelectorAll('iframe').forEach(frame=>{frame.referrerPolicy='strict-origin-when-cross-origin'});
})();
