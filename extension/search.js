(function(root){
  function url(query){const q=String(query).trim().replace(/\s+/gu,' ').slice(0,200);return q?'https://open.spotify.com/search/'+encodeURIComponent(q):null;}
  function submitToVisibleInput(query,doc=document){
    const input=doc.querySelector('input[data-testid="search-input"]')||doc.querySelector('input[placeholder="What do you want to play?"]');
    if(!input||input.disabled)return false;
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,String(query).trim().replace(/\s+/gu,' ').slice(0,200));
    input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',bubbles:true}));return true;
  }
  root.AesthetifySearch={url,submitToVisibleInput};if(typeof module!=='undefined')module.exports=root.AesthetifySearch;
})(globalThis);
