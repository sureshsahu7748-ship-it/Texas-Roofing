// Hero 3D (Three.js r128): तूफ़ानी रात से सुबह तक, रियलिस्टिक घर और छत
(()=>{
const q=s=>document.querySelector(s);
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const cv=q('#sky'),SM=innerWidth<700;
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lp=(a,b,t)=>a+(b-a)*t,rnd=(a,b)=>a+Math.random()*(b-a);
const A=32*Math.PI/180,TA=Math.tan(A),WH=3;
const N=SM?900:2600,SPN=200,NRIP=SM?18:40;
const roofY=(x,z)=>(Math.abs(x)<4.8&&Math.abs(z)<3.5)?WH+(3.4-Math.abs(z))*TA:-1;
const rx=new Float32Array(N),ry=new Float32Array(N),rz=new Float32Array(N),rs=new Float32Array(N);
const sv=new Float32Array(SPN*3),sl=new Float32Array(SPN);let si=0;
let R,S,C,K=1,ok=false;
let sky,hemi,fill,sun,flash,porchL,winL,gnd,roofM,glassM,lampM,leafM,pud=[],trees=[],dmg=[];
let rain,rg,rp,sg,spp,bolt,bg,bp,rip=[],ri=0;
const BN=24;
let K0;

// ---------- Texture helpers ----------
const mk=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c};
const grain=(g,w,h,amt)=>{const id=g.getImageData(0,0,w,h),d=id.data;for(let i=0;i<d.length;i+=4){const n=(Math.random()-.5)*amt;d[i]+=n;d[i+1]+=n;d[i+2]+=n}g.putImageData(id,0,0)};
const tex=(c,rx=1,ry=1,srgb=true)=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);if(srgb)t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());return t};

const shingleCanvas=()=>mk(1024,1024,(g,w,h)=>{
 g.fillStyle='#22252c';g.fillRect(0,0,w,h);
 const rows=16,rh=h/rows,cw=64;
 for(let r=0;r<rows;r++){
  for(let x=-cw;x<w+cw;x+=cw){const xx=x+(r%2)*cw/2,v=34+Math.random()*34,w2=Math.random()*5;
   g.fillStyle='rgb('+(v+6+w2)+','+(v+8)+','+(v+14)+')';g.fillRect(xx+2,r*rh+2,cw-4,rh-3);
   g.fillStyle='rgba(255,255,255,.05)';g.fillRect(xx+2,r*rh+2,cw-4,3);
   g.fillStyle='rgba(0,0,0,.38)';g.fillRect(xx+cw/2-1,r*rh+rh*.45,2,rh*.5)}
  g.fillStyle='rgba(0,0,0,.55)';g.fillRect(0,r*rh+rh-3,w,3)}
 for(let i=0;i<14;i++){const x=Math.random()*w,gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.5,'rgba(0,0,0,.16)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x,0,rnd(6,20),h)}
 grain(g,w,h,38)});

const sidingCanvas=()=>mk(512,512,(g,w,h)=>{
 const n=15,bh=h/n;
 for(let i=0;i<n;i++){const v=Math.random()*10;g.fillStyle='rgb('+(138+v)+','+(148+v)+','+(165+v)+')';g.fillRect(0,i*bh,w,bh);
  g.fillStyle='rgba(255,255,255,.28)';g.fillRect(0,i*bh,w,2);
  g.fillStyle='rgba(0,0,0,.5)';g.fillRect(0,i*bh+bh-4,w,4)}
 grain(g,w,h,14)});

const brickCanvas=()=>mk(256,256,(g,w,h)=>{
 g.fillStyle='#8a8178';g.fillRect(0,0,w,h);
 const bw=32,bh=12;
 for(let r=0;r<Math.ceil(h/bh);r++)for(let x=-bw;x<w+bw;x+=bw){const xx=x+(r%2)*bw/2;
  g.fillStyle='rgb('+(118+Math.random()*44|0)+','+(52+Math.random()*24|0)+','+(40+Math.random()*16|0)+')';g.fillRect(xx+1,r*bh+1,bw-2,bh-2)}
 grain(g,w,h,22)});

const grassCanvas=()=>mk(512,512,(g,w,h)=>{
 g.fillStyle='#2d3d27';g.fillRect(0,0,w,h);
 for(let i=0;i<7000;i++){const x=Math.random()*w,y=Math.random()*h,l=3+Math.random()*7;
  g.strokeStyle='rgba('+(30+Math.random()*40|0)+','+(60+Math.random()*60|0)+','+(25+Math.random()*30|0)+','+(.35+Math.random()*.5)+')';
  g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd(-2,2),y-l);g.stroke()}
 grain(g,w,h,16)});

const concreteCanvas=()=>mk(256,256,(g,w,h)=>{
 g.fillStyle='#9ca2aa';g.fillRect(0,0,w,h);
 g.fillStyle='rgba(0,0,0,.5)';g.fillRect(0,0,w,3);g.fillRect(0,0,3,h);g.fillRect(w-3,0,3,h);
 grain(g,w,h,20)});

const stainCanvas=()=>mk(256,256,(g,w,h)=>{
 const r=g.createRadialGradient(128,128,10,128,128,126);
 r.addColorStop(0,'rgba(8,8,12,.7)');r.addColorStop(.6,'rgba(15,15,20,.35)');r.addColorStop(1,'rgba(15,15,20,0)');
 g.fillStyle=r;g.fillRect(0,0,w,h)});

const tarpCanvas=()=>mk(256,256,(g,w,h)=>{
 g.fillStyle='#2f6fb4';g.fillRect(0,0,w,h);
 for(let i=0;i<26;i++){g.strokeStyle='rgba('+(i%2?'255,255,255,.12':'0,0,0,.25')+')';g.lineWidth=rnd(1,4);g.beginPath();
  g.moveTo(Math.random()*w,0);g.bezierCurveTo(Math.random()*w,h*.3,Math.random()*w,h*.7,Math.random()*w,h);g.stroke()}
 g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=8;g.strokeRect(4,4,w-8,h-8);
 grain(g,w,h,18)});

try{
 K0={st:[new THREE.Color(0x141b2e),new THREE.Color(0x44506a)],dw:[new THREE.Color(0x3b3f7c),new THREE.Color(0xff9a5c)],
 f1:new THREE.Color(0x8ea0c4),f2:new THREE.Color(0xffc48a),g1:new THREE.Color(0x7a8896),g2:new THREE.Color(0xffffff),
 l1:new THREE.Color(0x0d1a14),l2:new THREE.Color(0x3a6a3c),tg:new THREE.Vector3()};
 R=new THREE.WebGLRenderer({canvas:cv,antialias:!SM});
 R.setPixelRatio(Math.min(devicePixelRatio||1,SM?1.5:1.8));
 R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
 R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15;R.outputEncoding=THREE.sRGBEncoding;
 S=new THREE.Scene();S.fog=new THREE.FogExp2(0x4a566e,.028);
 C=new THREE.PerspectiveCamera(42,1,.5,400);

 // ---------- आसमान: shader में बादल, सूरज की चमक, बिजली से रोशनी ----------
 sky=new THREE.Mesh(new THREE.SphereGeometry(140,32,20),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,
  uniforms:{top:{value:new THREE.Color()},bot:{value:new THREE.Color()},glow:{value:new THREE.Color(0xffb070)},sd:{value:new THREE.Vector3(-.6,.2,-.75).normalize()},gi:{value:0},t:{value:0},cd:{value:1},fl:{value:0}},
  vertexShader:'varying vec3 v;void main(){v=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:[
   'uniform vec3 top,bot,glow,sd;uniform float gi,t,cd,fl;varying vec3 v;',
   'float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
   'float nz(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h2(i),h2(i+vec2(1.,0.)),f.x),mix(h2(i+vec2(0.,1.)),h2(i+vec2(1.,1.)),f.x),f.y);}',
   'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*nz(p);p=p*2.03+17.;a*=.5;}return s;}',
   'void main(){vec3 n=normalize(v);float h=clamp(n.y*1.4+.15,0.,1.);vec3 c=mix(bot,top,pow(h,.8));',
   'float s=max(dot(n,sd),0.);',
   'vec2 uv=n.xz/(max(n.y,0.)+.35)*1.1+vec2(t*.012,t*.007);float f=fbm(uv*1.7);',
   'float cm=smoothstep(.3,.78,f)*smoothstep(-.02,.22,n.y)*cd;',
   'vec3 cc=mix(top*.55,bot*1.05,smoothstep(.3,.9,f))+glow*gi*pow(s,3.)*.7+vec3(.5,.62,1.)*fl*.22;',
   'c=mix(c,cc,cm);c+=glow*(pow(s,6.)*.5+pow(s,70.)*1.2)*gi*(1.-cm*.7);gl_FragColor=vec4(c,1.);}'
  ].join('\n')}));
 S.add(sky);

 // ---------- रोशनी ----------
 hemi=new THREE.HemisphereLight(0x8fa4cc,0x1a1e28,.5);S.add(hemi);
 fill=new THREE.DirectionalLight(0x8ea0c4,1);fill.position.set(-6,8,12);S.add(fill);
 sun=new THREE.DirectionalLight(0xffb070,0);sun.position.set(-12,9,-15);sun.castShadow=true;
 sun.shadow.mapSize.set(SM?1024:2048,SM?1024:2048);sun.shadow.bias=-.0005;sun.shadow.normalBias=.03;
 Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:1,far:70});S.add(sun);
 flash=new THREE.PointLight(0xcfe0ff,0,80);flash.position.set(-6,16,-4);S.add(flash);
 porchL=new THREE.PointLight(0xffc27a,1.6,14,2);porchL.position.set(.95,2.1,3.7);S.add(porchL);
 winL=new THREE.PointLight(0xffb866,1.3,18,2);winL.position.set(0,1.8,5.5);S.add(winL);

 // ---------- ज़मीन, घास, रास्ता, पोखर ----------
 const gt=tex(grassCanvas(),60,60);
 gnd=new THREE.Mesh(new THREE.PlaneGeometry(220,220),new THREE.MeshStandardMaterial({map:gt,roughness:.3}));
 gnd.rotation.x=-Math.PI/2;gnd.receiveShadow=true;S.add(gnd);
 const std=o=>new THREE.MeshStandardMaterial(o);
 const add=(m,x,y,z,cast=true,recv=true)=>{m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=recv;S.add(m);return m};
 const box=(w,h,d,mat,x,y,z,cast=true)=>add(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat),x,y,z,cast);
 const cT=tex(concreteCanvas(),1,11),cM=std({map:cT,bumpMap:cT,bumpScale:.6,roughness:.35});
 box(1.4,.05,22,cM,0,.025,15.4,false);
 box(2.4,.2,1.1,std({map:tex(concreteCanvas(),1,1),roughness:.4}),0,.1,3.55);
 box(1.7,.1,.5,std({map:tex(concreteCanvas(),1,1),roughness:.4}),0,.05,4.3);
 [[3.2,8.5,2.2,1.3],[-3.8,11,2.8,1.6],[6.5,5.6,1.4,.9]].forEach(([x,z,sx,sz])=>{
  const m=new THREE.Mesh(new THREE.CircleGeometry(1,36),std({color:0x0a101c,roughness:.04,metalness:.1,transparent:true,opacity:.88,emissive:0x000000}));
  m.rotation.x=-Math.PI/2;m.scale.set(sx,sz,1);m.position.set(x,.012,z);m.receiveShadow=true;S.add(m);pud.push(m)});

 // ---------- घर: दीवारें (साइडिंग), नींव, कोने की पट्टियाँ ----------
 const sT=tex(sidingCanvas(),1,1),wall=std({map:sT,bumpMap:sT,bumpScale:.9,roughness:.85});
 box(9,WH,6,wall,0,WH/2,0);
 box(9.16,.45,6.16,std({color:0x4b4f57,roughness:.95}),0,.225,0);
 const trimM=std({color:0xeef1f5,roughness:.5});
 [[4.5,3],[-4.5,3],[4.5,-3],[-4.5,-3]].forEach(([x,z])=>box(.14,WH,.14,trimM,x,WH/2,z,false));
 const gT=sT.clone();gT.needsUpdate=true;gT.wrapS=gT.wrapT=THREE.RepeatWrapping;gT.repeat.set(1/3,1/3);
 const gableM=std({map:gT,roughness:.85,side:THREE.DoubleSide});
 const tri=new THREE.Shape();tri.moveTo(-3,0);tri.lineTo(3,0);tri.lineTo(0,3*TA);
 [1,-1].forEach(s=>{const m=new THREE.Mesh(new THREE.ShapeGeometry(tri),gableM);m.rotation.y=s*Math.PI/2;add(m,s*4.5,WH,0)});

 // ---------- छत ----------
 const rt=tex(shingleCanvas(),5,2);
 roofM=std({map:rt,bumpMap:rt,bumpScale:1.6,roughness:.4,side:THREE.DoubleSide});
 const pl=3.4/Math.cos(A);let roofFront;
 [[1,-(Math.PI/2-A)],[-1,-(Math.PI/2+A)]].forEach(([s,th])=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(9.6,pl),roofM);m.rotation.x=th;add(m,0,WH+1.7*TA,s*1.7);if(s===1)roofFront=m});
 box(9.6,.2,.55,std({color:0x15171c,roughness:.8}),0,WH+3.4*TA+.02,0);
 // फ़ेशिया, गटर, डाउनस्पाउट
 const gutM=std({color:0x2b2f38,roughness:.35,metalness:.5});
 [1,-1].forEach(s=>{box(9.7,.2,.07,trimM,0,WH-.02,s*3.42,false);box(9.7,.1,.16,gutM,0,WH-.14,s*3.5,false)});
 [[4.6,3.5],[-4.6,3.5]].forEach(([x,z])=>add(new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,WH-.2,8),gutM),x,(WH-.2)/2,z,false));
 // चिमनी
 const bT=tex(brickCanvas(),1,1),brickM=std({map:bT,bumpMap:bT,bumpScale:1,roughness:.9}),cy=WH+2.8*TA+.6;
 box(.8,2,.8,brickM,2.2,cy,.6);
 box(1,.12,1,std({color:0x777c84,roughness:.7}),2.2,cy+1.06,.6);
 box(.4,.25,.4,std({color:0x111214,roughness:.9}),2.2,cy+1.22,.6,false);

 // ---------- छत की खराबी (तूफ़ान में): दाग, उखड़े शिंगल, नीली तिरपाल. सुबह तक ठीक ----------
 const dmat=(o,base)=>{const m=new THREE.MeshStandardMaterial(Object.assign({transparent:true,depthWrite:false,roughness:.6},o));m.userData.base=base;return m};
 const decal=(w,h,x,y,z,mat,rz=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.z=rz;roofFront.add(m);dmg.push(m);return m};
 decal(2.8,1.9,-1.4,.5,.02,dmat({map:tex(stainCanvas(),1,1),color:0xffffff},1));
 decal(.9,.55,-1.7,.3,.03,dmat({color:0x0b0c0f,roughness:.95},.95),.05);
 decal(1.8,1.25,2.2,-.3,.045,dmat({map:tex(tarpCanvas(),1,1),roughness:.45},1),.07);

 // ---------- खिड़कियाँ, दरवाज़ा, पोर्च लाइट ----------
 glassM=std({color:0x1a1409,emissive:0xffc77a,emissiveIntensity:1,roughness:.15,metalness:.1});
 const shutM=std({color:0x1f2a3a,roughness:.7});
 const win=(x,y,z,ry)=>{const g=new THREE.Group(),a=(geo,mat,px,py,pz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(px,py,pz);g.add(m)};
  a(new THREE.BoxGeometry(1.4,1.5,.1),trimM,0,0,0);
  a(new THREE.PlaneGeometry(1.1,1.2),glassM,0,0,.056);
  a(new THREE.BoxGeometry(.05,1.2,.04),trimM,0,0,.07);a(new THREE.BoxGeometry(1.1,.05,.04),trimM,0,0,.07);
  a(new THREE.BoxGeometry(1.6,.07,.22),trimM,0,-.78,.08);
  [-.92,.92].forEach(sx=>a(new THREE.BoxGeometry(.38,1.5,.06),shutM,sx,0,.03));
  g.position.set(x,y,z);g.rotation.y=ry;S.add(g)};
 win(-2.4,1.9,3.0,0);win(2.4,1.9,3.0,0);win(4.5,1.9,-1.3,Math.PI/2);win(4.5,1.9,1.3,Math.PI/2);
 const door=new THREE.Group(),da=(geo,mat,px,py,pz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(px,py,pz);door.add(m)};
 da(new THREE.BoxGeometry(1.2,2.25,.1),trimM,0,0,0);
 da(new THREE.BoxGeometry(.95,2.1,.08),std({color:0x9a2f17,roughness:.55}),0,0,.04);
 const panM=std({color:0x7e2511,roughness:.6});da(new THREE.BoxGeometry(.7,.8,.02),panM,0,.45,.09);da(new THREE.BoxGeometry(.7,.8,.02),panM,0,-.45,.09);
 da(new THREE.SphereGeometry(.04,10,8),std({color:0xd9b25f,metalness:.9,roughness:.25}),.34,-.1,.11);
 door.position.set(0,1.15,3.0);S.add(door);
 lampM=std({color:0x332a1a,emissive:0xffd9a0,emissiveIntensity:1.4});
 add(new THREE.Mesh(new THREE.BoxGeometry(.14,.22,.12),lampM),.95,2.1,3.08,false,false);

 // ---------- झाड़ियाँ, पेड़ ----------
 const bushM=std({color:0x24401f,roughness:1});
 [[-1.35,.38,3.5,.5],[1.35,.38,3.5,.5],[-4.45,.5,3.3,.65],[4.5,.5,3.3,.65],[-4.6,.45,-.5,.6]].forEach(([x,y,z,r])=>{
  const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),bushM);m.scale.set(r*1.3,r,r*1.1);add(m,x,y,z)});
 leafM=std({color:0x0d1a14,roughness:1,flatShading:true});
 const trunkM=std({color:0x3a2a20,roughness:1});
 const tp=[[-14,-12,9],[-9,-16,10],[8,-14,9],[14,-10,8],[-18,-4,8],[18,-3,9],[-12,8,7],[15,10,8],[-17,15,8],[21,17,9]];
 (SM?tp.slice(0,6):tp).forEach(([x,z,h],i)=>{const g=new THREE.Group();
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(.16,.24,h*.3,6),trunkM);tr.position.y=h*.15;g.add(tr);
  for(let k=0;k<4;k++){const hh=h*(.42-k*.05),rr=h*(.3-k*.055),c=new THREE.Mesh(new THREE.ConeGeometry(rr,hh,8),leafM);c.position.y=h*.28+k*h*.17+hh/2;c.castShadow=i<4;g.add(c)}
  g.position.set(x,0,z);S.add(g);trees.push({g,p:i*1.7})});

 // ---------- बारिश, छींटे, लहरें, बिजली ----------
 for(let i=0;i<N;i++){rx[i]=(Math.random()-.5)*30;ry[i]=Math.random()*16;rz[i]=(Math.random()-.5)*30;rs[i]=15+Math.random()*8}
 rp=new Float32Array(N*6);rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(rp,3).setUsage(THREE.DynamicDrawUsage));
 rain=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xbcd8ff,transparent:true,opacity:.32}));rain.frustumCulled=false;S.add(rain);
 spp=new Float32Array(SPN*3).fill(-50);sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(spp,3).setUsage(THREE.DynamicDrawUsage));
 const pts=new THREE.Points(sg,new THREE.PointsMaterial({color:0xdcecff,size:.07,transparent:true,opacity:.7,depthWrite:false}));pts.frustumCulled=false;S.add(pts);
 const ringG=new THREE.RingGeometry(.85,1,24);ringG.rotateX(-Math.PI/2);
 for(let i=0;i<NRIP;i++){const m=new THREE.Mesh(ringG,new THREE.MeshBasicMaterial({color:0xcfe3ff,transparent:true,opacity:0,depthWrite:false}));m.visible=false;m.position.y=.02;S.add(m);rip.push({m,t:1})}
 bp=new Float32Array(BN*6);bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(bp,3).setUsage(THREE.DynamicDrawUsage));
 bolt=new THREE.LineSegments(bg,new THREE.LineBasicMaterial({color:0xeaf2ff,transparent:true,opacity:1,fog:false}));bolt.frustumCulled=false;bolt.visible=false;S.add(bolt);
 ok=true;
}catch(e){q('.hero').style.background='linear-gradient(#0a0f1e,#3a4660 70%,#ff8a3d)'}

function strike(){let x=rnd(-34,0),y=48,z=rnd(-55,-38),k=0;
 const seg=(ax,ay,az,bx,by,bz)=>{if(k>=BN)return;bp.set([ax,ay,az,bx,by,bz],k*6);k++};
 for(let i=0;i<16;i++){const nx=x+rnd(-2.6,2.6),ny=y-3;seg(x,y,z,nx,ny,z);
  if(Math.random()<.22)seg(nx,ny,z,nx+rnd(-6,6),ny-rnd(3,7),z);x=nx;y=ny}
 for(;k<BN;k++)bp.fill(0,k*6,k*6+6);
 bg.attributes.position.needsUpdate=true}
function ripple(x,z){const r=rip[ri];ri=(ri+1)%rip.length;r.m.position.set(x,.02,z);r.t=0;r.m.visible=true}
function size(){if(!ok)return;const W=cv.clientWidth,H=cv.clientHeight;R.setSize(W,H,false);C.aspect=W/H;C.updateProjectionMatrix();K=cl(1.15/C.aspect,1,2.4)}

let last=performance.now(),ps=0,px=0,py=0,tx=0,ty=0,nl=3,fl=0,vis=true;
function frame(now){
 const dt=Math.min(.05,(now-last)/1000),T=now/1000;last=now;
 const p=RM?.5:cl(scrollY/(innerHeight*.8),0,1);
 ps+=(p-ps)*(RM?1:.08);px+=(tx-px)*.05;py+=(ty-py)*.05;
 const U=sky.material.uniforms;
 U.top.value.copy(K0.st[0]).lerp(K0.dw[0],ps);U.bot.value.copy(K0.st[1]).lerp(K0.dw[1],ps);U.gi.value=ps;U.t.value=T;U.cd.value=lp(1,.6,ps);
 S.fog.color.copy(U.bot.value);S.fog.density=lp(.03,.016,ps);
 fill.color.copy(K0.f1).lerp(K0.f2,ps);fill.intensity=lp(.9,1.8,ps);sun.intensity=lp(0,2.8,ps);hemi.intensity=lp(.45,.75,ps);
 roofM.roughness=lp(.38,.9,ps);roofM.color.setScalar(lp(.6,1,ps));
 gnd.material.roughness=lp(.28,.85,ps);gnd.material.color.copy(K0.g1).lerp(K0.g2,ps);
 leafM.color.copy(K0.l1).lerp(K0.l2,ps);
 glassM.emissiveIntensity=lp(1,.3,ps);lampM.emissiveIntensity=lp(1.4,.2,ps);winL.intensity=lp(1.3,0,ps);porchL.intensity=lp(1.6,.1,ps);
 pud.forEach(m=>{m.material.emissive.copy(U.bot.value);m.material.emissiveIntensity=.55*ps});
 const dm=cl(1-ps*1.7,0,1);dmg.forEach(m=>{m.visible=dm>.01;m.material.opacity=m.material.userData.base*dm});
 trees.forEach(t=>{t.g.rotation.z=Math.sin(T*1.3+t.p)*.025*(1-ps*.6)+Math.sin(T*.5+t.p)*.01});
 // बिजली
 if(!RM&&ps<.4){nl-=dt;if(nl<0){nl=4+Math.random()*6;fl=.4;strike()}}
 fl=Math.max(0,fl-dt);
 const lf=fl>0?(Math.floor(fl*18)%2?3:.8)*cl(1-ps*2.5,0,1):0;
 flash.intensity=lf*1.4;hemi.intensity+=lf?.25:0;U.fl.value=lf;
 bolt.visible=lf>0;bolt.material.opacity=cl(lf/3,0,1);
 if(!RM){
  const n=Math.floor(N*(1-ps*.97)),sx=-.06;
  for(let i=0;i<n;i++){let y=ry[i]-rs[i]*dt,x=rx[i]+sx*rs[i]*dt,z=rz[i];
   const hy=roofY(x,z);
   if(y<0||y<hy){
    if(y>=0){const k=si;si=(si+1)%SPN;spp[k*3]=x;spp[k*3+1]=hy+.03;spp[k*3+2]=z;sv[k*3]=(Math.random()-.5)*1.4;sv[k*3+1]=1.2+Math.random()*1.6;sv[k*3+2]=(Math.random()-.5)*1.4;sl[k]=1}
    else if(Math.random()<.12)ripple(x,z);
    x=(Math.random()-.5)*30;z=(Math.random()-.5)*30;y=14+Math.random()*4}
   rx[i]=x;ry[i]=y;rz[i]=z;const j=i*6;rp[j]=x;rp[j+1]=y;rp[j+2]=z;rp[j+3]=x-sx*.5;rp[j+4]=y+.5;rp[j+5]=z}
  rg.setDrawRange(0,n*2);rg.attributes.position.needsUpdate=true;rain.material.opacity=.32*(1-ps*.6);
  for(let k=0;k<SPN;k++){if(sl[k]<=0)continue;sv[k*3+1]-=9*dt;spp[k*3]+=sv[k*3]*dt;spp[k*3+1]+=sv[k*3+1]*dt;spp[k*3+2]+=sv[k*3+2]*dt;sl[k]-=dt*3;if(sl[k]<=0)spp[k*3+1]=-50}
  sg.attributes.position.needsUpdate=true;
  rip.forEach(r=>{if(r.t>=1)return;r.t+=dt*1.4;if(r.t>=1){r.m.visible=false;return}r.m.scale.setScalar(.08+r.t*.65);r.m.material.opacity=(1-r.t)*.55*(1-ps*.9)})
 }else rg.setDrawRange(0,0);
 // कैमरा
 const tg=K0.tg.set(0,8+(K-1)*2.2-ps*1.2,0);
 C.position.set(tg.x+(6*(1-.35*ps)+px*1.5)*K,tg.y+(-.4-ps*1.2+py*.6)*K,tg.z+12.5*(1-.28*ps)*K);C.lookAt(tg);
 R.render(S,C)}

if(ok){size();addEventListener('resize',size);
 addEventListener('pointermove',e=>{tx=e.clientX/innerWidth*2-1;ty=-(e.clientY/innerHeight*2-1)},{passive:true});
 if(RM)frame(performance.now());else{(function loop(n){if(vis)frame(n);requestAnimationFrame(loop)})(performance.now())}
 new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(q('.hero'))}
})();
