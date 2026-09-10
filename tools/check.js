const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),ctx={window:{}};
for(const file of ['content.js','catalogue.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'src',file),'utf8'),ctx);
const c=ctx.window.VA_CONTENT,d=ctx.window.VA_CATALOGUE;
const refs=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1].split('?')[0]);
for(const cssFile of fs.readdirSync(path.join(root,'src')).filter(f=>f.endsWith('.css'))){
 const css=fs.readFileSync(path.join(root,'src',cssFile),'utf8');
 for(const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)){
  if(!/^(https?:|data:)/.test(match[1]))assert(fs.existsSync(path.resolve(root,'src',match[1])),`Missing CSS asset ${match[1]}`);
 }
}
refs.push(...c.downloads.map(x=>x[2]),...c.videos.map(x=>`assets/images/${x[2]}.webp`),...c.photos.map(x=>`assets/images/${x[0]}.webp`));
for(const ref of refs){if(ref.startsWith('#'))assert(html.includes(`id="${ref.slice(1)}"`),`Missing section ${ref}`);else if(!/^(https?:|mailto:)/.test(ref))assert(fs.existsSync(path.join(root,ref)),`Missing asset ${ref}`)}
for(const [name,href] of [...c.platforms,...c.social]){assert(name&&href);assert.equal(new URL(href).protocol,'https:')}
assert(d.releases.length>=140);assert.equal(new Set(d.releases.map(r=>r.url)).size,d.releases.length);
for(const r of d.releases){assert(r.title&&r.label&&/^\d{4}-\d{2}-\d{2}$/.test(r.date));assert.equal(new URL(r.url).hostname,'www.beatport.com')}
assert(d.tracks.length>50);assert.equal(new Set(d.tracks.map(t=>t.id)).size,d.tracks.length);
for(const t of d.tracks){assert(t.title&&t.artist);assert.equal(new URL(t.preview).hostname,'audio-ssl.itunes.apple.com');assert.equal(new URL(t.url).hostname,'music.apple.com')}
assert(!/TODO|требует уточнения|должно быть|Email пока|Пять треков/.test(html+JSON.stringify(c)),'Unfinished visitor copy');
const audio=html.match(/<audio\b[^>]*>/)[0];assert(audio.includes('preload="none"'));assert(!/\b(?:autoplay|src)=/.test(audio));
for(const file of fs.readdirSync(path.join(root,'src')).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,'src',file),'utf8'),{filename:file});
assert(!fs.readFileSync(path.join(root,'src/music.js'),'utf8').includes('assets/audio/'));assert.equal(c.downloads.length,7);
assert.equal(c.videos.length,5);assert(html.includes('data-track-art'));assert(html.includes('proof-strip'));
const app=fs.readFileSync(path.join(root,'src/app.js'),'utf8');assert(app.includes('vkvideo.ru/video_ext.php'));assert(app.includes('allowfullscreen'));
console.log(`PASS: ${refs.length} references; ${d.releases.length} Beatport records; ${d.tracks.length} remote previews; 5 embedded VK videos; release artwork; 7 downloads; JS syntax; no initial audio source or autoplay.`);

