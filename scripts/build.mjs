import './check.mjs';
import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),ext=join(root,'extension');
const version=JSON.parse(readFileSync(join(ext,'manifest.json'),'utf8')).version;
const walk=dir=>readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en')).flatMap(d=>d.isDirectory()?walk(join(dir,d.name)):[join(dir,d.name)]);
function crc32(data){let crc=0xffffffff;for(const b of data){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return(crc^0xffffffff)>>>0;}
const locals=[],central=[];let offset=0,count=0;
for(const path of walk(ext)){
 const name=Buffer.from(relative(ext,path).replaceAll('\\','/')),data=readFileSync(path),packed=deflateRawSync(data,{level:9}),crc=crc32(data);
 const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6);local.writeUInt16LE(8,8);local.writeUInt16LE(0x21,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(packed.length,18);local.writeUInt32LE(data.length,22);local.writeUInt16LE(name.length,26);
 locals.push(local,name,packed);
 const dir=Buffer.alloc(46);dir.writeUInt32LE(0x02014b50);dir.writeUInt16LE(20,4);dir.writeUInt16LE(20,6);dir.writeUInt16LE(0x800,8);dir.writeUInt16LE(8,10);dir.writeUInt16LE(0x21,14);dir.writeUInt32LE(crc,16);dir.writeUInt32LE(packed.length,20);dir.writeUInt32LE(data.length,24);dir.writeUInt16LE(name.length,28);dir.writeUInt32LE(offset,42);
 central.push(dir,name);offset+=local.length+name.length+packed.length;count++;
}
const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(count,8);end.writeUInt16LE(count,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
const archive=Buffer.concat([...locals,directory,end]);mkdirSync(join(root,'dist'),{recursive:true});
const name=`Aesthetify-${version}.zip`;writeFileSync(join(root,'dist',name),archive);writeFileSync(join(root,'dist','SHA256SUMS'),`${createHash('sha256').update(archive).digest('hex')}  ${name}\n`);
console.log(`Built dist/${name}: ${count} files, ${archive.length} bytes.`);
