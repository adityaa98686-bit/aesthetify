chrome.action.setBadgeText({text:''}).catch(()=>{});
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  if(sender.url!==chrome.runtime.getURL('popup.html'))return;
  (async()=>{
    const tab=await chrome.tabs.get(message.tabId);
    if(!tab.url?.startsWith('https://open.spotify.com/'))throw Error('Open Spotify Web first.');
    if(message.type==='open-immersive'){await chrome.tabs.sendMessage(tab.id,{type:'aesthetify-toggle'});return{ok:true};}
    if(message.type==='show-native-player'){await chrome.tabs.sendMessage(tab.id,{type:'aesthetify-show-native-player'});return{ok:true};}
    return{error:'This action is unavailable.'};
  })().then(reply).catch(()=>reply({error:'Refresh Spotify and try again.'}));
  return true;
});
