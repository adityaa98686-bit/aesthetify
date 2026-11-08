(() => {
  'use strict';
  // Reads rendered lyric elements only. No private endpoints or audio capture.
  function read(doc = document) {
    const selectors = ['[data-testid="lyrics-line"]', '[data-testid="fullscreen-lyric"]', '.lyrics-lyricsContent-text', '[data-lyrics-line]'];
    for (const selector of selectors) {
      const nodes = [...doc.querySelectorAll(selector)].filter(n => {
        const style = getComputedStyle(n);
        return n.getClientRects().length && style.display !== 'none' && style.visibility !== 'hidden' && n.textContent.trim();
      });
      if (!nodes.length) continue;
      // Keep separate panels separate; a hidden/full lyric panel must not override the preview.
      const groups = new Map();
      for (const node of nodes) {
        const parent = node.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(node);
      }
      for (const group of groups.values()) {
        if (group.length < 2) continue;
        const rows = group.map(n => {
          const mark = `${n.className} ${n.getAttribute('data-testid') || ''}`;
          const explicit = n.getAttribute('aria-current') === 'true' || n.getAttribute('aria-current') === 'step' || n.getAttribute('data-active') === 'true' || n.getAttribute('data-state') === 'active' || /(?:^|[\s_-])(?:active|current)(?:$|[\s_-])/i.test(mark);
          const color = getComputedStyle(n).color.match(/[\d.]+/g)?.map(Number) || [];
          const light = color.length >= 3 ? (.2126*color[0]+.7152*color[1]+.0722*color[2]) * (color[3] ?? 1) * Number(getComputedStyle(n).opacity || 1) : 0;
          return {text:n.textContent.trim(), explicit, light};
        });
        const explicit = rows.map((r,i)=>r.explicit?i:-1).filter(i=>i>=0);
        let index = explicit.length === 1 ? explicit[0] : -1;
        let method = 'active marker';
        if (!explicit.length) {
          // Spotify's preview commonly uses one bright current line among dim neighbors.
          // Ambiguous equal highlights fail closed; never infer a time or line progression.
          const ranked = rows.map((r,i)=>({i,light:r.light})).sort((a,b)=>b.light-a.light);
          if (ranked[0].light >= 150 && ranked[0].light-ranked[1].light >= 35) index=ranked[0].i;
          method='visible highlight';
        }
        if (index>=0) return {current:rows[index].text, previous:rows[index-1]?.text||'', next:rows[index+1]?.text||'', index, method};
      }
    }
    return null;
  }
  function ensureOpen(doc=document) {
    if(read(doc))return 'already-readable';
    const candidates=[...doc.querySelectorAll('[data-testid="lyrics-button"], button[aria-label="Lyrics"], button[aria-label="Show lyrics"]')];
    const button=candidates.find(b=>!b.disabled&&b.getClientRects().length);
    if(!button)return 'unavailable';
    if(button.getAttribute('aria-pressed')==='true'||button.getAttribute('aria-expanded')==='true')return 'already-open';
    button.click();return 'requested';
  }
  globalThis.AesthetifyNativeLyrics={read,ensureOpen};
})();
