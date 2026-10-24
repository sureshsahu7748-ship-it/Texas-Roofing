// पेज के इंटरैक्शन: काउंटर, रिवील, before/after स्लाइडर, स्टेप्स, टेस्टिमोनियल, बटन, फ़ॉर्म
(()=>{
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const el=e.target,to=+el.dataset.to,dec=+el.dataset.d||0,s=performance.now();
 (function tick(n){const k=Math.min(1,(n-s)/1500),v=to*(1-Math.pow(1-k,3));el.textContent=(dec?v.toFixed(dec):Math.round(v).toLocaleString())+(el.dataset.s||'');if(k<1)requestAnimationFrame(tick)})(s)}),{threshold:.6});
qa('.num').forEach(n=>co.observe(n));
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}}),{threshold:.3});
qa('.rv').forEach(n=>ro.observe(n));

const ba=q('#ba');let drag=false;
const setX=v=>ba.style.setProperty('--x',Math.max(4,Math.min(96,v))+'%');
const fromE=e=>{const r=ba.getBoundingClientRect();setX((e.clientX-r.left)/r.width*100)};
ba.addEventListener('pointerdown',e=>{drag=true;ba.setPointerCapture(e.pointerId);fromE(e)});
ba.addEventListener('pointermove',e=>{if(drag)fromE(e)});
['pointerup','pointercancel'].forEach(ev=>ba.addEventListener(ev,()=>drag=false));
new IntersectionObserver((es,o)=>{if(!es[0].isIntersecting)return;o.disconnect();if(RM){setX(50);return}const s=performance.now();
 (function a(n){const k=Math.min(1,(n-s)/1600);setX(92-42*(1-Math.pow(1-k,3)));if(k<1&&!drag)requestAnimationFrame(a)})(s)},{threshold:.5}).observe(ba);

const pl=q('#proc'),st=qa('.step');
function pf(){const r=pl.getBoundingClientRect(),k=Math.max(0,Math.min(1,(innerHeight*.72-r.top)/r.height));pl.style.setProperty('--k',k);st.forEach((s,i)=>s.classList.toggle('on',k>i/4+.02))}
addEventListener('scroll',pf,{passive:true});pf();

const qs=qa('.qt');let qi=0;if(!RM)setInterval(()=>{qs[qi].classList.remove('on');qi=(qi+1)%qs.length;qs[qi].classList.add('on')},4800);

if(matchMedia('(pointer:fine)').matches)qa('.mag').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.2+'px,'+(e.clientY-r.top-r.height/2)*.3+'px)'});b.addEventListener('pointerleave',()=>b.style.transform='')});

const form=q('#quote-form');
if(form)form.addEventListener('submit',e=>{e.preventDefault();form.querySelector('button').textContent='Request sent. We will call you soon.'});
})();
