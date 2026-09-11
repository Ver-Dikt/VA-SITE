(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  if('IntersectionObserver' in window){
    const links=[...document.querySelectorAll('#nav a')];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      links.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
    }),{rootMargin:'-15% 0px -65% 0px'});
    document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));
  }
  const link=(label,href)=>{
    const a=document.createElement('a');a.textContent=label.replace(/[↗↓]/g,'').trim();a.insertAdjacentHTML('beforeend',VA_ICON(href.startsWith('#')?'down':'external'));a.href=href;
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
  $('[data-platforms]').replaceChildren(...groups.filter(([name])=>name!=='Яндекс Музыка').map(([name,entries])=>{
    const card=document.createElement('div');card.className='platform-pair';
    const title=document.createElement('h3');title.innerHTML=VA_BRAND({'Spotify':'spotify','Apple Music':'applemusic','SoundCloud':'soundcloud','Звук':'zvuk','Beatport':'beatport'}[name],name);
    const links=document.createElement('div');
    entries.forEach(([label,url])=>links.append(link(label.split(' · ')[1]+' ↗',url)));
    if(name==='Beatport'){card.classList.add('buy-music');title.innerHTML=VA_BRAND('beatport','Купить музыку на Beatport')}card.append(title,links);return card;
  }));
  const metricDestinations=[
    [['Ver-Dikt ↗',groups[0][1][0][1]],['Andy Dav ↗',groups[0][1][1][1]]],
    [['Ver-Dikt ↗','https://instagram.com/verdiktmusic/'],['Andy Dav ↗','https://instagram.com/andydavmusic/']],
    [['Канал дуэта ↗','https://t.me/verdiktandydav']],
    [['Канал дуэта ↗','https://vk.ru/verdiktandydav']],
    [['Ver-Dikt ↗',groups[4][1][0][1]],['Andy Dav ↗',groups[4][1][1][1]]],
    [['Выбрать трек ↓','#listen']]
  ];
  document.querySelectorAll('.proof-strip>a').forEach((original,index)=>{
    const card=document.createElement('div');card.className='metric-card';
    card.insertAdjacentHTML('afterbegin',VA_BRAND(['yandexmusic','instagram','telegram','vk','beatport','applemusic'][index]));card.append(...original.childNodes);
    const links=document.createElement('div');links.className='metric-links';
    metricDestinations[index].forEach(([label,url])=>links.append(link(label,url)));
    card.append(links);original.replaceWith(card);
  });
  const note=document.createElement('details');note.className='stats-note';
  const summary=document.createElement('summary');summary.textContent='О показателях и источниках';
  const text=document.createElement('p');
  text.textContent='Instagram и Telegram — публичный срез на 7 сентября 2026. Instagram: сумма двух профилей (1 137 + 2 330), аудитории могут пересекаться. Яндекс Музыка: более 2 млн прослушиваний за год, по данным артистов от 11 сентября 2026. Цифры не обновляются автоматически.';
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
  // Decorate static and generated links with the same accessible local icon set.
  const brands=[[/yandex\.ru|music\.yandex/,'yandexmusic'],[/spotify/,'spotify'],[/apple\.com/,'applemusic'],[/soundcloud/,'soundcloud'],[/beatport/,'beatport'],[/zvuk/,'zvuk'],[/t\.me/,'telegram'],[/instagram/,'instagram'],[/youtube/,'youtube'],[/vk\.|vkvideo/,'vk']];
  document.querySelectorAll('a,button,.coord h3,.booking h2>span').forEach(el=>{
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    let arrow='';nodes.forEach(n=>{const match=n.textContent.match(/[↗↓↑×]/);if(match){arrow=match[0];n.textContent=n.textContent.replace(/[↗↓↑×]/g,'').trimEnd()}});
    if(arrow&&!el.querySelector('.ui-icon'))el.insertAdjacentHTML('beforeend',VA_ICON(el.matches('[data-copy]')?'copy':el.matches('.photo')?'expand':arrow==='↓'?'down':arrow==='↑'?'up':arrow==='×'?'close':'external'));
    if(el.tagName==='A'&&!el.closest('.metric-links,.platform-pair')&&!el.querySelector('.brand-icon')){
      const brand=brands.find(([pattern])=>pattern.test(el.href));
      if(brand)el.insertAdjacentHTML('afterbegin',VA_BRAND(brand[1]));
      else if(el.href.startsWith('mailto:'))el.insertAdjacentHTML('afterbegin',VA_ICON('mail'));
    }
  });
  // Static local content only. External media never receives page or account credentials.
  document.querySelectorAll('iframe').forEach(frame=>{frame.referrerPolicy='strict-origin-when-cross-origin'});
})();
