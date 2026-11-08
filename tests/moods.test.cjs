const {test}=require('node:test');const assert=require('node:assert/strict');const {suggest}=require('../extension/moods.js');
test('suggests rain, pink love, and fire from supplied metadata',()=>{assert.equal(suggest('Baarishein','Anuv Jain').theme,'rain');assert.equal(suggest('Pyaar','').theme,'love');assert.equal(suggest('Workout Party','').theme,'fire');});
test('Hindi keywords work without latin word boundaries',()=>{assert.equal(suggest('','', 'इन आँखों में दर्द है').theme,'rain');assert.equal(suggest('','', 'यह प्यार है').theme,'love');});
test('does not pretend unknown songs are analyzed',()=>{const r=suggest('Untitled','Unknown');assert.equal(r.matched,false);assert.equal(r.theme,'love');assert.equal(suggest('firefly','').matched,false);});
