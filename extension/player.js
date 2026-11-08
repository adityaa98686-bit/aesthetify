(function(root){
  'use strict';
  const selectors={play:['[data-testid="control-button-playpause"]'],previous:['[data-testid="control-button-skip-back"]'],next:['[data-testid="control-button-skip-forward"]'],mute:['[data-testid="volume-bar-toggle-mute-button"]','button[aria-label="Mute"]','button[aria-label="Unmute"]'],seek:['[data-testid="playback-progressbar"] input[type="range"]','input[aria-label="Change progress"]','[data-testid="playback-progressbar"]'],volume:['[data-testid="volume-bar"] input[type="range"]','input[aria-label="Change volume"]','[data-testid="volume-bar"] [role="slider"]','[data-testid="volume-bar"]']};
  function find(type,doc=document){return (selectors[type]||[]).map(s=>doc.querySelector(s)).find(n=>n&&!n.disabled&&n.getAttribute('aria-disabled')!=='true')||null;}
  function available(type,doc=document){return Boolean(find(type,doc));}
  function click(type,doc=document){const n=find(type,doc);if(!n)return false;n.click();return true;}
  function fraction(type,f,doc=document){const n=find(type,doc);if(!n||!Number.isFinite(f))return false;f=Math.max(0,Math.min(1,f));
    if(n.tagName==='INPUT'){
      const min=Number(n.min)||0,max=Number(n.max)||100;const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
      setter.call(n,String(min+f*(max-min)));n.dispatchEvent(new Event('input',{bubbles:true}));n.dispatchEvent(new Event('change',{bubbles:true}));return true;
    }
    const rect=n.getBoundingClientRect();if(!rect.width)return false;
    const options={bubbles:true,clientX:rect.left+f*rect.width,clientY:rect.top+rect.height/2,button:0,buttons:1};
    n.dispatchEvent(new PointerEvent('pointerdown',options));n.dispatchEvent(new MouseEvent('mousedown',options));n.dispatchEvent(new PointerEvent('pointerup',{...options,buttons:0}));n.dispatchEvent(new MouseEvent('mouseup',{...options,buttons:0}));n.dispatchEvent(new MouseEvent('click',{...options,buttons:0}));return true;
  }
  function time(value){return Number.isFinite(value)&&value>=0?`${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`:'—:—';}
  function isPlaying(button,hasTrack){return Boolean(hasTrack&&button&&!button.disabled&&button.getAttribute('aria-disabled')!=='true'&&/pause/i.test(button.getAttribute('aria-label')||''));}
  root.AesthetifyPlayer={find,available,click,fraction,time,isPlaying};if(typeof module!=='undefined')module.exports=root.AesthetifyPlayer;
})(globalThis);
