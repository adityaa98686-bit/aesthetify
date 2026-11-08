const $=selector=>document.querySelector(selector);let tabId;
async function action(type){try{const result=await chrome.runtime.sendMessage({type,tabId});if(result.error)throw Error(result.error);window.close();}catch(error){$('#status').textContent=error.message;}}
(async()=>{const[tab]=await chrome.tabs.query({active:true,currentWindow:true});tabId=tab?.id;const ready=tab?.url?.startsWith('https://open.spotify.com/');for(const button of document.querySelectorAll('button'))button.disabled=!ready;if(!ready)$('#status').textContent='Open Spotify Web to begin.';})().catch(()=>$('#status').textContent='Open Spotify Web and try again.');
$('#open').onclick=()=>action('open-immersive');$('#native').onclick=()=>action('show-native-player');
