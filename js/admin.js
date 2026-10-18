/* Admin dashboard: tabs, live stats, simple "add project" form with auto-translation. */
(() => {
  const D = {
    en:{kicker:'Admin',title:'Dashboard',users:'Registered users',projects:'Projects',unread:'Unread messages',tabMessages:'Messages',tabProjects:'Projects',tabAdd:'+ Add project',
      import:'Import my 15 default projects',fName:'Project name (Arabic or English)',fLink:'GitHub link',fCover:'Cover image',coverHint:'Click to choose an image',fKeys:'Keywords',fTech:'Technologies',keysPh:'store, fashion, ecommerce',techPh:'HTML, CSS, JavaScript',fDesc:'Description (Arabic or English)',
      autoNote:'Write in any language — the site translates the name and description to the other language automatically.',addBtn:'Add project ↗',saving:'Translating & saving…',saved:'Project added ✓',fail:'Could not save. Check your connection/rules.',noTr:'Saved (translation unavailable, same text used for both languages).',
      ghOnly:'Please enter a GitHub link (github.com or github.io).',imgBig:'Image is too large, choose a smaller one.',noProj:'No projects yet.',show:'Published',hide:'Hidden',del:'Delete',delQ:'Delete this project?',imported:'Imported.',importing:'Importing…'},
    ar:{kicker:'الأدمن',title:'لوحة التحكم',users:'المستخدمون المسجلون',projects:'المشاريع',unread:'رسائل غير مقروءة',tabMessages:'الرسائل',tabProjects:'المشاريع',tabAdd:'+ إضافة مشروع',
      import:'استيراد مشاريعي الـ15 الأساسية',fName:'اسم المشروع (عربي أو إنجليزي)',fLink:'لينك GitHub',fCover:'صورة المشروع (Cover)',coverHint:'اضغط لاختيار صورة',fKeys:'كلمات مفتاحية',fTech:'التقنيات',keysPh:'متجر، موضة، ecommerce',techPh:'HTML, CSS, JavaScript',fDesc:'وصف المشروع (عربي أو إنجليزي)',
      autoNote:'اكتب بأي لغة — الموقع بيترجم الاسم والوصف للغة التانية تلقائيًا.',addBtn:'إضافة المشروع ↗',saving:'جاري الترجمة والحفظ…',saved:'تمت إضافة المشروع ✓',fail:'تعذر الحفظ. راجع الاتصال أو القواعد.',noTr:'تم الحفظ (الترجمة غير متاحة، استُخدم نفس النص للغتين).',
      ghOnly:'ادخل لينك GitHub صحيح (github.com أو github.io).',imgBig:'الصورة كبيرة جدًا، اختر صورة أصغر.',noProj:'لا توجد مشاريع بعد.',show:'منشور',hide:'مخفي',del:'حذف',delQ:'حذف المشروع ده؟',imported:'تم الاستيراد.',importing:'جاري الاستيراد…'}
  };
  const L = () => document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const t = k => D[L()][k];
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  const $ = s => document.querySelector(s);
  let started = false, db = null, projects = [];

  function texts() {
    document.querySelectorAll('[data-a]').forEach(e => e.textContent = t(e.dataset.a));
    document.querySelectorAll('[data-ph]').forEach(e => e.placeholder = t(e.dataset.ph));
  }
  function tab(name) {
    document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    document.querySelectorAll('[data-panel]').forEach(p => p.hidden = p.dataset.panel !== name);
  }
  const isAr = s => /[؀-ۿ]/.test(s);
  async function tr(text, from, to) {
    const parts = text.match(/[^.!?؟\n]+[.!?؟\n]*/g) || [text], chunks = [];
    let cur = '';
    parts.forEach(p => { if ((cur + p).length > 450) { if (cur) chunks.push(cur); cur = p; } else cur += p; });
    if (cur) chunks.push(cur);
    const out = [];
    for (const c of chunks) {
      const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(c.trim())}&langpair=${from}|${to}`);
      const j = await r.json();
      const txt = j?.responseData?.translatedText;
      if (!txt || j.responseStatus != 200) throw new Error('TR_FAIL');
      out.push(txt);
    }
    return out.join(' ');
  }
  async function bilingual(text) {
    const src = isAr(text) ? 'ar' : 'en', dst = src === 'ar' ? 'en' : 'ar';
    try { const o = await tr(text, src, dst); return {v: {[src]: text, [dst]: o}, ok: true}; }
    catch (_) { return {v: {en: text, ar: text}, ok: false}; }
  }
  function shrink(file, max = 1200) {
    // Any size in; always compressed to fit Firestore's 1 MiB document limit (target <= ~800 KB).
    return new Promise((res, rej) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let w = Math.min(max, img.width), q = .85, d;
        for (let i = 0; i < 12; i++) {
          const c = document.createElement('canvas');
          c.width = Math.round(w); c.height = Math.round(img.height * w / img.width);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          d = c.toDataURL('image/jpeg', q);
          if (d.length <= 800000) return res(d);
          if (q > .5) q -= .1; else w *= .8;
        }
        rej(new Error('BIG'));
      };
      img.onerror = rej; img.src = url;
    });
  }
  const slugOf = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const list = s => String(s || '').split(/[,،]/).map(x => x.trim()).filter(Boolean);

  function renderProjects() {
    const box = $('#projList'), l = L();
    $('#statProjects').textContent = projects.length;
    box.innerHTML = projects.length ? projects.map(p => {
      const name = (p.name && (p.name[l] || p.name.en)) || p.slug;
      return `<div class="proj-row"><img src="${esc(p.cover)}" alt=""><div class="proj-info"><strong>${esc(name)}</strong><a href="${esc(p.path)}" target="_blank" rel="noopener">${esc(p.path)}</a></div><button class="proj-btn ${p.published ? 'on' : ''}" data-toggle="${esc(p.id)}">${p.published ? t('show') : t('hide')}</button><button class="proj-btn del" data-del="${esc(p.id)}">${t('del')}</button></div>`;
    }).join('') : `<p class="dash-note">${t('noProj')}</p>`;
  }

  async function start() {
    if (started) return; started = true;
    const A = window.MOAAZ_AUTH; db = A.db;
    texts(); renderProjects();
    document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => tab(b.dataset.tab));
    window.addEventListener('moaaz:language', () => { texts(); renderProjects(); });
    db.collection('projects').onSnapshot(s => { projects = s.docs.map(d => ({id: d.id, ...d.data()})); renderProjects(); }, e => console.warn('projects', e));
    db.collection('users').onSnapshot(s => document.querySelectorAll('[data-total-users]').forEach(e => e.textContent = s.size), () => {});
    db.collection('messages').onSnapshot(s => {
      const n = s.docs.filter(d => { const m = d.data(); return !m.adminId && !m.replyTo && m.readByAdmin !== true; }).length;
      $('#statUnread').textContent = n; const b = $('#tabUnread'); b.textContent = n; b.hidden = !n;
    }, () => {});
    $('#projList').onclick = async e => {
      const tg = e.target.closest('[data-toggle]'), dl = e.target.closest('[data-del]');
      if (tg) { const p = projects.find(x => x.id === tg.dataset.toggle); await db.collection('projects').doc(p.id).update({published: !p.published, updatedAt: firebase.firestore.FieldValue.serverTimestamp()}); }
      if (dl && confirm(t('delQ'))) await db.collection('projects').doc(dl.dataset.del).delete();
    };
    $('#importBtn').onclick = async () => {
      const st = $('#importStatus'); st.textContent = t('importing');
      for (const p of (window.PORTFOLIO?.projects || [])) {
        const r = db.collection('projects').doc(p.slug), snap = await r.get();
        if (!snap.exists) await r.set({...p, keywords: p.tags || [], technologies: ['HTML', 'CSS', 'JavaScript'], published: true, createdAt: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: firebase.firestore.FieldValue.serverTimestamp()});
      }
      st.textContent = t('imported');
    };
    const form = $('#addForm'), prev = $('#coverPreview'), st = $('#addStatus');
    const say = (m, c) => { st.textContent = m; st.className = 'dash-note ' + (c || ''); };
    form.cover.onchange = () => { const f = form.cover.files[0]; if (f) prev.innerHTML = `<img src="${URL.createObjectURL(f)}" alt="">`; };
    form.onsubmit = async e => {
      e.preventDefault();
      const link = form.link.value.trim();
      if (!/^https?:\/\/([a-z0-9-]+\.)?github\.(com|io)\//i.test(link)) { say(t('ghOnly'), 'err'); return; }
      const btn = $('#addBtn'); btn.disabled = true; say(t('saving'));
      try {
        const cover = await shrink(form.cover.files[0]);
        const [n, d] = await Promise.all([bilingual(form.name.value.trim()), bilingual(form.desc.value.trim())]);
        const keywords = list(form.keywords.value), technologies = list(form.tech.value);
        const slug = slugOf(n.v.en) || 'project-' + Date.now();
        const now = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('projects').doc(slug).set({slug, path: link, name: n.v, desc: d.v, cat: {en: 'Web Project', ar: 'مشروع ويب'}, tags: keywords, keywords, technologies, cover, published: true, createdAt: now, updatedAt: now});
        form.reset(); prev.innerHTML = `<em>${t('coverHint')}</em>`;
        say(n.ok && d.ok ? t('saved') : t('noTr'), 'ok'); tab('projects');
      } catch (err) { console.error(err); say(err.message === 'BIG' ? t('imgBig') : t('fail'), 'err'); }
      btn.disabled = false;
    };
  }
  async function boot() {
    const A = window.MOAAZ_AUTH; if (!A) return;
    texts();
    await A.ready; if (await A.requireAdmin()) start();
  }
  window.addEventListener('moaaz:admin-ready', () => window.MOAAZ_AUTH.ready.then(start));
  document.addEventListener('DOMContentLoaded', boot);
})();
