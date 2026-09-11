/* Local WebGL sculpture: extruded V/A geometry, scroll rotation, no remote runtime. */
(() => {
'use strict';
const canvas=document.querySelector('#sculpture'),section=document.querySelector('.signal'),button=document.querySelector('.motion-toggle');
const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});
if(!gl){button.hidden=true;return}
const vs=`attribute vec3 aPosition;attribute vec3 aNormal;uniform float uYaw;uniform float uPitch;uniform float uAspect;varying vec3 vNormal;varying vec3 vPosition;
void main(){float c=cos(uYaw),s=sin(uYaw),cx=cos(uPitch),sx=sin(uPitch);mat3 ry=mat3(c,0.,-s,0.,1.,0.,s,0.,c);mat3 rx=mat3(1.,0.,0.,0.,cx,sx,0.,-sx,cx);mat3 m=rx*ry;vec3 p=m*aPosition;vNormal=m*aNormal;vPosition=p;float z=5.2-p.z;gl_Position=vec4(p.x*min(2.4,uAspect*2.3)/uAspect,p.y*min(2.4,uAspect*2.3),-p.z*.5,z);}`;
const fs=`precision mediump float;varying vec3 vNormal;varying vec3 vPosition;
void main(){vec3 n=normalize(vNormal);vec3 eye=normalize(vec3(0.,0.,5.2)-vPosition);vec3 l=normalize(vec3(-2.,3.,4.));float d=max(dot(n,l),0.);float fres=pow(1.-abs(dot(n,eye)),3.);vec3 r=reflect(-eye,n);float strip=pow(max(0.,sin(r.y*8.+r.x*3.)),16.);float sheen=pow(max(dot(reflect(-l,n),eye),0.),48.);vec3 color=vec3(.12,.17,.21)+d*vec3(.29,.37,.43)+strip*vec3(.62,.7,.76)+sheen*vec3(.9)+fres*vec3(.32,.5,.61);gl_FragColor=vec4(color,1.);}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
let program;try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('WebGL program link failed')}catch{button.hidden=true;return}
gl.useProgram(program);const points=[],normals=[];
function triangle(a,b,c){const u=b.map((v,i)=>v-a[i]),v=c.map((v,i)=>v-a[i]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n);for(const p of [a,b,c]){points.push(...p);normals.push(...n.map(x=>x/len))}}
function prism(poly,z=.21){for(let i=1;i<poly.length-1;i++){triangle([...poly[0],z],[...poly[i],z],[...poly[i+1],z]);triangle([...poly[0],-z],[...poly[i+1],-z],[...poly[i],-z])}for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];triangle([...a,z],[...a,-z],[...b,-z]);triangle([...a,z],[...b,-z],[...b,z])}}
// Silhouette traced from the supplied original logo. Convex pieces preserve the A counter.
const glyph=poly=>prism(poly.map(([x,y])=>[(x-540)/300,(533-y)/300]));
glyph([[19,231],[208,231],[331,606],[255,835]]);
glyph([[255,835],[331,606],[452,231],[640,231],[408,835]]);
glyph([[420,835],[657,231],[737,419],[596,835]]);
glyph([[657,231],[818,231],[1061,835],[879,835],[737,419]]);
glyph([[671,606],[804,606],[844,737],[630,737]]);
function attribute(name,data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,0,0)}attribute('aPosition',points);attribute('aNormal',normals);
const yaw=gl.getUniformLocation(program,'uYaw'),pitch=gl.getUniformLocation(program,'uPitch'),aspect=gl.getUniformLocation(program,'uAspect');gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);canvas.parentElement.classList.add('webgl-ready');
let visible=false,paused=false,frame=0,pointer=0,now=0;const media=matchMedia('(prefers-reduced-motion: reduce)');
function render(time=0){frame=0;const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);const w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
const rect=section.getBoundingClientRect(),scroll=Math.max(0,Math.min(1,section.offsetHeight>innerHeight+100?-rect.top/(section.offsetHeight-innerHeight):(innerHeight-rect.top)/(section.offsetHeight+innerHeight)));if(!paused&&!media.matches)now=time*.00013;gl.uniform1f(yaw,media.matches||paused?-.32:-.32+scroll*Math.PI*2+Math.sin(now)*.12+pointer*.12);gl.uniform1f(pitch,media.matches||paused?.13:.12+Math.sin(now*.7)*.08-scroll*.18);gl.uniform1f(aspect,w/h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,points.length/3);if(visible&&!document.hidden&&!paused&&!media.matches)frame=requestAnimationFrame(render)}
function schedule(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(render)}
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'100px'}).observe(section);
window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});canvas.addEventListener('pointermove',e=>{pointer=(e.offsetX/canvas.clientWidth-.5)*2},{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else schedule()});media.addEventListener('change',schedule);
button.addEventListener('click',()=>{paused=!paused;button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Включить анимацию':'Остановить анимацию';schedule()});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);frame=0;visible=false;canvas.parentElement.classList.remove('webgl-ready');button.hidden=true});render();
})();

