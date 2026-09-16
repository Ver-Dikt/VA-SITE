const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),dist=path.resolve(root,'dist');
if(path.dirname(dist)!==root||path.basename(dist)!=='dist')throw new Error('Unsafe output directory');
// Only this project's resolved build directory is replaced.
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
const publishable=source=>path.basename(path.dirname(source))!=='audio'||path.extname(source).toLowerCase()!=='.mp3'||path.basename(source)==='sunrise-original-mix.mp3';
for(const entry of ['index.html','photos.html','logos.html','rider.html','src','assets'])fs.cpSync(path.join(root,entry),path.join(dist,entry),{recursive:true,filter:publishable});
console.log(`Built ${dist}`);
