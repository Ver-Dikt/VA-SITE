(() => {
  'use strict';
  const options=[['original','Оригинал','Текущий фон'],['glacier','Ледник','Голубой лёд и холодный свет'],['sunset','Полярный закат','Розовый снег и янтарный горизонт'],['night','Северная ночь','Бирюзовый и фиолетовый свет']];
  const panel=document.createElement('details');panel.className='theme-picker';
  panel.innerHTML='<summary aria-label="Выбрать оформление фона"><span class="theme-indicator" aria-hidden="true"></span>Фон</summary><div class="theme-options"><p>Север в разных красках</p></div>';
  const slot=panel.querySelector('.theme-options');
  function select(value){
    document.documentElement.dataset.northTheme=value;
    slot.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===value)));
    try{localStorage.setItem('va-north-theme',value)}catch{}
  }
  options.forEach(([value,label,description])=>{
    const button=document.createElement('button');button.type='button';button.dataset.theme=value;
    button.innerHTML=`<span class="theme-swatch swatch-${value}" aria-hidden="true"></span><span>${label}<small>${description}</small></span>`;
    button.addEventListener('click',()=>select(value));slot.append(button);
  });
  const note=document.createElement('small');note.className='theme-note';note.textContent='Только в вашем браузере. «Оригинал» возвращает прежний фон.';slot.append(note);
  document.body.append(panel);
  document.querySelectorAll('main>.section,main>.signal').forEach(section=>{const light=document.createElement('div');light.className='theme-atmosphere';light.setAttribute('aria-hidden','true');section.prepend(light)});
  let saved='original';try{saved=localStorage.getItem('va-north-theme')||saved}catch{}
  select(options.some(([key])=>key===saved)?saved:'original');
  document.addEventListener('pointerdown',e=>{if(!panel.contains(e.target))panel.open=false});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.open){panel.open=false;panel.querySelector('summary').focus()}});
})();
