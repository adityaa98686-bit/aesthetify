(() => {
  'use strict';
  if (document.getElementById('aesthetify-lyrics-host')) return;
  const core = globalThis.AesthetifyCore;
  const host = document.createElement('div'); host.id='aesthetify-lyrics-host';
  const shadow = host.attachShadow({mode:'open'});
  const css=document.createElement('link');css.rel='stylesheet';css.href=chrome.runtime.getURL('stage.css');shadow.append(css);
  const wrapper=document.createElement('div');
  // Static markup only. Track metadata and imported lyrics are assigned via textContent.
  wrapper.innerHTML=`<button class="launcher"><b>✦</b> Enter immersive</button>
  <section class="stage" data-theme="love" aria-label="Aesthetify Lyrics immersive player" hidden>
  <img class="cover-backdrop" hidden alt=""><canvas aria-hidden="true"></canvas><div class="wash"></div><canvas class="glass-rain" aria-hidden="true"></canvas>
  <header class="top"><div class="identity"><div class="brand">AESTHETIFY</div><nav class="stage-creator" aria-label="Made by ADITYA"><span>Made by <strong>ADITYA</strong></span><a href="https://www.linkedin.com/in/aditya-jain-72170037b/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://github.com/adityaa98686-bit" target="_blank" rel="noopener noreferrer">GitHub ↗</a></nav></div><form class="aesthetify-search" role="search" aria-label="Search Spotify"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search songs, artists, albums" placeholder="Search songs, artists, albums" maxlength="200" autocomplete="off"><button type="submit" aria-label="Search Spotify">↵</button></form><div class="actions"><select aria-label="Visual theme"><option value="auto">Auto palette</option><option value="emerald">Emerald Gold</option><option value="love">Rose Quartz</option><option value="rain">Midnight Rain</option><option value="fire">Solar Fire</option><option value="violet">Violet Dream</option><option value="ocean">Ocean Glow</option><option value="amber">Golden Hour</option></select><button class="import">Settings</button><button class="close" aria-label="Close immersive view">✕</button></div></header>
  <div class="main"><aside class="card"><div class="cover"><span>♫</span><img hidden alt="Album artwork"></div><h1 class="title">Waiting for Spotify</h1><p class="artist">Play a song to begin</p></aside><div class="lyric-visual"><div class="orb-lane" role="img" aria-label="Ambient glow"><div class="orb-floor"></div><div class="sound-orb"></div><div class="orb-shadow"></div></div><div class="interlude" hidden aria-label="Instrumental music animation"><div class="music-ring"></div><div class="music-symbol" aria-hidden="true">♪</div><div class="music-bars" aria-hidden="true"></div><div class="music-satellite" aria-hidden="true">✦</div></div><div class="lyric-area"><div class="previous"></div><div class="current">Your music.<br>Your atmosphere.</div><div class="next">Open Spotify’s lyrics preview, then enter immersive.</div><div class="reflection" aria-hidden="true" hidden></div></div></div></div>
  <footer class="bottom"><div class="status" role="status">Choose a song to begin.</div></footer>
  <div class="dialog" hidden><section class="panel" role="dialog" aria-modal="true" aria-labelledby="settings-title"><h2 id="settings-title">Make it yours.</h2><label><input class="rain-glass" type="checkbox" checked> Window droplets in Midnight Rain</label><label><input class="auto-open" type="checkbox" checked> Open immersive automatically when playback starts</label><details class="advanced"><summary>Personal lyrics</summary><label>Show <select class="source" aria-label="Lyrics source"><option value="native">Spotify lyrics</option><option value="timed">My lyrics</option></select></label><p>Add a timed lyric file (.lrc or .json). Files stay on this device.</p><input type="file" accept=".lrc,.json,.txt" aria-label="Import timed lyrics"><label>Lyric delay (seconds) <input class="offset" type="number" min="-30" max="30" step="0.1" value="0"></label><button class="control clear">Remove my lyrics</button></details><p class="feedback" role="status"></p><button class="control done">Done</button></section></div></section>`;
  shadow.append(wrapper);document.documentElement.append(host);
  const dock=document.createElement('section');dock.className='player-dock';dock.setAttribute('aria-label','Aesthetify player');
  dock.innerHTML=`<div class="dock-track"><div class="dock-art"><span>♫</span><img hidden alt="Current album cover"></div><div class="dock-meta"><strong class="dock-title">Ready when you are</strong><span class="dock-artist">Spotify Web</span></div></div><div class="dock-center"><div class="dock-transport"><button class="dock-prev" aria-label="Previous track">⏮</button><button class="dock-play" aria-label="Play">▶</button><button class="dock-next" aria-label="Next track">⏭</button></div><div class="dock-timeline"><span class="elapsed">—:—</span><input class="dock-seek" type="range" min="0" max="1000" step="1" value="0" aria-label="Seek position" disabled><span class="duration">—:—</span></div></div><div class="dock-tools"><button class="dock-mute" aria-label="Mute">◖))</button><input class="dock-volume" type="range" min="0" max="100" value="100" aria-label="Volume"><button class="dock-immersive" aria-label="Toggle immersive view" title="Immersive view">✦</button><button class="dock-native" aria-label="Show Spotify player" title="Show Spotify player">↗</button></div>`;
  shadow.append(dock);
  const restore=document.createElement('button');restore.className='restore-dock';restore.textContent='✦ Aesthetify player';restore.hidden=true;shadow.append(restore);

  const $=s=>shadow.querySelector(s), stage=$('.stage'), canvas=$('canvas'), ctx=canvas.getContext('2d'), glass=$('.glass-rain'),glassCtx=glass.getContext('2d');
  let opened=false, key='', lines=[], offset=0, lastLine='', trackTitle='', previousFocus, requestToken=0;
  let moodChoice='auto', moodLocked=false, suggestedMood='emerald';
  let motion=0,lastMotion=performance.now(),interlude=false,lastSlide='';
  const V=globalThis.AesthetifyVisuals,P=globalThis.AesthetifyPlayer;
  let scrubbing=false;
  for(let i=0;i<25;i++)$('.music-bars').append(document.createElement('i'));
  let rainEnabled=true;
  let sourceMode='native', autoOpen=true, wasPlaying=false, lyricsAttemptedFor='';
  let state={position:NaN,playing:false,title:'',artist:'',art:''};
  const storage = chrome.storage.local;
  function toggle(force,refresh=true){opened=force??!opened;stage.hidden=!opened;$('.launcher').hidden=opened;if(opened){previousFocus=document.activeElement;$('.close').focus();resize();if(refresh)poll();}else{ $('.dialog').hidden=true;previousFocus?.focus?.();}}
  $('.launcher').onclick=()=>toggle(true);$('.close').onclick=()=>toggle(false);
    $('.aesthetify-search').onsubmit=async e=>{
    e.preventDefault();const target=globalThis.AesthetifySearch.url($('.aesthetify-search input').value);if(!target)return;
    const route=new URL(target).pathname;
    if(location.pathname===route){toggle(false);return;}
    // Prefer Spotify's own search input so its SPA can preserve active playback.
    if(globalThis.AesthetifySearch.submitToVisibleInput($('.aesthetify-search input').value)){
      toggle(false);await new Promise(resolve=>setTimeout(resolve,500));
      if(location.pathname===route)return;
    }
    try{await storage.set({'aesthetify-search-reveal':{expires:Date.now()+15000}});}catch{}
    const anchor=document.createElement('a');anchor.href=target;anchor.hidden=true;document.body.append(anchor);
    // Delegated Spotify navigation can handle its own link; full navigation is a safe fallback.
    anchor.click();anchor.remove();toggle(false);
  };

  chrome.runtime.onMessage.addListener(m=>{
    if(m.type==='aesthetify-toggle')toggle();
    if(m.type==='aesthetify-show-native-player'){dock.hidden=true;restore.hidden=false;toggle(false);}
  });


  function settings(show){$('.dialog').hidden=!show;if(show)$('.auto-open').focus();else $('.import').focus();}
  $('.import').onclick=()=>settings(true);$('.done').onclick=()=>settings(false);
  shadow.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.stopPropagation();if(!$('.dialog').hidden)settings(false);else toggle(false);}
    if(e.key==='Tab'&&opened){const scope=$('.dialog').hidden?shadow:$('.panel');const nodes=[...scope.querySelectorAll('button,input,select,summary')].filter(n=>!n.closest('[hidden]')&&n.getClientRects().length);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&shadow.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&shadow.activeElement===last){e.preventDefault();first.focus();}}
  });
  const native=(sels)=>sels.map(s=>document.querySelector(s)).find(Boolean);
  const text=(sels)=>native(sels)?.textContent?.trim()||'';
  function readSpotify(){
    const link=native(['[data-testid="now-playing-widget"] a[data-testid="context-item-link"]','[data-testid="now-playing-widget"] a[href*="/track/"]','a[data-testid="context-item-link"]']);
    const title=link?.textContent?.trim()||'';
    const artist=text(['[data-testid="context-item-info-artist"]','[data-testid="now-playing-widget"] a[href*="/artist/"]']);
    const range=native(['[data-testid="playback-progressbar"] input','[data-testid="playback-progressbar"] [role="slider"]']);
    const stamp=text(['[data-testid="playback-position"]']);
    let position=core.seconds(stamp||'invalid');
    if(!Number.isFinite(position)&&range){const val=Number(range.getAttribute('aria-valuenow'));const max=Number(range.getAttribute('aria-valuemax'));const duration=core.seconds(text(['[data-testid="playback-duration"]']));if(range.hasAttribute('aria-valuenow')&&Number.isFinite(duration)&&max>0)position=val/max*duration;}
    const play=native(['[data-testid="control-button-playpause"]']);
    const art=native(['[data-testid="now-playing-widget"] img','[data-testid="cover-art-image"]','footer img']);
    const duration=core.seconds(text(['[data-testid="playback-duration"]'])||'invalid');
    const volumeNode=P.find('volume');const volumeInput=volumeNode?.tagName==='INPUT';const volume=volumeInput?(Number(volumeNode.value)-(Number(volumeNode.min)||0))/((Number(volumeNode.max)||100)-(Number(volumeNode.min)||0)):(volumeNode?.getAttribute('aria-valuenow')!=null?Number(volumeNode.getAttribute('aria-valuenow'))/(Number(volumeNode.getAttribute('aria-valuemax'))||100):NaN);
    return {title,artist,position,duration,volume,playing:P.isPlaying(play,Boolean(title)),art:art?.currentSrc||art?.src||'',id:link?.getAttribute('href')||`${title}|${artist}`};
  }
  async function poll(){
    if(document.hidden)return;
    state=readSpotify();
    const started=state.playing&&!wasPlaying;
    wasPlaying=state.playing;
    if(started)lyricsAttemptedFor='';
    if(autoOpen&&started&&!opened)toggle(true,false);
    updateDock();
    if(!opened)return;
    if(sourceMode==='native'&&state.playing&&lyricsAttemptedFor!==state.id){
      lyricsAttemptedFor=state.id;
      globalThis.AesthetifyNativeLyrics.ensureOpen();
    }

    const nextKey=state.title?'aesthetify-track:'+state.id:'';
    if(nextKey!==key){key=nextKey;moodChoice='auto';moodLocked=false;motion=0;lastSlide='';lines=[];offset=0;lastLine='';$('.feedback').textContent='';const token=++requestToken;try{const result=key?await storage.get(key):{};if(token!==requestToken)return;const saved=result[key];if(saved){if(saved.lines?.length)lines=core.parseLyrics(JSON.stringify(saved.lines));offset=Number(saved.offset)||0;moodChoice=['auto',...V.order].includes(saved.theme)?saved.theme:'auto';}}catch{$('.feedback').textContent='Saved lyrics could not be loaded.';}$('.offset').value=offset;$('select[aria-label="Visual theme"]').value=moodChoice;}
    if(state.title!==trackTitle){trackTitle=state.title;$('.title').textContent=state.title||'Waiting for Spotify';}
    $('.artist').textContent=state.artist||'Play a song in Spotify';
    const img=$('.cover img');if(state.art&&/^https:\/\//.test(state.art)){if(img.src!==state.art)img.src=state.art;img.hidden=false;$('.cover span').hidden=true;}else{img.hidden=true;$('.cover span').hidden=false;}
    const backdrop=$('.cover-backdrop');backdrop.hidden=img.hidden;if(!img.hidden&&backdrop.src!==img.src)backdrop.src=img.src;
    updateLyrics();
    if(!moodLocked){const live=globalThis.AesthetifyNativeLyrics.read();const suggestion=globalThis.AesthetifyMoods.suggest(state.title,state.artist,[live?.previous,live?.current,live?.next].filter(Boolean).join(' '));suggestedMood=suggestion.matched?suggestion.theme:'emerald';if(suggestion.matched||live)moodLocked=true;}

  }
  function updateDock(){
    $('.dock-title').textContent=state.title||'Ready when you are';$('.dock-artist').textContent=state.artist||'Spotify Web';
    const art=$('.dock-art img'),valid=state.art&&/^https:\/\//.test(state.art);art.hidden=!valid;$('.dock-art span').hidden=Boolean(valid);if(valid&&art.src!==state.art)art.src=state.art;
    $('.dock-play').textContent=state.playing?'Ⅱ':'▶';$('.dock-play').setAttribute('aria-label',state.playing?'Pause':'Play');
    $('.duration').textContent=P.time(state.duration);
    if(!scrubbing){$('.elapsed').textContent=P.time(state.position);$('.dock-seek').value=Number.isFinite(state.position)&&state.duration>0?Math.round(state.position/state.duration*1000):0;}
    $('.dock-seek').disabled=!(state.duration>0&&P.available('seek'));
    for(const [cls,action]of [['.dock-play','play'],['.dock-prev','previous'],['.dock-next','next'],['.dock-mute','mute']])$(cls).disabled=!P.available(action);
    $('.dock-mute').setAttribute('aria-label',state.volume===0?'Unmute':'Mute');$('.dock-mute').textContent=state.volume===0?'◖×':'◖))';
    $('.dock-volume').disabled=!P.available('volume');if(Number.isFinite(state.volume)&&shadow.activeElement!==$('.dock-volume'))$('.dock-volume').value=Math.round(Math.max(0,Math.min(1,state.volume))*100);
    $('.dock-seek').style.setProperty('--progress',`${Number($('.dock-seek').value)/10}%`);
    $('.dock-volume').style.setProperty('--progress',`${$('.dock-volume').value}%`);
  }
  function playerAction(action){if(!P.click(action)){dock.title='Control unavailable. Use Show Spotify player to access native controls.';}poll();}
  $('.dock-play').onclick=()=>playerAction('play');$('.dock-prev').onclick=()=>playerAction('previous');$('.dock-next').onclick=()=>playerAction('next');$('.dock-mute').onclick=()=>playerAction('mute');
  $('.dock-immersive').onclick=()=>toggle();$('.dock-native').onclick=()=>{dock.hidden=true;restore.hidden=false;};restore.onclick=()=>{dock.hidden=false;restore.hidden=true;};
  $('.dock-seek').oninput=e=>{scrubbing=true;$('.elapsed').textContent=P.time(Number(e.target.value)/1000*state.duration);e.target.style.setProperty('--progress',`${Number(e.target.value)/10}%`);};
  $('.dock-seek').onchange=e=>{const f=Number(e.target.value)/1000;P.fraction('seek',f);scrubbing=false;poll();};
  $('.dock-volume').oninput=e=>{const f=Number(e.target.value)/100;P.fraction('volume',f);e.target.style.setProperty('--progress',`${e.target.value}%`);};
  function renderPoppingWords(text,animate){
    const current=$('.current');current.replaceChildren();current.setAttribute('aria-label',text);
    const parts=text.split(/(\s+)/u);let index=0;
    const count=parts.filter(p=>p&&!/^\s+$/u.test(p)).length;
    // An ornamental stagger, not vocal timestamps: completes in at most 0.9s.
    const step=Math.min(85,900/Math.max(1,count));
    for(const part of parts){if(!part)continue;if(/^\s+$/u.test(part)){current.append(document.createTextNode(part));continue;}
      const span=document.createElement('span');span.className=animate?'pop-word':'idle-word';span.setAttribute('aria-hidden','true');span.textContent=part;span.style.setProperty('--pop-delay',`${index++*step}ms`);current.append(span);}
  }
  function showInterlude(value){
    interlude=value;$('.interlude').hidden=!value;$('.lyric-area').hidden=value;stage.classList.toggle('instrumental',value);
  }
  function updateLyrics(){
    if(sourceMode==='native') {
      const live=globalThis.AesthetifyNativeLyrics.read();
      if(!live||V.isInstrumental(live.current)){showInterlude(true);$('.status').textContent='';return;}
      showInterlude(false);
      const identity=key+':native:'+JSON.stringify(live);
      if(identity!==lastLine){lastLine=identity;$('.previous').textContent=V.isInstrumental(live?.previous||'')?'':live.previous;$('.next').textContent=V.isInstrumental(live?.next||'')?'':live.next;renderPoppingWords(live?.current||'Waiting for Spotify’s lyrics…',Boolean(live));$('.reflection').textContent=live?.current||'';const current=$('.current');current.classList.remove('change');void current.offsetWidth;current.classList.add('change');}
      $('.status').textContent=live?'':'Waiting for Spotify lyrics. If needed, open the lyrics panel once.';
      return;
    }
    const t=state.position-offset, idx=Number.isFinite(t)?core.activeIndex(lines,t):-1,row=lines[idx];
    if(!row||V.isInstrumental(row.text)||(row.words&&t>=row.words.at(-1).end)){showInterlude(true);$('.status').textContent='';return;}
    showInterlude(false);
    const identity=key+':'+idx+':'+lines.length;
    if(identity!==lastLine){lastLine=identity;$('.previous').textContent=lines[idx-1]?.text||'';$('.next').textContent=lines[idx+1]?.text||(lines.length?'':'Open Spotify’s lyrics preview, then enter immersive.');const current=$('.current');current.replaceChildren();current.removeAttribute('aria-label');if(row?.words){for(const word of row.words){if(current.children.length)current.append(document.createTextNode(' '));const span=document.createElement('span');span.className='word';span.textContent=word.text;current.append(span);}}else current.textContent=row?.text||(lines.length?'The first words are on their way.':'Your music. Your atmosphere.');current.classList.remove('change');void current.offsetWidth;current.classList.add('change');$('.reflection').textContent=row?.text||'';}
    if(row?.words) [...$('.current').children].forEach((el,i)=>{const w=row.words[i];el.style.setProperty('--fill',`${Math.max(0,Math.min(1,(t-w.start)/(w.end-w.start)))*100}%`);});
    $('.status').textContent='';
  }
  async function persist(){if(!key)throw Error('Play a track first so lyrics can be saved to it.');await storage.set({[key]:{lines,offset,theme:moodChoice}});}
  $('input[type=file]').onchange=async e=>{const file=e.target.files[0];if(!file)return;const originalKey=key;try{if(file.size>1024*1024)throw Error('Use a lyrics file smaller than 1 MB.');const parsed=core.parseLyrics(await file.text());if(key!==originalKey)throw Error('Track changed during import. Import again for the current track.');if(!key)throw Error('Play a track first.');await storage.set({[key]:{lines:parsed,offset,theme:moodChoice}});sourceMode='timed';$('.source').value='timed';lines=parsed;lastLine='';updateLyrics();$('.feedback').textContent=`Imported ${lines.length} lines for ${state.title}.`;}catch(err){$('.feedback').textContent=err.message;}e.target.value='';};
  $('.offset').onchange=async e=>{offset=Math.max(-30,Math.min(30,Number(e.target.value)||0));try{await persist();updateLyrics();}catch(err){$('.feedback').textContent=err.message;}};
  $('.clear').onclick=async()=>{try{if(key)await storage.set({[key]:{lines:[],offset:0,theme:moodChoice}});lines=[];offset=0;$('.offset').value=0;lastLine='';updateLyrics();$('.feedback').textContent='Lyrics cleared for this track.';}catch(err){$('.feedback').textContent=err.message;}};
  $('.auto-open').onchange=async e=>{autoOpen=e.target.checked;try{await storage.set({'aesthetify-preferences':{autoOpen,rainEnabled}});}catch{$('.feedback').textContent='Could not save auto-open preference.';}};
  $('.rain-glass').onchange=async e=>{rainEnabled=e.target.checked;try{await storage.set({'aesthetify-preferences':{autoOpen,rainEnabled}});}catch{$('.feedback').textContent='Could not save rain preference.';}};
  $('.source').onchange=e=>{sourceMode=e.target.value;lastLine='';updateLyrics();};
  $('select[aria-label="Visual theme"]').onchange=async e=>{moodChoice=e.target.value;lastSlide='';try{await persist();}catch(err){$('.feedback').textContent=err.message;}};
  let width=0,height=0;function resize(){width=stage.clientWidth;height=stage.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);glass.width=width*dpr;glass.height=height*dpr;glassCtx.setTransform(dpr,0,0,dpr,0,0);}
  new ResizeObserver(()=>{if(opened)resize();}).observe(stage);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let tick=0;
  function frame(now){
    requestAnimationFrame(frame);const dt=Math.min((now-lastMotion)/1000,.5);lastMotion=now;if(document.hidden)return;if(state.playing)motion+=dt;
    if(!opened||now-tick<1000/30)return;tick=now;
    const t=reduced.matches?0:motion,seconds=Number.isFinite(state.position)?state.position:motion;
    const shot=V.scene(seconds,moodChoice==='auto'?'journey':moodChoice,suggestedMood),p=V.palettes[shot.palette];
    const shotKey=key+':'+shot.index+':'+shot.palette;
    if(lastSlide!==shotKey){lastSlide=shotKey;stage.dataset.theme=shot.palette;dock.style.setProperty('--rgb',p.rgb);dock.style.setProperty('--glow',p.glow);dock.style.setProperty('--text',p.text);dock.style.setProperty('--bg',p.bg);stage.style.setProperty('--rgb',p.rgb);stage.style.setProperty('--glow',p.glow);stage.style.setProperty('--text',p.text);stage.style.setProperty('--bg',p.bg);$('.interlude').dataset.layout=shot.layout;$('.music-symbol').textContent=p.symbols[shot.index%4];$('.music-satellite').textContent=p.symbols[(shot.index+1)%4];$('.interlude').classList.remove('slide-in');void $('.interlude').offsetWidth;$('.interlude').classList.add('slide-in');}
    stage.style.setProperty('--turn',`${t*6}deg`);stage.style.setProperty('--pulse',String(.98+Math.sin(t*2)*.025));
    if(interlude)[...$('.music-bars').children].forEach((b,i)=>{b.style.height=`${10+(state.playing&&!reduced.matches?Math.abs(Math.sin(t*(1.7+i%4*.24)+i*.7))*48:5)}px`;});
    ctx.clearRect(0,0,width,height);
    globalThis.AesthetifyEffects.draw(ctx,width,height,t,shot.palette);
    ctx.globalAlpha=1;
    const wet=rainEnabled&&shot.palette==='rain';glass.hidden=!wet;if(wet)globalThis.AesthetifyRain.draw(glassCtx,width,height,t,$('.cover img'),reduced.matches);
  }
  requestAnimationFrame(frame);setInterval(poll,180);document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll();});
  Promise.all([storage.get('aesthetify-preferences'),storage.get('aesthetify-search-reveal')]).then(async ([result,reveal])=>{
    autoOpen=result['aesthetify-preferences']?.autoOpen!==false;rainEnabled=result['aesthetify-preferences']?.rainEnabled!==false;$('.rain-glass').checked=rainEnabled;$('.auto-open').checked=autoOpen;
    if(reveal['aesthetify-search-reveal']?.expires>Date.now()){wasPlaying=true;try{await storage.remove('aesthetify-search-reveal');}catch{}}
    poll();
  }).catch(()=>poll());
})();
