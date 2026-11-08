import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),ext=join(root,'extension');
const manifest=JSON.parse(readFileSync(join(ext,'manifest.json'),'utf8'));
assert.equal(manifest.manifest_version,3);assert.equal(manifest.name,'Aesthetify');assert.deepEqual(manifest.permissions,['storage','activeTab']);assert.equal(manifest.optional_permissions,undefined);
const files=[...manifest.content_scripts.flatMap(x=>x.js),manifest.background.service_worker,manifest.action.default_popup,...Object.values(manifest.icons)];
for(const f of files)assert.ok(existsSync(join(ext,f)),`Missing ${f}`);
assert.deepEqual(manifest.content_scripts[0].matches,['https://open.spotify.com/*']);
for(const f of readdirSync(ext)){
 if(f.endsWith('.js'))execFileSync(process.execPath,['--check',join(ext,f)]);
 if(/\.(js|html)$/.test(f))assert.doesNotMatch(readFileSync(join(ext,f),'utf8'),/tabCapture|offscreen|AudioContext|MediaRecorder|getUserMedia|neon-|\bdemo\b|\brecovery\b/i,f);
 assert.doesNotMatch(f,/\.test\.|sample|demo|cache/);
}
assert.equal(JSON.parse(readFileSync(join(root,'package.json'),'utf8')).version,manifest.version);
console.log('Manifest, permissions, assets, package version, runtime syntax and release boundaries passed.');
