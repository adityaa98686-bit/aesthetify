(function(root){
  const palettes={
    emerald:{name:'Emerald Gold',bg:'#061b15',rgb:'53,190,133',text:'#ffe4a0',glow:'255,205,97',symbols:['✦','🌿','✨','♫']},
    love:{name:'Rose Quartz',bg:'#21101d',rgb:'245,105,172',text:'#ffe5f1',glow:'255,135,198',symbols:['♡','💗','🌸','♪']},
    rain:{name:'Midnight Rain',bg:'#0a1425',rgb:'89,146,226',text:'#deecff',glow:'136,184,255',symbols:['☾','💧','✧','♫']},
    fire:{name:'Solar Fire',bg:'#251008',rgb:'255,99,35',text:'#ffe3a6',glow:'255,150,54',symbols:['🔥','✦','⚡','♪']},
    violet:{name:'Violet Dream',bg:'#180f2c',rgb:'157,104,248',text:'#edddff',glow:'188,135,255',symbols:['☽','🔮','✧','♫']},
    ocean:{name:'Ocean Glow',bg:'#061d28',rgb:'45,188,215',text:'#c8fff3',glow:'90,241,220',symbols:['🫧','🌊','✦','♪']},
    amber:{name:'Golden Hour',bg:'#241a0a',rgb:'234,168,55',text:'#fff0c7',glow:'255,204,105',symbols:['☀','🌻','✨','♫']}
  };
  const order=Object.keys(palettes);
  function scene(time,choice='journey',start='emerald'){
    const seconds=Number.isFinite(time)?Math.max(0,time):0;
    const index=Math.floor(seconds/10);
    const base=Math.max(0,order.indexOf(start));
    const palette=choice==='journey'?order[(base+index)%order.length]:(palettes[choice]?choice:'emerald');
    return {index,palette,layout:['orbit','split','wave','halo'][index%4],progress:(seconds%10)/10};
  }
  function isInstrumental(text){return /^[\s♪♫♬🎵🎶·.…—–-]*$/u.test(text)||/^[\[(]?(?:instrumental|music|interlude|संगीत)[\])]?$/iu.test(text.trim());}
  root.AesthetifyVisuals={palettes,order,scene,isInstrumental};if(typeof module!=='undefined')module.exports=root.AesthetifyVisuals;
})(globalThis);
