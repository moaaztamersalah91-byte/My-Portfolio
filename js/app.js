(() => {
  const I18N = {
    en:{loading:'Preparing your experience',navHome:'Home',navProjects:'Projects',navAbout:'About',navContact:'Contact',navDashboard:'Dashboard',heroEyebrow:'Frontend Developer / Creator',heroTitle:'I build digital<br><em>experiences</em> with intent.',heroDesc:'A frontend developer from Egypt crafting bold, fast and memorable interfaces — with code, motion and a little obsession over the details.',viewWork:'Explore projects',moreAbout:'More about me',scroll:'Scroll to explore',selectedStatement:'Selected statement',statement:'Not just websites.<br><span>Identities people remember.</span>',statementDesc:'Every project is treated like a small world: a point of view, a visual rhythm, and an interaction language that feels deliberate from the first frame to the last click.',projectsLabel:'Projects',countryLabel:'Country',curiosityLabel:'Curiosity',featuredTitle:'Featured work',allProjects:'View all projects',channelTitle:'Code, teach, repeat.',channelDesc:'I also share what I build and learn through Code With Moaaz — practical frontend content for people who want to make things.',visitChannel:'Visit channel',closingTitle:'Have an idea worth<br><em>building?</em>',startConversation:'Start a conversation',madeIn:'Made in Egypt · Built with HTML, CSS & JavaScript',letsTalk:"Let's talk",projectsKicker:'The archive',projectsTitle:'A collection of<br><em>digital worlds.</em>',projectsIntro:'Fifteen frontend experiences across hospitality, fashion, travel, healthcare, automotive and more. Filter them, search them, fall into a rabbit hole.',searchPlaceholder:'Search projects, keywords, tech...',noResults:'Nothing matched that search.',tryAgain:'Try another keyword or clear the filter.',aboutKicker:'The person behind the pixels',aboutTitle:'Hi, I\'m<br><em>Moaaz.</em>',aboutLead:'A frontend developer and creator from Egypt who cares about how a digital product feels, not only how it works.',storyKicker:'The approach',storyTitle:'Code is the material.<br><span>Experience is the craft.</span>',storyP1:'I like interfaces with a point of view. Clean structure, strong typography, purposeful motion and details that reward a second look.',storyP2:'My portfolio is a growing lab of real frontend builds — from boutique brands and hotels to clinics, travel concepts and automotive experiences.',skillsKicker:'Toolkit',locationTitle:'Based in<br><em>Egypt.</em>',contactKicker:'Open line',contactTitle:'Let\'s make<br><em>something real.</em>',contactLead:'Have a project, collaboration or just a good idea? I\'m one message away.',whatsapp:'WhatsApp',phone:'Phone',messageMe:'Send a message ↗',callMe:'Give me a call ↗',findMe:'Find me there ↗',watchChannel:'Watch the channel ↗',contactNoteTitle:'Egyptian creator.<br>Worldwide internet.',contactNoteDesc:'Based in Egypt, available for digital work wherever the brief lives.',seeWork:'See my work',backProjects:'Back to projects',adminKicker:'Private area',adminTitle:'Admin<br><em>access.</em>',adminDesc:'This private dashboard is for the site owner. Firebase Authentication and Firestore handle accounts, messages, replies and notifications.',returnHome:'Return home',privateArea:'Private administration',liveDemo:'Explore',download:'Download',projectOverview:'Project overview',projectTags:'Keywords',nextProject:'Next project',backToArchive:'Back to archive',account:'Account',messages:'Messages',notifications:'Notifications',logout:'Sign out',send:'Send',messagePlaceholder:'Write your message…',messageAuthHint:'Sign in first so the conversation stays attached to your account.',downloads:'Downloads',totalUsers:'Users',sent:'Sent',loginRequired:'Please sign in to continue.',replyFromAdmin:'Admin reply',userMessage:'Your message',deleteReply:'Delete reply',deleteReplyConfirm:'Delete this admin reply?',replyDeleted:'Reply deleted.',noMessages:'No messages yet.',liveStatus:'LIVE',firebaseError:'FIREBASE ERROR',unreadMessages:'Unread messages',newLabel:'NEW',markRead:'Mark read',userLabel:'User',loaderBoot:'BOOT SEQUENCE',loaderOs:'PORTFOLIO.OS',loaderCreator:'FRONTEND / CREATOR',loaderVisual:'VISUAL SYSTEM',loaderSignal:'NO SIGNAL / ALL SYSTEMS',loaderCache:'IMAGE CACHE',loaderMotion:'MOTION',loaderReady:'READY',loaderProjects:'PROJECTS',homeTitle:'Moaaz Salah — Frontend Developer',projectsTitleDoc:'Projects — Moaaz Salah',aboutTitleDoc:'About — Moaaz Salah',contactTitleDoc:'Contact — Moaaz Salah',accountTitleDoc:'Account — Moaaz Salah',dashboardTitleDoc:'Dashboard — Moaaz Salah',projectTitleDoc:'Project — Moaaz Salah',reply:'Reply',save:'Save',publish:'Published',unpublish:'Unpublished',initialize:'Initialize 15 projects',replies:'Replies',projectId:'Project ID',projectNameEn:'Name (English)',projectNameAr:'Name (Arabic)',projectCategoryEn:'Category (English)',projectCategoryAr:'Category (Arabic)',projectCover:'Cover URL / path',projectDemo:'Live Demo URL / path',projectZip:'Download ZIP URL / path',projectDescriptionEn:'Description (English)',projectDescriptionAr:'Description (Arabic)',projectKeywords:'Keywords',projectTechnologies:'Technologies',publishNow:'Publish immediately',addProject:'Add project',projectAdded:'Project added successfully.',projectAddError:'Could not add the project.',themeToggle:'Toggle theme',languageToggle:'Change language',menuOpen:'Open menu',menuClose:'Close menu',projectSlugPlaceholder:'my-new-project',coverPlaceholder:'assets/covers/project.webp',demoPlaceholder:'https://example.com',zipPlaceholder:'downloads/Project.zip',keywordsPlaceholder:'fashion, store, ecommerce',technologiesPlaceholder:'HTML, CSS, JavaScript'},
    ar:{loading:'نجهز تجربتك',navHome:'الرئيسية',navProjects:'المشاريع',navAbout:'عني',navContact:'تواصل',navDashboard:'لوحة الإدارة',heroEyebrow:'مطور واجهات / صانع محتوى',heroTitle:'أصنع تجارب<br><em>رقمية</em> لها معنى.',heroDesc:'مطور واجهات من مصر أصنع تجارب جريئة وسريعة ولا تُنسى — بالكود والحركة واهتمام كبير بالتفاصيل.',viewWork:'استكشف المشاريع',moreAbout:'اعرف عني أكثر',scroll:'مرر للاستكشاف',selectedStatement:'فكرة مختارة',statement:'مش مجرد مواقع.<br><span>هويات الناس تفتكرها.</span>',statementDesc:'كل مشروع عندي عالم صغير له رؤية وإيقاع بصري ولغة تفاعل محسوبة من أول لحظة لآخر ضغطة.',projectsLabel:'المشاريع',countryLabel:'الدولة',curiosityLabel:'فضول',featuredTitle:'أعمال مختارة',allProjects:'كل المشاريع',channelTitle:'أبرمج وأعلّم وأكرر.',channelDesc:'بشارك كمان اللي ببنيه واللي بتعلمه من خلال قناة كود ويذ معاذ — محتوى عملي للناس اللي بتحب تصنع حاجات حقيقية.',visitChannel:'زيارة القناة',closingTitle:'عندك فكرة تستاهل<br><em>تتبني؟</em>',startConversation:'ابدأ محادثة',madeIn:'صُنع في مصر · باستخدام HTML وCSS وJavaScript',letsTalk:'خلينا نتكلم',projectsKicker:'الأرشيف',projectsTitle:'مجموعة من<br><em>العوالم الرقمية.</em>',projectsIntro:'خمسة عشر تجربة واجهات في الضيافة والأزياء والسفر والرعاية الصحية والسيارات وغيرها. صفّيها وابحث فيها وادخل في التفاصيل.',searchPlaceholder:'ابحث عن مشروع أو كلمة أو تقنية...',noResults:'مفيش نتيجة مطابقة للبحث.',tryAgain:'جرب كلمة تانية أو امسح الفلتر.',aboutKicker:'الشخص وراء التفاصيل',aboutTitle:'أهلًا، أنا<br><em>معاذ.</em>',aboutLead:'مطور واجهات وصانع محتوى من مصر، يهمني إحساس المنتج الرقمي بقدر اهتمامي بإنه يشتغل صح.',storyKicker:'الأسلوب',storyTitle:'الكود هو الخامة.<br><span>والتجربة هي الصنعة.</span>',storyP1:'بحب الواجهات اللي ليها شخصية. هيكل نظيف، خطوط قوية، حركة مقصودة وتفاصيل تكافئ اللي يبص مرة تانية.',storyP2:'البورتفوليو بتاعي معمل بيكبر بتجارب واجهات حقيقية — من البراندات والفنادق للعيادات والسفر والسيارات.',skillsKicker:'الأدوات',locationTitle:'مقيم في<br><em>مصر.</em>',contactKicker:'خط مفتوح',contactTitle:'خلينا نعمل<br><em>حاجة حقيقية.</em>',contactLead:'عندك مشروع أو تعاون أو حتى فكرة حلوة؟ أنا على بعد رسالة.',whatsapp:'واتساب',phone:'الهاتف',messageMe:'ابعت رسالة ↗',callMe:'اتصل بيا ↗',findMe:'لاقيني هناك ↗',watchChannel:'شوف القناة ↗',contactNoteTitle:'صانع محتوى مصري.<br>والإنترنت ملوش حدود.',contactNoteDesc:'مقيم في مصر ومتاح للشغل الرقمي مهما كان مكان المشروع.',seeWork:'شوف شغلي',backProjects:'العودة للمشاريع',adminKicker:'منطقة خاصة',adminTitle:'دخول<br><em>الإدارة.</em>',adminDesc:'الواجهة دي مخصصة لصاحب الموقع. تسجيل الدخول والرسائل والردود والإشعارات متوصلة بفايربيس.',returnHome:'العودة للرئيسية',privateArea:'إدارة خاصة',liveDemo:'استكشف',download:'تحميل',projectOverview:'نظرة على المشروع',projectTags:'الكلمات المفتاحية',nextProject:'المشروع التالي',backToArchive:'العودة للأرشيف',account:'حسابي',messages:'الرسائل',notifications:'الإشعارات',logout:'تسجيل الخروج',send:'إرسال',messagePlaceholder:'اكتب رسالتك…',messageAuthHint:'سجّل دخولك الأول عشان المحادثة تفضل مرتبطة بحسابك.',downloads:'التحميلات',totalUsers:'المستخدمون',sent:'تم الإرسال',loginRequired:'سجّل دخولك للمتابعة.',replyFromAdmin:'رد الإدارة',userMessage:'رسالتك',deleteReply:'حذف الرد',deleteReplyConfirm:'هل تريد حذف رد الإدارة ده؟',replyDeleted:'تم حذف الرد.',noMessages:'لا توجد رسائل بعد.',liveStatus:'مباشر',firebaseError:'خطأ في فايربيس',unreadMessages:'رسائل غير مقروءة',newLabel:'جديد',markRead:'تحديد كمقروء',userLabel:'مستخدم',loaderBoot:'بدء التشغيل',loaderOs:'نظام البورتفوليو',loaderCreator:'مطور واجهات / صانع محتوى',loaderVisual:'النظام البصري',loaderSignal:'لا توجد إشارة / كل الأنظمة',loaderCache:'ذاكرة الصور',loaderMotion:'الحركة',loaderReady:'جاهز',loaderProjects:'المشاريع',homeTitle:'معاذ صلاح — مطور واجهات',projectsTitleDoc:'المشاريع — معاذ صلاح',aboutTitleDoc:'عني — معاذ صلاح',contactTitleDoc:'تواصل — معاذ صلاح',accountTitleDoc:'حسابي — معاذ صلاح',dashboardTitleDoc:'لوحة الإدارة — معاذ صلاح',projectTitleDoc:'المشروع — معاذ صلاح',reply:'رد',save:'حفظ',publish:'منشور',unpublish:'غير منشور',initialize:'تجهيز الـ15 مشروع',replies:'الردود',projectId:'معرّف المشروع',projectNameEn:'اسم المشروع بالإنجليزية',projectNameAr:'اسم المشروع بالعربية',projectCategoryEn:'التصنيف بالإنجليزية',projectCategoryAr:'التصنيف بالعربية',projectCover:'رابط / مسار صورة الغلاف',projectDemo:'رابط / مسار الموقع',projectZip:'رابط / مسار ملف ZIP',projectDescriptionEn:'الوصف بالإنجليزية',projectDescriptionAr:'الوصف بالعربية',projectKeywords:'الكلمات المفتاحية',projectTechnologies:'التقنيات',publishNow:'نشر المشروع فورًا',addProject:'إضافة المشروع',projectAdded:'تمت إضافة المشروع بنجاح.',projectAddError:'تعذر إضافة المشروع.',themeToggle:'تغيير المظهر',languageToggle:'تغيير اللغة',menuOpen:'فتح القائمة',menuClose:'إغلاق القائمة',projectSlugPlaceholder:'مشروع-جديد',coverPlaceholder:'assets/covers/project.webp',demoPlaceholder:'https://example.com',zipPlaceholder:'downloads/Project.zip',keywordsPlaceholder:'أزياء، متجر، تجارة إلكترونية',technologiesPlaceholder:'HTML، CSS، JavaScript'}
  };
  const key='moaaz-lang', themeKey='moaaz-theme';
  const lang=localStorage.getItem(key)||'en'; document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  function t(k){return (I18N[document.documentElement.lang]||I18N.en)[k]||k} window.MOAazT=t;
  function updateDocumentTitle(){const lang=document.documentElement.lang;const path=location.pathname.toLowerCase();let key='homeTitle';if(path.endsWith('/projects.html'))key='projectsTitleDoc';else if(path.endsWith('/about.html'))key='aboutTitleDoc';else if(path.endsWith('/contact.html'))key='contactTitleDoc';else if(path.endsWith('/account.html'))key='accountTitleDoc';else if(path.endsWith('/admin.html'))key='dashboardTitleDoc';else if(path.endsWith('/project.html'))key='projectTitleDoc';document.title=t(key)}
  function apply(){const dict=I18N[document.documentElement.lang]||I18N.en;document.querySelectorAll('[data-i18n]').forEach(el=>{const v=dict[el.dataset.i18n];if(v!==undefined)el.innerHTML=v});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>el.placeholder=dict[el.dataset.i18nPlaceholder]||'');const b=document.getElementById('langBtn');if(b){b.textContent=document.documentElement.lang==='ar'?'EN':'AR';b.setAttribute('aria-label',dict.languageToggle)}const tb=document.getElementById('themeBtn');if(tb)tb.setAttribute('aria-label',dict.themeToggle);updateDocumentTitle();}
  function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem(themeKey,theme)} setTheme(localStorage.getItem(themeKey)||'light');
  function curtain(){const c=document.getElementById('theme-curtain');if(!c)return;c.classList.remove('run');void c.offsetWidth;c.classList.add('run')}
  window.addEventListener('moaaz:message-live',()=>{renderAccount();});
  window.addEventListener('moaaz:admin-message-live',()=>{renderAdmin();});
  function initMobileMenu(){
    const header=document.querySelector('.site-header');
    const btn=document.getElementById('mobileMenuBtn');
    if(!header||!btn||btn.dataset.bound)return;
    btn.dataset.bound='1';
    let menu=document.getElementById('mobileMenu');
    let backdrop=document.getElementById('mobileMenuBackdrop');
    if(!menu){
      menu=document.createElement('nav');
      menu.id='mobileMenu'; menu.className='mobile-menu'; menu.setAttribute('aria-hidden','true');
      const links=[
        ['index.html','navHome','01'],['projects.html','navProjects','02'],['about.html','navAbout','03'],['contact.html','navContact','04'],['admin.html','navDashboard','05']
      ];
      menu.innerHTML=links.map(([href,key,n])=>`<a href="${href}" data-i18n="${key}"><span></span><span>${n}</span></a>`).join('');
      document.body.appendChild(menu);
    }
    if(!backdrop){
      backdrop=document.createElement('div'); backdrop.id='mobileMenuBackdrop'; backdrop.className='mobile-menu-backdrop';
      document.body.appendChild(backdrop);
    }
    const sync=()=>{
      const open=btn.getAttribute('aria-expanded')==='true';
      menu.classList.toggle('is-open',open); backdrop.classList.toggle('is-open',open);
      menu.setAttribute('aria-hidden',String(!open));
      const key=open?'menuClose':'menuOpen';
      btn.setAttribute('aria-label',t(key));
      document.documentElement.classList.toggle('mobile-menu-open',open);
    };
    const close=()=>{btn.setAttribute('aria-expanded','false');sync()};
    btn.addEventListener('click',()=>{btn.setAttribute('aria-expanded',btn.getAttribute('aria-expanded')!=='true'?'true':'false');sync()});
    backdrop.addEventListener('click',close);
    menu.addEventListener('click',e=>{if(e.target.closest('a'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    // Keep the correct active page and language text after every language switch.
    window.addEventListener('moaaz:language',()=>{
      menu.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;el.firstElementChild.textContent=t(key)});
      const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
      menu.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===current));
      sync();
    });
    menu.querySelectorAll('[data-i18n]').forEach(el=>{el.firstElementChild.textContent=t(el.dataset.i18n)});
    const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    menu.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===current));
    sync();
  }
  document.addEventListener('DOMContentLoaded',()=>{apply();initMobileMenu();const lb=document.getElementById('langBtn');if(lb)lb.onclick=()=>{curtain();setTimeout(()=>{const n=document.documentElement.lang==='ar'?'en':'ar';document.documentElement.lang=n;document.documentElement.dir=n==='ar'?'rtl':'ltr';localStorage.setItem(key,n);apply();renderProjects();renderAccount();renderAdmin();window.dispatchEvent(new Event('moaaz:language'));},420)};const tb=document.getElementById('themeBtn');if(tb)tb.onclick=()=>{curtain();setTimeout(()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'),420)};document.querySelectorAll('[data-logout]').forEach(b=>b.onclick=async()=>{await window.MOAAZ_AUTH?.logout();location.href='index.html'});if(document.body.classList.contains('home'))loader();renderProjects();wireLinks();bindDownloadClicks();renderAccount();bindMessageForm();renderAdmin();});
  function loader(){const l=document.getElementById('page-loader');if(!l)return;const p=l.querySelector('.loader-percent'),line=l.querySelector('.loader-line i'),status=l.querySelector('[data-loader-status]'),phase=l.querySelector('[data-loader-phase]'),cache=l.querySelector('[data-loader-cache]'),st=document.documentElement.lang==='ar'?['بنجهز التجربة','بنحمّل الهوية البصرية','بنجهز المشاريع','بنظبط الحركة','جاهز']:['INITIALIZING EXPERIENCE','LOADING VISUAL IDENTITY','LOADING PROJECT ARCHIVE','CALIBRATING MOTION','SYSTEM READY'];const covers=(window.PORTFOLIO?.projects||[]).map(x=>x.cover).filter(Boolean),start=performance.now(),minTime=1900;let loaded=0,percent=0,stage=-1;covers.forEach(src=>{const im=new Image();im.onload=im.onerror=()=>loaded++;im.src=src});function tick(now){const time=Math.min(100,(now-start)/minTime*100),asset=covers.length?Math.min(100,loaded/covers.length*100):100,target=Math.min(100,Math.floor(Math.min(time,Math.max(12,asset))));if(target>percent)percent=Math.min(100,percent+Math.max(1,target-percent));p.textContent=String(percent).padStart(3,'0');line.style.width=percent+'%';if(cache)cache.textContent=String(Math.round(asset)).padStart(2,'0');const n=Math.min(4,Math.floor(percent/20));if(n!==stage){stage=n;status.textContent=phase.textContent=st[n]}if(percent<100)requestAnimationFrame(tick);else setTimeout(()=>l.classList.add('done'),520)}requestAnimationFrame(tick)}
  function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[ـ]/g,'').replace(/[^\p{L}\p{N}\s-]/gu,' ').replace(/\s+/g,' ').trim()}
  let activeCat='all';
  let stopProjectLive=null;
  let liveProjectsCache=null;
  async function firestoreProjects(){if(!window.MOAAZ_AUTH)return null;try{await window.MOAAZ_AUTH.ready;const db=window.MOAAZ_AUTH.db;if(!db)return null;const snap=await db.collection('projects').where('published','==',true).get();if(snap.empty)return null;return snap.docs.map(d=>({id:d.id,...d.data()}));}catch(e){console.warn('projects read',e);return null}}
  const DISPLAY_NAMES={'barber-website':'Barbur Website','clothing-store':'Clothing Store Website','coffee-website':'Coffe Website','dental-clinic':'Dental Clinic Website','fitness-website':'Fitness Website','hospital-website':'Hospital Website','hotel-website':'Hotel Website','luxury-interior-design':'Luxury Interior Design Website','luxury-jewelry':'Luxury Jewelry Website','motif-motors':'Cars Store Website','north-and-co':'NORTH & CO Website','photography-studio':'Photography Studio Website','real-estate':'Real Estate Website','restaurant':'Restaurent WebSite','wander-travel':'Wander Travel Website'}; function normalizeProject(p){const slug=p.slug||p.id;const displayName=DISPLAY_NAMES[slug];return {slug,path:p.path,name:displayName?{en:displayName,ar:displayName}:(p.name||{en:p.nameEn||'',ar:p.nameAr||''}),desc:p.desc||p.description||{en:'',ar:''},cat:p.cat||p.category||{en:p.category||'',ar:''},tags:p.tags||p.keywords||[],keywords:p.keywords||p.tags||[],technologies:p.technologies||[],cover:p.cover||'',download:p.download||'',downloadCount:Number(p.downloadCount||0),published:p.published!==false}}
  async function getProjects(){const remote=liveProjectsCache?.length?liveProjectsCache:await firestoreProjects();const base=remote?.length?remote.map(normalizeProject):window.PORTFOLIO.projects.map(normalizeProject);return base}
  async function startProjectLive(){if(stopProjectLive||!window.MOAAZ_AUTH)return;try{await window.MOAAZ_AUTH.ready;const db=window.MOAAZ_AUTH.db;if(stopProjectLive||!db)return;stopProjectLive=db.collection('projects').where('published','==',true).onSnapshot(snap=>{liveProjectsCache=snap.docs.map(d=>({id:d.id,...d.data()}));renderProjects();},err=>console.warn('project live listener',err));}catch(e){console.warn('project live init',e)}}
  async function renderProjects(){const grid=document.getElementById('projectGrid'),featured=document.getElementById('featuredGrid');if(!grid&&!featured)return;startProjectLive();const filters=document.getElementById('filters');const source=await getProjects();if(filters){const cats=[...new Map(source.map(p=>[p.cat.en,p.cat])).values()];filters.innerHTML=`<button class="filter ${activeCat==='all'?'active':''}" data-cat="all">${document.documentElement.lang==='ar'?'الكل':'All'}</button>`+cats.map(c=>`<button class="filter ${activeCat===c.en?'active':''}" data-cat="${c.en}">${c[document.documentElement.lang]}</button>`).join('');if(!filters.dataset.bound){filters.onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;activeCat=b.dataset.cat;renderProjects()};filters.dataset.bound='1'}}const q=norm(document.getElementById('searchInput')?.value||''),l=document.documentElement.lang;const list=source.filter(p=>activeCat==='all'||p.cat.en===activeCat).filter(p=>!q||norm([p.name.en,p.name.ar,p.desc.en,p.desc.ar,p.cat.en,p.cat.ar,...p.tags,...p.keywords,...p.technologies].join(' ')).includes(q));const make=p=>`<article class="project-card" data-project-card="${p.slug}"><a href="${encodeURI(p.path||('project.html?id='+p.slug))}" class="project-cover" target="_blank" rel="noopener"><img src="${p.cover}" alt="${escapeHtml(p.name[l])}" loading="lazy"><span class="project-index">${String(source.indexOf(p)+1).padStart(2,'0')}</span><span class="card-arrow">↗</span><span class="cover-shade"></span></a><div class="project-card-body"><div class="project-card-top"><div><span class="project-cat">${p.cat[l]}</span><h3>${p.name[l]}</h3></div><span class="project-status">${t('liveStatus')}</span></div><p>${p.desc[l]}</p><div class="project-card-bottom"><div class="card-actions"><a class="card-action card-explore" href="${encodeURI(p.path||'#')}" target="_blank" rel="noopener"><span>${t('liveDemo')}</span><b>↗</b></a></div></div></div></article>`;if(grid){grid.innerHTML=list.map(make).join('');const e=document.getElementById('emptyState');if(e)e.hidden=list.length!==0}if(featured)featured.innerHTML=source.slice(0,3).map(make).join('');document.querySelectorAll('#projectCount').forEach(el=>animateNumber(el,source.length));bindDownloadClicks()}
  function animateNumber(el,target){const current=Number(el.dataset.value||0);if(current===target){el.textContent=target;return}el.dataset.value=target;const start=performance.now();function step(now){const p=Math.min(1,(now-start)/700),e=1-Math.pow(1-p,3);el.textContent=Math.round(current+(target-current)*e);if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)}
  window.addEventListener('moaaz:download-count',e=>{const id=e.detail?.projectId,count=e.detail?.count;if(!id||count==null)return;document.querySelectorAll(`[data-download-count="${CSS.escape(id)}"]`).forEach(el=>{el.textContent=String(count);el.classList.remove('count-pop');void el.offsetWidth;el.classList.add('count-pop')});});
  function bindDownloadClicks(){document.querySelectorAll('.js-download').forEach(a=>{if(a.dataset.bound)return;a.dataset.bound='1';a.addEventListener('click',async e=>{const id=a.dataset.projectId;e.preventDefault();if(!id||!window.MOAAZ_AUTH?.configured){window.MOAAZ_AUTH?.showDownloadAuthToast?.();return;}try{const user=window.MOAAZ_AUTH.auth?.currentUser;if(!user){window.MOAAZ_AUTH.showDownloadAuthToast?.();const returnTo=encodeURIComponent(location.href);setTimeout(()=>location.href=`login.html?returnTo=${returnTo}`,250);return;}const count=await window.MOAAZ_AUTH.recordDownload(id);if(count==null)return;const href=a.href;setTimeout(()=>{const x=document.createElement('a');x.href=href;x.download='';document.body.appendChild(x);x.click();x.remove()},0)}catch(err){if(err?.code==='AUTH_REQUIRED'){window.MOAAZ_AUTH.showDownloadAuthToast?.();const returnTo=encodeURIComponent(location.href);setTimeout(()=>location.href=`login.html?returnTo=${returnTo}`,250);}else{console.warn('download failed',err)}}})})}
  function wireLinks(){document.querySelectorAll('#youtubeLink').forEach(a=>{a.href=PORTFOLIO.youtubeUrl});const f=document.getElementById('facebookLink');if(f){f.href=PORTFOLIO.facebookUrl||'#';if(!PORTFOLIO.facebookUrl)f.addEventListener('click',e=>e.preventDefault())}}
  function bindMessageForm(){const form=document.getElementById('messageForm');if(!form||form.dataset.bound)return;form.dataset.bound='1';form.onsubmit=async e=>{e.preventDefault();const ta=form.querySelector('textarea'),status=document.getElementById('messageStatus');const text=String(ta?.value||'').trim();if(!text)return;try{await window.MOAAZ_AUTH.sendMessage(text);ta.value='';if(status)status.textContent=t('sent');if(document.getElementById('accountPage'))renderAccount()}catch(err){if(status)status.textContent=window.MOAAZ_AUTH?.authErrorMessage?window.MOAAZ_AUTH.authErrorMessage(err):(err.code==='AUTH_REQUIRED'?t('loginRequired'):(err.code||err.message))}}}
  let stopAccountLive=null;
  function cleanupAccountLive(){if(typeof stopAccountLive==='function')stopAccountLive();stopAccountLive=null;}
  function renderAccountMessages(messages){
    const box=document.getElementById('messagesList');
    if(!box)return;
    const lang=document.documentElement.lang==='ar'?'ar':'en';
    const sorted=[...messages].sort((a,b)=>{
      const ta=a.createdAt?.toMillis?a.createdAt.toMillis():(a.createdAt?.seconds?Number(a.createdAt.seconds)*1000:0);
      const tb=b.createdAt?.toMillis?b.createdAt.toMillis():(b.createdAt?.seconds?Number(b.createdAt.seconds)*1000:0);
      return ta-tb;
    });
    if(!sorted.length){box.innerHTML=`<div class="empty-state"><h3>${t('messages')}</h3><p>${t('noMessages')}</p></div>`;return;}
    const threads=new Map();
    sorted.forEach(m=>{
      const rootId=m.replyTo||m.threadId||m.id;
      if(!threads.has(rootId))threads.set(rootId,[]);
      threads.get(rootId).push(m);
    });
    box.innerHTML=[...threads.values()].map(thread=>{
      const root=thread.find(m=>!m.replyTo)||thread[0];
      const replies=thread.filter(m=>m.replyTo);
      const timeValue=root.createdAt?.toDate?root.createdAt.toDate():null;
      const date=timeValue?timeValue.toLocaleString(lang==='ar'?'ar-EG':'en-US'):'—';
      return `<article class="message-thread">
        <div class="message-item message-item-user">
          <div class="message-item-head"><small>${t('userMessage')}</small><time>${escapeHtml(date)}</time></div>
          <p>${escapeHtml(root.text||'')}</p>
          <button type="button" class="message-delete message-delete-user" data-delete-message="${escapeHtml(root.id)}">${t('deleteMessage')}</button>
        </div>
        ${replies.map(r=>{
          const rt=r.createdAt?.toDate?r.createdAt.toDate():null;
          const rd=rt?rt.toLocaleString(lang==='ar'?'ar-EG':'en-US'):'—';
          return `<div class="message-item message-item-reply"><div class="message-item-head"><small>${t('replyFromAdmin')}</small><time>${escapeHtml(rd)}</time></div><p>${escapeHtml(r.text||'')}</p><button type="button" class="message-delete-reply" data-delete-reply="${escapeHtml(r.id)}">${t('deleteReply')}</button></div>`;
        }).join('')}
      </article>`;
    }).join('');
    box.querySelectorAll('[data-delete-reply]').forEach(button=>{
      button.onclick=async()=>{
        if(!window.MOAAZ_AUTH?.deleteAdminReply)return;
        if(!window.confirm(t('deleteReplyConfirm')))return;
        button.disabled=true;
        try{
          await window.MOAAZ_AUTH.deleteAdminReply(button.dataset.deleteReply);
          if(document.getElementById('messageStatus'))document.getElementById('messageStatus').textContent=t('replyDeleted');
        }catch(err){
          console.warn('delete admin reply failed',err);
          button.disabled=false;
          const status=document.getElementById('messageStatus');
          if(status)status.textContent=err?.code==='permission-denied'?'Permission denied. Update your Firestore rules to allow users to delete their own admin replies.':(err?.message||err?.code||'Could not delete the reply.');
        }
      };
    });
    box.querySelectorAll('[data-delete-message]').forEach(button=>{
      button.onclick=async()=>{
        if(!window.MOAAZ_AUTH?.deleteUserMessage)return;
        if(!window.confirm(t('deleteMessageConfirm')))return;
        button.disabled=true;
        try{
          await window.MOAAZ_AUTH.deleteUserMessage(button.dataset.deleteMessage);
          if(document.getElementById('messageStatus'))document.getElementById('messageStatus').textContent=t('messageDeleted');
        }catch(err){
          console.warn('delete user message failed',err);
          button.disabled=false;
          const status=document.getElementById('messageStatus');
          if(status)status.textContent=err?.code==='permission-denied'?'Permission denied. Update your Firestore rules to allow you to delete your own messages.':(err?.message||err?.code||'Could not delete the message.');
        }
      };
    });
  }
  function renderAccountNotifications(items){
    const notes=document.getElementById('notificationsList');
    if(!notes)return;
    const sorted=[...items].sort((a,b)=>{
      const ta=a.createdAt?.toMillis?a.createdAt.toMillis():(a.createdAt?.seconds?Number(a.createdAt.seconds)*1000:0);
      const tb=b.createdAt?.toMillis?b.createdAt.toMillis():(b.createdAt?.seconds?Number(b.createdAt.seconds)*1000:0);
      return tb-ta;
    });
    notes.innerHTML=sorted.length?sorted.map(n=>`<article class="notification-item ${n.read?'':'unread'}"><span>${escapeHtml(document.documentElement.lang==='ar'?(n.textAr||n.text||''):(n.textEn||n.text||''))}</span><button data-read-note="${n.id}">${n.read?'':'✓'}</button></article>`).join(''):`<div class="empty-state"><p>${t('notifications')}</p></div>`;
    notes.querySelectorAll('[data-read-note]').forEach(b=>b.onclick=async()=>{try{await window.MOAAZ_AUTH.db.collection('notifications').doc(b.dataset.readNote).update({read:true});}catch(e){console.warn('mark notification read',e)} });
  }
  async function startAccountLive(u){
    cleanupAccountLive();
    const db=window.MOAAZ_AUTH?.db;if(!db||!u)return;
    let stopped=false;
    const unsubs=[];
    const renderSnapshot=snap=>renderAccountMessages(snap.docs.map(d=>({id:d.id,...d.data()})));
    unsubs.push(db.collection('messages').where('userId','==',u.uid).onSnapshot(renderSnapshot,err=>{
      console.warn('account messages load',err);
      const box=document.getElementById('messagesList');
      if(box)box.innerHTML=`<div class="empty-state"><h3>${t('messages')}</h3><p>${document.documentElement.lang==='ar'?'تعذر تحميل الرسائل الآن.':'Messages could not be loaded right now.'}</p></div>`;
    }));
    unsubs.push(db.collection('notifications').where('recipientId','==',u.uid).onSnapshot(snap=>renderAccountNotifications(snap.docs.map(d=>({id:d.id,...d.data()}))),err=>console.warn('account notifications load',err)));
    stopAccountLive=()=>{if(stopped)return;stopped=true;unsubs.forEach(fn=>fn());};
  }
  async function renderAccount(){
    const page=document.getElementById('accountPage');
    if(!window.MOAAZ_AUTH?.db)return;
    await window.MOAAZ_AUTH.ready;
    bindMessageForm();
    if(!page)return;
    const u=window.MOAAZ_AUTH.auth?.currentUser;if(!u)return;
    const name=document.querySelector('[data-user-name]');if(name)name.textContent=u.displayName||u.email||'';
    await startAccountLive(u);
  }
  window.addEventListener('moaaz:account-ready',()=>{if(document.getElementById('accountPage')&&window.MOAAZ_AUTH?.auth?.currentUser)renderAccount();});
  window.addEventListener('moaaz:message-live',()=>{if(document.getElementById('accountPage')&&window.MOAAZ_AUTH?.auth?.currentUser)renderAccount();});
  window.addEventListener('moaaz:language',()=>{if(document.getElementById('accountPage')&&window.MOAAZ_AUTH?.auth?.currentUser)renderAccount();});

  function escapeHtml(v){return String(v||'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
  async function seedProjects(){const db=window.MOAAZ_AUTH?.db;if(!db)return;for(const p of PORTFOLIO.projects){const ref=db.collection('projects').doc(p.slug);const snap=await ref.get();if(!snap.exists)await ref.set({...p,published:true,downloadCount:0,createdAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()})}}
  async function renderAdmin(){
    const page=document.getElementById('adminPage');
    if(!page||!window.MOAAZ_AUTH?.db)return;
    await window.MOAAZ_AUTH.ready;
    if(!(await window.MOAAZ_AUTH.requireAdmin()))return;
    const db=window.MOAAZ_AUTH.db;
    const stats=document.getElementById('adminStats'),list=document.getElementById('adminMessages'),projects=document.getElementById('adminProjects'),status=document.getElementById('adminStatus');
    try{
      const [us,ps,ms]=await Promise.all([db.collection('users').get(),db.collection('projects').get(),db.collection('messages').get()]);
      const all=ms.docs.map(d=>({id:d.id,...d.data()})).filter(m=>!m.replyTo && m.repliedByAdmin!==true);
      const unread=all.filter(m=>m.readByAdmin!==true).length;
      stats.innerHTML=`<div class="admin-stat"><b>${ps.size}</b><span>${t('projectsLabel')}</span></div><div class="admin-stat"><b>${ps.docs.reduce((sum,d)=>sum+Number(d.data().downloadCount||0),0)}</b><span>${t('downloads')}</span></div><div class="admin-stat"><b>${us.size}</b><span>${t('totalUsers')}</span></div><div class="admin-stat"><b>${unread}</b><span>${t('unreadMessages')}</span></div>`;
      list.innerHTML=all.length?all.map(m=>{
        const isUnread=m.readByAdmin!==true;
        return `<article class="admin-message ${isUnread?'is-unread':''}">
          <div class="admin-message-content">
            <div class="admin-message-meta">
              <div class="admin-message-user">
                <span class="admin-message-label">${t('userLabel')}</span>
                <strong>${escapeHtml(m.userName||t('userLabel'))}</strong>
                ${isUnread?`<b class="admin-unread-pill">${t('newLabel')}</b>`:''}
              </div>
              <div class="admin-message-email">
                <span class="admin-message-label">${t('email')}</span>
                <a href="mailto:${escapeHtml(m.userEmail||'')}">${escapeHtml(m.userEmail||'—')}</a>
              </div>
              <time class="admin-message-date">${m.createdAt?.toDate?m.createdAt.toDate().toLocaleString():''}</time>
            </div>
            <div class="admin-message-body">
              <span class="admin-message-label">${t('message')}</span>
              <p>${escapeHtml(m.text||'')}</p>
            </div>
          </div>
          <div class="admin-message-actions">
            <form data-reply-form="${m.id}" data-user="${m.userId}">
              <label class="admin-reply-label" for="reply-${m.id}">${t('reply')}</label>
              <textarea id="reply-${m.id}" required placeholder="${t('reply')}"></textarea>
              <button class="btn btn-solid btn-small" type="submit">${t('reply')} ↗</button>
            </form>
            ${isUnread?`<button type="button" class="btn btn-outline btn-small" data-mark-message-read="${m.id}">${t('markRead')}</button>`:''}
          </div>
        </article>`;
      }).join(''):`<div class="empty-state"><p>${t('noMessages')}</p></div>`;
      list.querySelectorAll('[data-reply-form]').forEach(f=>f.onsubmit=async e=>{
        e.preventDefault();
        const ta=f.querySelector('textarea');
        try{
          await window.MOAAZ_AUTH.replyToMessage(f.dataset.replyForm,f.dataset.user,ta.value);
          ta.value='';
          await renderAdmin();
        }catch(err){
      console.error('Admin reply failed:', err?.operation || 'UNKNOWN_OPERATION', err);
      if(window.MOAAZ_AUTH?.showLiveToast){
        const ar=document.documentElement.lang==='ar';
        window.MOAAZ_AUTH.showLiveToast(ar?'تعذر إرسال الرد. انشر قواعد Firestore الجديدة ثم أعد تسجيل الدخول.':'Reply failed. Publish the new Firestore rules, then sign in again.');
      }
    }
      });
      list.querySelectorAll('[data-mark-message-read]').forEach(b=>b.onclick=async()=>{try{await db.collection('messages').doc(b.dataset.markMessageRead).update({readByAdmin:true});renderAdmin()}catch(e){console.warn('mark message read',e)}});
      const pdata=ps.docs.map(d=>({id:d.id,...normalizeProject(d.data())}));
      projects.innerHTML=pdata.length?pdata.map(p=>`<div class="admin-project-row"><div><strong>${escapeHtml(p.name[document.documentElement.lang])}</strong><small>${p.downloadCount||0} ${t('downloads')}</small></div><button class="publish-toggle" data-toggle-project="${p.id}">${p.published?t('publish'):t('unpublish')}</button></div>`).join(''):`<div class="empty-state"><p>0</p></div>`;
      projects.querySelectorAll('[data-toggle-project]').forEach(b=>b.onclick=async()=>{const ref=db.collection('projects').doc(b.dataset.toggleProject),snap=await ref.get();await ref.update({published:!snap.data().published,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});renderAdmin()});
      status.textContent=t('liveStatus');
    }catch(e){console.warn('admin load',e);status.textContent=t('firebaseError')}
    const seed=document.getElementById('seedProjectsBtn');
    if(seed&&!seed.dataset.bound){seed.dataset.bound='1';seed.onclick=async()=>{await seedProjects();renderAdmin()}}
    const form=document.getElementById('addProjectForm');
    if(form&&!form.dataset.bound){
      form.dataset.bound='1';
      form.onsubmit=async e=>{
        e.preventDefault();
        const fd=new FormData(form), statusEl=document.getElementById('projectFormStatus');
        const slug=String(fd.get('slug')||'').trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'');
        const keywords=String(fd.get('keywords')||'').split(',').map(x=>x.trim()).filter(Boolean);
        const technologies=String(fd.get('technologies')||'').split(',').map(x=>x.trim()).filter(Boolean);
        if(!slug){statusEl.textContent=t('projectAddError');return}
        const payload={slug,path:String(fd.get('path')||'').trim(),name:{en:String(fd.get('nameEn')||'').trim(),ar:String(fd.get('nameAr')||'').trim()},desc:{en:String(fd.get('descEn')||'').trim(),ar:String(fd.get('descAr')||'').trim()},cat:{en:String(fd.get('catEn')||'').trim(),ar:String(fd.get('catAr')||'').trim()},tags:keywords,keywords,technologies,cover:String(fd.get('cover')||'').trim(),download:String(fd.get('download')||'').trim(),published:fd.get('published')==='on',downloadCount:0,createdAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
        try{await db.collection('projects').doc(slug).set(payload);form.reset();form.querySelector('[name="published"]').checked=true;statusEl.textContent=t('projectAdded');await renderAdmin();}catch(err){console.error('add project',err);statusEl.textContent=t('projectAddError')}
      };
    }
  }
  window.addEventListener('moaaz:admin-ready',()=>renderAdmin());
})();
