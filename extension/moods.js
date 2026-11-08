(function(root){
  'use strict';
  function suggest(title,artist,lyrics=''){
    const input=`${title} ${artist} ${lyrics}`.toLocaleLowerCase();
    const rules={rain:['sad','lonely','broken','heartbreak','tears','goodbye','dard','judai','tanha','udaas','दर्द','तन्हा','आँसू','अलविदा','बारिश','baarish','baarishein'],love:['happy','joy','smile','khushi','खुशी','love','romantic','kiss','heart','ishq','pyaar','pyar','mohabbat','dil','इश्क','प्यार','मोहब्बत','दिल'],fire:['energy','energetic','party','dance','fire','power','rock','metal','workout','dhol','bhangra','नाच','आग','जोश']};
    const scores=Object.entries(rules).map(([theme,words])=>({theme,score:words.reduce((n,w)=>n+(new RegExp(`(?:^|[^\\p{L}])${w}(?=$|[^\\p{L}])`,'u').test(input)?1:0),0)})).sort((a,b)=>b.score-a.score);
    return {theme:scores[0].score?scores[0].theme:'love',matched:scores[0].score>0};
  }
  root.AesthetifyMoods={suggest};if(typeof module!=='undefined')module.exports=root.AesthetifyMoods;
})(globalThis);
