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
