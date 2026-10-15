/* LAVÉRA premium — visual-only enhancements (no business logic) */
(()=>{
  const d=document;
  const bar=d.createElement('div');bar.className='lv-progress';d.body.appendChild(bar);
  const hdr=d.querySelector('.header');
  const onScroll=()=>{
    const y=scrollY,h=d.documentElement.scrollHeight-innerHeight;
    bar.style.transform='scaleX('+(h>0?y/h:0)+')';
    hdr&&hdr.classList.toggle('is-scrolled',y>40);
  };
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('lv-in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  const sel='.intro>*,.section-title,.cat,.statement>*,.contact-card,.story-grid>*,.cart-item,.page-heading';
  const tag=r=>r.querySelectorAll(sel+',.product').forEach((el,i)=>{
    if(el.dataset.lv)return;el.dataset.lv=1;el.classList.add('lv-reveal');el.style.setProperty('--d',(i%4)*.09+'s');io.observe(el)});
  tag(d);
  // products render async from Firebase — observe them as they appear
  new MutationObserver(()=>tag(d)).observe(d.body,{childList:true,subtree:true});
  // gentle hero parallax
  const art=d.querySelector('.hero-art img');
  if(art&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    addEventListener('mousemove',e=>{art.style.translate=((e.clientX/innerWidth-.5)*-14)+'px '+((e.clientY/innerHeight-.5)*-10)+'px'},{passive:true});
  }
})();
