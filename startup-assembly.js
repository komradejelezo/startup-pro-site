/* StartUp Pro first-screen assembly. No blocking overlay, no dependencies. */
(()=>{'use strict';
const hero=document.getElementById('startup-assembly-hero');if(!hero)return;
const layer=document.getElementById('startup-assembly-layer'),status=document.getElementById('startup-assembly-status'),progress=document.getElementById('startup-assembly-progress'),replay=document.getElementById('startup-replay');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
const tones=['#ff8500','#e7008d','#08b8bf','#f5a331','#bf48a4'];
let active=[],timeouts=[],generation=0;
const wait=(fn,ms)=>{const id=setTimeout(fn,ms);timeouts.push(id)};
const animate=(el,keyframes,options)=>{if(!el)return;const a=el.animate(keyframes,{fill:'both',...options});active.push(a);return a};
const box=(el)=>{const r=el.getBoundingClientRect(),h=hero.getBoundingClientRect();return{x:r.left-h.left,y:r.top-h.top,w:r.width,h:r.height}};
function reveal(el,start,duration=650,kind='rise'){if(!el)return;const from=kind==='scale'?{opacity:0,transform:'translateY(18px) scale(.94)'}:kind==='fade'?{opacity:0,transform:'none'}:{opacity:0,transform:'translateY(22px)'};animate(el,[from,{opacity:1,transform:'none'}],{delay:start,duration,easing:'cubic-bezier(.18,.8,.2,1)'})}
function run(){generation++;const gen=generation;active.forEach(a=>a.cancel());active=[];timeouts.forEach(clearTimeout);timeouts=[];layer.replaceChildren();const existingLogo=hero.querySelector('.hero-logo-watermark');if(existingLogo)existingLogo.style.clipPath='inset(0 100% 0 0)';progress.style.width='0';status.style.opacity='0';if(reduce.matches){if(existingLogo)existingLogo.style.clipPath='none';document.documentElement.classList.remove('startup-preassembly');return;}
const w=hero.clientWidth,h=hero.clientHeight;
const copy=hero.querySelector('.hero-copy'),visual=hero.querySelector('.hero-visual');
const targets=[hero.querySelector('.eyebrow'),hero.querySelector('h1'),hero.querySelector('.hero-copy p'),hero.querySelector('.actions'),hero.querySelector('.chips'),hero.querySelector('.hero-team-art'),hero.querySelector('.hero-logo-watermark'),hero.querySelector('.hero-logo-backdrop'),...hero.querySelectorAll('.float')].filter(Boolean);
const timing=[380,760,1780,2380,2830,1500,400,900,2950,3150];
targets.forEach((el,i)=>{if(el.classList.contains('hero-logo-watermark'))return;reveal(el,timing[i]||1000,i===5?1200:650,i===5?'scale':'rise')});
// Build the actual StartUp logo in visible stages: first the wordmark, then the arrow.
// The same original transparent logo asset is used, with no duplicate artwork.
const logo=hero.querySelector('.hero-logo-watermark');
if(logo){
 // Immediately lock the real logo to an invisible mask before removing preload state.
 logo.style.clipPath='inset(0 100% 0 0)';
 const r=box(logo);
 const svgNS='http://www.w3.org/2000/svg';
 const tech=document.createElementNS(svgNS,'svg');
 tech.setAttribute('viewBox','0 0 1000 350');tech.setAttribute('preserveAspectRatio','none');
 tech.setAttribute('class','startup-logo-tech');
 tech.style.cssText=`left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`;
 const paths=[
  ['M 8 270 H 990','#ff8500'],
  ['M 20 65 H 990','#e7008d'],
  ['M 670 320 V 20 M 648 45 L 670 20 L 692 45','#08b8bf'],
  ['M 0 335 H 1000','#08b8bf']
 ];
 paths.forEach(([d,color],i)=>{
  const path=document.createElementNS(svgNS,'path');path.setAttribute('d',d);path.setAttribute('stroke',color);
  path.setAttribute('stroke-dasharray','12 11');path.style.opacity='.75';tech.appendChild(path);
  animate(path,[{strokeDashoffset:260,opacity:0},{strokeDashoffset:0,opacity:.8,offset:.55},{strokeDashoffset:-70,opacity:0}],{delay:150+i*110,duration:1550,easing:'ease-in-out'});
 });
 layer.appendChild(tech);
 // Reveal the original transparent image exactly once; keep the completed state.
 animate(logo,[
  {clipPath:'inset(0 100% 0 0)',offset:0},
  {clipPath:'inset(0 75% 0 0)',offset:.24},
  {clipPath:'inset(0 46% 0 0)',offset:.48},
  {clipPath:'inset(0 18% 0 0)',offset:.74},
  {clipPath:'inset(0 0% 0 0)',offset:1}
 ],{delay:200,duration:1800,easing:'cubic-bezier(.25,.7,.25,1)'});
 wait(()=>{if(gen===generation)logo.style.clipPath='inset(0 0% 0 0)'},2050);
}

// The delayed animations now own initial visibility; release the CSS preload mask.
document.documentElement.classList.remove('startup-preassembly');
const anchors=[hero.querySelector('.hero-copy h1'),hero.querySelector('.hero-copy p'),hero.querySelector('.hero-team-art'),hero.querySelector('.actions'),hero.querySelector('.float.f1')].filter(Boolean);
anchors.forEach((el,i)=>{const r=box(el);if(!r.w||!r.h)return;const pad=12,frame=document.createElement('div');frame.className='startup-assembly-frame';frame.style.cssText=`left:${Math.max(0,r.x-pad)}px;top:${Math.max(0,r.y-pad)}px;width:${r.w+pad*2}px;height:${r.h+pad*2}px;--frame-tone:${tones[i%tones.length]}`;layer.appendChild(frame);const start=450+i*470;animate(frame,[{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:.65,clipPath:'inset(0 0% 0 0)',offset:.45},{opacity:0,clipPath:'inset(0 0% 0 0)'}],{delay:start,duration:1650,easing:'ease-in-out'})});
reveal(status,200,250,'fade');const start=performance.now(),total=4300;function tick(now){if(gen!==generation)return;const t=Math.min(1,(now-start)/total);progress.style.width=(100*t).toFixed(1)+'%';status.textContent='';if(t<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);
wait(()=>{if(gen!==generation)return;animate(status,[{opacity:1},{opacity:0}],{duration:450});animate(progress,[{opacity:1},{opacity:0}],{duration:450});},4400);
wait(()=>{if(gen===generation)layer.replaceChildren()},5000);
}
replay.addEventListener('click',run);
if(document.readyState==='complete')setTimeout(run,150);else window.addEventListener('load',()=>setTimeout(run,150),{once:true});
})();
