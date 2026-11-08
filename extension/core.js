(function(root) {
  'use strict';
  function seconds(s) {
    const parts = String(s).trim().split(':').map(Number);
    return parts.every(Number.isFinite) ? parts.reduce((a,b) => a*60+b,0) : NaN;
  }
  function parseLyrics(source) {
    let rows;
    if (/^\s*(?:\{|\[\s*(?:\{|\]))/.test(source)) {
      try {
        const json = JSON.parse(source);
        rows = Array.isArray(json) ? json : json.lines;
        if (!Array.isArray(rows)) throw Error('Expected a lines array.');
      } catch(e) {
        if (!/^\s*\[\d+:/.test(source)) throw Error('Invalid lyrics JSON: '+e.message);
      }
    }
    if (!rows) {
      rows = [];
      for (const line of source.split(/\r?\n/)) {
        const tags = [...line.matchAll(/\[(\d+:\d+(?:\.\d+)?)\]/g)];
        const text = line.replace(/\[[^\]]*\]/g,'').trim();
        for (const tag of tags) rows.push({start: seconds(tag[1]), text});
      }
    }
    if (!rows.length) throw Error('No timed lyrics found. Import LRC or JSON.');
    if (rows.length > 5000) throw Error('Too many lyric lines.');
    rows = rows.map((row,i) => {
      const start = Number(row.start);
      if (!Number.isFinite(start) || start < 0 || typeof row.text !== 'string') throw Error('Invalid line '+(i+1));
      const out = {start, text: row.text.slice(0,2000)};
      if (row.words != null) {
        if (!Array.isArray(row.words) || !row.words.length) throw Error('Invalid words on line '+(i+1));
        out.words = row.words.map(w => {
          if (typeof w.text !== 'string' || !Number.isFinite(w.start) || !Number.isFinite(w.end) || w.start < start || w.end <= w.start) throw Error('Invalid word timestamps on line '+(i+1));
          return {text:w.text, start:w.start, end:w.end};
        });
        out.words.forEach((w,j) => { if(j && w.start < out.words[j-1].end) throw Error('Overlapping word timestamps.'); });
      }
      return out;
    }).sort((a,b)=>a.start-b.start);
    rows.forEach((r,i)=> { if(i && r.start === rows[i-1].start) throw Error('Duplicate line timestamps.'); });
    return rows;
  }
  function activeIndex(lines,t) {
    let lo=0, hi=lines.length-1, answer=-1;
    while(lo<=hi) { const m=(lo+hi)>>1; if(lines[m].start<=t) {answer=m;lo=m+1;} else hi=m-1; }
    return answer;
  }
  const api = {seconds, parseLyrics, activeIndex};
  root.AesthetifyCore = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
