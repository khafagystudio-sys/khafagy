const site=document.querySelector('.kh-site');
function updateHeaderClock(){const t=document.getElementById('headerClock'),d=document.getElementById('headerDate');if(!t||!d)return;const now=new Date();const locale='en-GB';t.textContent=new Intl.DateTimeFormat(locale,{timeZone:'Africa/Cairo',hour:'numeric',minute:'2-digit',hour12:true}).format(now);d.textContent=new Intl.DateTimeFormat(locale,{timeZone:'Africa/Cairo',day:'2-digit',month:'short'}).format(now);t.dateTime=now.toISOString();d.dateTime=now.toISOString()}
updateHeaderClock();setInterval(updateHeaderClock,30000);
const menu=document.getElementById('menuDialog'),menuToggle=document.getElementById('menuToggle'),menuClose=document.getElementById('menuClose');
function openMenu(){if(menu&&menu.showModal&&!menu.open){menu.showModal();document.documentElement.classList.add('kh-menu-open');menu.querySelector('.kh-overlay-links').scrollTop=0;if(menuClose)menuClose.focus({preventScroll:true})}if(menuToggle){menuToggle.classList.add('is-active');menuToggle.setAttribute('aria-expanded','true')}}
function closeMenu(){if(menu&&menu.open)menu.close();document.documentElement.classList.remove('kh-menu-open');if(menuToggle){menuToggle.classList.remove('is-active');menuToggle.setAttribute('aria-expanded','false');menuToggle.focus({preventScroll:true})}}
if(menuToggle)menuToggle.addEventListener('click',openMenu);
if(menuClose)menuClose.addEventListener('click',closeMenu);
if(menu){menu.addEventListener('click',e=>{if(e.target===menu)closeMenu()});menu.addEventListener('cancel',e=>{e.preventDefault();closeMenu()});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu))}
const reveals=document.querySelectorAll('.kh-reveal');
if('IntersectionObserver'in window){const io=new IntersectionObserver((entries,obs)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('kh-visible');obs.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -20px'});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add('kh-visible'));
const projectLoop=document.querySelector('.kh-home-project-loop');
if(projectLoop&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 const projectTrack=projectLoop.querySelector('.kh-project-track');
 const existingGroups=[...projectTrack.querySelectorAll('.kh-project-group')];
 if(existingGroups.length===2){const trailingGroup=existingGroups[1].cloneNode(true);trailingGroup.setAttribute('aria-hidden','true');projectTrack.appendChild(trailingGroup)}
 const projectCards=[...projectLoop.querySelectorAll('.kh-project-group .kh-work-card')];
 const setLoopDistance=()=>{
  const groups=[...projectLoop.querySelectorAll('.kh-project-group')],first=groups[0]?.querySelector('.kh-work-card'),clone=groups[1]?.querySelector('.kh-work-card');
  if(!first||!clone||!projectTrack)return;
  const firstBox=first.getBoundingClientRect(),cloneBox=clone.getBoundingClientRect();
  const distance=(cloneBox.left+cloneBox.width/2)-(firstBox.left+firstBox.width/2);
  if(Number.isFinite(distance)&&distance>0){projectTrack.style.setProperty('--project-loop-start',`${-distance}px`);projectTrack.style.setProperty('--project-loop-end',`${-2*distance}px`);projectTrack.classList.add('kh-project-loop-ready')}
 };
 setLoopDistance();window.addEventListener('resize',()=>requestAnimationFrame(setLoopDistance),{passive:true});
 let spotlightFrame=0;
 const updateProjectSpotlight=()=>{
  const r=projectLoop.getBoundingClientRect(),center=r.left+r.width/2;
  projectCards.forEach(card=>{const box=card.getBoundingClientRect(),offset=(box.left+box.width/2-center)/box.width,focus=Math.max(0,1-Math.min(1,Math.abs(offset)*.75));card.style.setProperty('--offset',Math.min(1.6,Math.abs(offset)).toFixed(3));card.style.setProperty('--scale',(0.75+focus*.36).toFixed(3));card.style.setProperty('--focus-opacity',(0.52+focus*.48).toFixed(3));card.style.setProperty('--focus-brightness',(0.60+focus*.42).toFixed(3))});
  spotlightFrame=requestAnimationFrame(updateProjectSpotlight)
 };
 const spotlightObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&!spotlightFrame)spotlightFrame=requestAnimationFrame(updateProjectSpotlight);else if(!entry.isIntersecting&&spotlightFrame){cancelAnimationFrame(spotlightFrame);spotlightFrame=0}}),{threshold:0});
 spotlightObserver.observe(projectLoop);
}
const grid=document.getElementById('workGrid');
if(grid){
 const cards=[...grid.querySelectorAll('.kh-work-card')],filters=document.querySelectorAll('.kh-filter-btn'),empty=document.getElementById('workEmpty');
 filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>b.classList.toggle('is-active',b===button));let n=0;cards.forEach(card=>{const show=button.dataset.filter==='All Projects'||card.dataset.category===button.dataset.filter;card.hidden=!show;if(show)n++});if(empty)empty.hidden=n>0;grid.scrollTo({left:0,behavior:'smooth'})}));
 const scroll=direction=>{const card=grid.querySelector('.kh-work-card:not([hidden])');if(card)grid.scrollBy({left:direction*(card.getBoundingClientRect().width+22)*1,behavior:'smooth'})};
 const prev=document.getElementById('workPrev'),next=document.getElementById('workNext');if(prev)prev.addEventListener('click',()=>scroll(-1));if(next)next.addEventListener('click',()=>scroll(1));
}

// Featured Work: slot 1 is the real project, other slots are placeholders until more work is added.
(() => {
 const section=document.querySelector('.kh-featured-project-section');
 if(!section)return;
 const $=id=>section.querySelector('#'+id);
 const art=section.querySelector('.kh-featured-art'),label=section.querySelector('.kh-featured-art-label');
 const title=$('featuredProjectTitle'),desc=$('featuredProjectDescription'),kicker=$('featuredKicker'),position=$('featuredPosition');
 const open=$('featuredOpen'),prev=$('featuredPrev'),next=$('featuredNext');
 const detail=$('featuredDetail'),close=$('featuredDetailClose');
 const dTitle=$('featuredDetailTitle'),dText=$('featuredDetailText'),dKick=$('featuredDetailKicker'),dLink=$('featuredDetailLink'),dFacts=$('featuredDetailFacts'),dImg=$('featuredDetailImage'),dPend=$('featuredDetailPending');
 const real={title:title.textContent,desc:desc.textContent,kicker:kicker.textContent,dText:dText.textContent};
 const total=3;let current=0;
 const render=()=>{
  const n=String(current+1).padStart(2,'0'),isReal=current===0;
  art.classList.toggle('has-image',isReal);
  dImg.classList.toggle('has-image',isReal);dPend.hidden=isReal;
  dLink.hidden=dFacts.hidden=!isReal;
  title.textContent=dTitle.textContent=isReal?real.title:`Project slot ${n}`;
  desc.textContent=isReal?real.desc:'Project image and details to be added.';
  dText.textContent=isReal?real.dText:'Temporary slot. Project image and details to be added.';
  kicker.textContent=isReal?real.kicker:'TEMPORARY SLOT';
  dKick.textContent=isReal?real.kicker:'PROJECT PREVIEW · TEMPORARY';
  label.textContent=`SLOT ${n} · IMAGE PENDING`;
  position.replaceChildren(document.createTextNode(`${n} / 03 `));
  const note=document.createElement('span');note.textContent=isReal?'Selected work':'Temporary slots';position.appendChild(note);
  open.setAttribute('aria-label',isReal?`Open ${real.title}`:`Open project slot ${n}, temporary preview`);
 };
 const meta=section.querySelector('.kh-featured-meta');
 const lockHeight=()=>{meta.style.minHeight='';let max=0;const keep=current;for(let i=0;i<total;i++){current=i;render();max=Math.max(max,meta.getBoundingClientRect().height)}current=keep;render();meta.style.minHeight=Math.ceil(max)+'px'};
 const card=section.querySelector('.kh-featured-project');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let busy=false;
 const turn=d=>{
  if(busy)return;
  if(reduce.matches){current=(current+d+total)%total;render();return}
  busy=true;card.classList.add('is-swapping');
  setTimeout(()=>{current=(current+d+total)%total;render();card.classList.remove('is-swapping');setTimeout(()=>{busy=false},320)},260);
 };
 prev.addEventListener('click',()=>turn(-1));
 next.addEventListener('click',()=>turn(1));
 section.addEventListener('keydown',e=>{if(!e.target.closest('.kh-featured-controls'))return;if(e.key==='ArrowLeft'){e.preventDefault();prev.click()}if(e.key==='ArrowRight'){e.preventDefault();next.click()}});
 open.addEventListener('click',()=>detail.showModal());
 close.addEventListener('click',()=>detail.close());
 detail.addEventListener('click',event=>{if(event.target!==detail)return;const r=detail.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)detail.close()});
 render();lockHeight();addEventListener('resize',()=>{clearTimeout(window.__khLock);window.__khLock=setTimeout(lockHeight,150)});
})();