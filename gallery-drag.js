/* Mouse dragging uses the existing seamless CSS loop, including its timing. */
(()=>{
 const gallery=document.querySelector('.kh-home-project-loop');
 if(!gallery)return;
 const track=gallery.querySelector('.kh-project-track');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let active=null,settleFrame=0,speed=0,lastX=0,lastTime=0,moved=false;
 const loopAnimation=()=>track.getAnimations().find(a=>a.animationName==='kh-projects-loop');
 const distance=()=>Math.abs(parseFloat(track.style.getPropertyValue('--project-loop-start')))||0;
 const wrap=(t,d)=>((t%d)+d)%d;
 function shift(animation,dx){
  const span=distance(),duration=Number(animation.effect.getTiming().duration);
  if(span&&duration)animation.currentTime=wrap(Number(animation.currentTime||0)-dx*duration/span,duration);
 }
 function resume(animation){
  cancelAnimationFrame(settleFrame);
  let previous=performance.now();
  function coast(now){
   if(active!==null||reduced.matches){animation.play();return;}
   const dt=Math.min(now-previous,40);previous=now;
   const target=-distance()/18000;
   speed=target+(speed-target)*Math.exp(-dt/170);
   shift(animation,speed*dt);
   if(Math.abs(speed-target)<.008){animation.play();settleFrame=0;return;}
   settleFrame=requestAnimationFrame(coast);
  }
  settleFrame=requestAnimationFrame(coast);
 }
 gallery.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0||reduced.matches)return;
  const animation=loopAnimation();
  if(!animation||!distance())return;
  cancelAnimationFrame(settleFrame);settleFrame=0;
  active=event.pointerId;lastX=event.clientX;lastTime=performance.now();speed=0;moved=false;
  animation.pause();gallery.classList.add('kh-gallery-dragging');
  gallery.setPointerCapture(active);event.preventDefault();
 });
 gallery.addEventListener('pointermove',event=>{
  if(event.pointerId!==active)return;
  const animation=loopAnimation();if(!animation)return;
  const now=performance.now(),dx=event.clientX-lastX,dt=Math.max(8,now-lastTime);
  if(dx)moved=true;
  shift(animation,dx);speed=Math.max(-2,Math.min(2,dx/dt));lastX=event.clientX;lastTime=now;
 });
 function finish(event){
  if(event.pointerId!==active)return;
  const id=active;active=null;gallery.classList.remove('kh-gallery-dragging');
  if(gallery.hasPointerCapture(id))gallery.releasePointerCapture(id);
  const animation=loopAnimation();if(!animation)return;
  if(performance.now()-lastTime>100)speed=0;
  resume(animation);
 }
 gallery.addEventListener('pointerup',finish);
 gallery.addEventListener('pointercancel',finish);
 gallery.addEventListener('lostpointercapture',finish);
 gallery.addEventListener('dragstart',event=>event.preventDefault());
 gallery.addEventListener('click',event=>{if(moved){event.preventDefault();event.stopPropagation();moved=false;}},true);
 window.addEventListener('blur',()=>{if(active!==null)finish({pointerId:active});});
})();
