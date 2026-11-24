/* Keep the original teaser, but let the moving logos immediately follow the mobile portrait. */
(() => {
 const hero=document.querySelector('.kh-site-home .kh-hero');
 const strip=document.querySelector('.kh-site-home .kh-client-strip');
 const card=hero?.querySelector('.kh-hero-project-card');
 if(!hero||!strip||!card)return;
 const anchor=document.createComment('Original desktop teaser position');
 card.before(anchor);
 const media=matchMedia('(max-width:820px)');
 const sync=()=>{if(media.matches)strip.after(card);else anchor.after(card)};
 sync();media.addEventListener('change',sync);
})();
