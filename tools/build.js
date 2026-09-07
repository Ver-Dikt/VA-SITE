const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),dist=path.resolve(root,'dist');
if(path.dirname(dist)!==root||path.basename(dist)!=='dist')throw new Error('Unsafe output directory');
// Only this project's resolved build directory is replaced.
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
for(const entry of ['index.html','src','assets'])fs.cpSync(path.join(root,entry),path.join(dist,entry),{recursive:true,filter:source=>path.relative(root,source)!==path.join('assets','audio')});
console.log(`Built ${dist}`);
