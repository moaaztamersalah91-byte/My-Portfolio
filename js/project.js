(() => {
  const root=document.getElementById('projectDetail');
  if(!root)return;
  const DISPLAY_NAMES={'barber-website':'Barbur Website','clothing-store':'Clothing Store Website','coffee-website':'Coffe Website','dental-clinic':'Dental Clinic Website','fitness-website':'Fitness Website','hospital-website':'Hospital Website','hotel-website':'Hotel Website','luxury-interior-design':'Luxury Interior Design Website','luxury-jewelry':'Luxury Jewelry Website','motif-motors':'Cars Store Website','north-and-co':'NORTH & CO Website','photography-studio':'Photography Studio Website','real-estate':'Real Estate Website','restaurant':'Restaurent WebSite','wander-travel':'Wander Travel Website'};
  function applyDisplayName(){const n=DISPLAY_NAMES[p.slug||id];if(n)p.name={en:n,ar:n};}
  const id=new URLSearchParams(location.search).get('id')||PORTFOLIO.projects[0].slug;
  let p=PORTFOLIO.projects.find(x=>x.slug===id)||PORTFOLIO.projects[0];

  async function remote(){
    try{
      if(!window.MOAAZ_AUTH?.db)return;
      await window.MOAAZ_AUTH.ready;
      const s=await window.MOAAZ_AUTH.db.collection('projects').doc(id).get();
      if(s.exists)p={...p,...s.data()};
      applyDisplayName();
    }catch(e){console.warn('project remote',e)}
  }

  let liveStarted=false;
  async function startLive(){
    if(liveStarted||!window.MOAAZ_AUTH)return;
    await window.MOAAZ_AUTH.ready;
    if(liveStarted||!window.MOAAZ_AUTH?.db)return;
    const db=window.MOAAZ_AUTH.db;
    liveStarted=true;
    db.collection('projects').doc(id).onSnapshot(s=>{
      if(!s.exists)return;
      p={...p,...s.data()};
      applyDisplayName();
      const stats=root.querySelector('.detail-stats');
      if(stats)stats.innerHTML=`<span>↓ ${Number(p.downloadCount||0)} ${window.MOAazT('downloads')}</span>`;
    },err=>console.warn('project live',err));
  }

  async function render(){
    await remote();
    applyDisplayName();
    const lang=document.documentElement.lang;
    root.innerHTML=`<section class="project-detail section-pad"><a class="back-link" href="projects.html">← <span data-i18n="backToArchive">Back to archive</span></a><div class="detail-head"><div><span class="section-index">${String(PORTFOLIO.projects.indexOf(p)+1).padStart(2,'0')}</span><span class="project-cat">${p.cat[lang]}</span><h1>${p.name[lang]}</h1><p>${p.desc[lang]}</p></div><div class="detail-cover"><img src="${p.cover}" alt=""></div></div><div class="detail-body"><div><span class="section-index">02</span><h2 data-i18n="projectOverview">Project overview</h2><div class="project-detail-actions"><a class="btn btn-solid" href="${encodeURI(p.path||'#')}" target="_blank" rel="noopener" data-i18n="liveDemo">Explore</a></div></div><div><p>${p.desc[lang]} ${lang==='ar'?'تم بناء الواجهة لتكون واضحة وسريعة وقابلة للتطوير مع الحفاظ على شخصية بصرية مستقلة.':'Built as a focused frontend experience with a strong visual point of view, responsive structure and a distinct interaction rhythm.'}</p><div class="tag-list">${(p.tags||[]).slice(0,8).map(t=>`<span>${t}</span>`).join('')}</div></div></div></section>`;
    if(window.MOAazT)root.querySelectorAll('[data-i18n]').forEach(e=>e.innerHTML=window.MOAazT(e.dataset.i18n));
    bind();
  }

  function bind(){}

  render();
  startLive();
  window.addEventListener('moaaz:language',render);
})();
