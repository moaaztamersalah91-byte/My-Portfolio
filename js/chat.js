/* Live chat between signed-in users and the admin. Reuses the existing `messages` collection
   (user message = no adminId, admin reply = has adminId + replyTo), so no new Firestore rules are needed. */
(() => {
  const A = () => window.MOAAZ_AUTH;
  const isAr = () => document.documentElement.lang === 'ar';
  const T = {
    en:{title:'Chat with Moaaz',sub:'Usually replies here',ph:'Write a message…',send:'Send',empty:'Say hi 👋 — your message goes straight to the admin.',you:'You',chats:'No conversations yet.',pick:'Select a conversation',reply:'Reply',users:'Users',err:'Could not send. Try again.'},
    ar:{title:'الشات مع معاذ',sub:'الرد بيوصلك هنا',ph:'اكتب رسالتك…',send:'إرسال',empty:'ابعت أول رسالة 👋 — هتوصل للأدمن على طول.',you:'أنت',chats:'لا توجد محادثات بعد.',pick:'اختر محادثة',reply:'رد',users:'المستخدمون',err:'تعذر الإرسال. حاول مرة أخرى.'}
  };
  const t = k => (T[isAr() ? 'ar' : 'en'])[k];
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  const ms = m => m.createdAt?.toMillis ? m.createdAt.toMillis() : (m.createdAt?.seconds ? m.createdAt.seconds * 1000 : Date.now());
  const fmt = m => new Date(ms(m)).toLocaleTimeString(isAr() ? 'ar-EG' : 'en-US', {hour:'2-digit', minute:'2-digit'});
  const bubble = (m, mine) => `<div class="mz-bubble ${mine ? 'me' : 'them'}">${esc(m.text)}<time>${fmt(m)}</time></div>`;
  const bottom = el => { el.scrollTop = el.scrollHeight; };

  /* ---------- user widget ---------- */
  let widget = null, stopWidget = null;
  function buildWidget(user) {
    if (widget) return;
    const w = document.createElement('div');
    w.className = 'mz-chat';
    w.innerHTML = `<button type="button" class="mz-chat-fab" aria-label="Chat"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/></svg><b class="mz-chat-badge" hidden>0</b></button>
      <section class="mz-chat-box" aria-label="Chat"><div class="mz-chat-head"><span class="mz-chat-avatar">M</span><div><strong data-t="title"></strong><small data-t="sub"></small></div><button type="button" class="mz-chat-close" aria-label="Close">×</button></div>
      <div class="mz-chat-list"></div>
      <form class="mz-chat-form"><textarea rows="1" required></textarea><button type="submit" data-t="send"></button></form></section>`;
    document.body.appendChild(w);
    widget = w;
    const box = w.querySelector('.mz-chat-box'), list = w.querySelector('.mz-chat-list'), badge = w.querySelector('.mz-chat-badge'),
          form = w.querySelector('form'), ta = form.querySelector('textarea'), btn = form.querySelector('button');
    const seenKey = `moaaz_chat_seen_${user.uid}`;
    let msgs = [];
    const lang = () => { w.querySelectorAll('[data-t]').forEach(e => e.textContent = t(e.dataset.t)); ta.placeholder = t('ph'); w.dir = isAr() ? 'rtl' : 'ltr'; };
    const seen = () => Number(localStorage.getItem(seenKey) || 0);
    const render = () => {
      const sorted = [...msgs].sort((a, b) => ms(a) - ms(b));
      list.innerHTML = sorted.length ? sorted.map(m => bubble(m, !m.adminId)).join('') : `<div class="mz-chat-empty">${t('empty')}</div>`;
      bottom(list);
      const open = box.classList.contains('open');
      if (open) { try { localStorage.setItem(seenKey, String(Date.now())); } catch (_) {} }
      const unread = open ? 0 : sorted.filter(m => m.adminId && ms(m) > seen()).length;
      badge.textContent = unread > 9 ? '9+' : unread; badge.hidden = !unread;
    };
    const toggle = open => {
      box.classList.toggle('open', open); window.__moaazChatOpen = open;
      if (open) { render(); setTimeout(() => ta.focus(), 220); }
    };
    w.querySelector('.mz-chat-fab').onclick = () => toggle(!box.classList.contains('open'));
    w.querySelector('.mz-chat-close').onclick = () => toggle(false);
    window.addEventListener('moaaz:open-chat', () => toggle(true));
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
    form.onsubmit = async e => {
      e.preventDefault();
      const text = ta.value.trim(); if (!text) return;
      btn.disabled = true;
      try { await A().sendMessage(text); ta.value = ''; } catch (err) { console.warn('chat send', err); alert(t('err')); }
      btn.disabled = false; ta.focus();
    };
    new MutationObserver(() => { lang(); render(); }).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
    lang();
    stopWidget = A().db.collection('messages').where('userId', '==', user.uid).onSnapshot(snap => { msgs = snap.docs.map(d => ({id: d.id, ...d.data()})); render(); }, err => console.warn('chat listen', err));
  }
  function destroyWidget() { if (stopWidget) stopWidget(); stopWidget = null; widget?.remove(); widget = null; window.__moaazChatOpen = false; }

  /* ---------- admin inbox + live users count ---------- */
  let adminStarted = false;
  function startAdmin() {
    const root = document.getElementById('adminChats');
    if (!root || adminStarted) return; adminStarted = true;
    const db = A().db;
    root.className = 'mz-admin-chat';
    root.innerHTML = `<div class="mz-ac-users"></div><div class="mz-ac-main"><div class="mz-ac-title"></div><div class="mz-ac-thread"></div><form class="mz-chat-form" hidden><textarea rows="1" required></textarea><button type="submit"></button></form></div>`;
    const usersEl = root.querySelector('.mz-ac-users'), title = root.querySelector('.mz-ac-title'), thread = root.querySelector('.mz-ac-thread'),
          form = root.querySelector('form'), ta = form.querySelector('textarea'), btn = form.querySelector('button');
    let all = [], active = null; const marked = new Set();
    const group = () => {
      const g = new Map();
      all.forEach(m => { if (!m.userId) return; if (!g.has(m.userId)) g.set(m.userId, []); g.get(m.userId).push(m); });
      g.forEach(a => a.sort((x, y) => ms(x) - ms(y)));
      return g;
    };
    const render = () => {
      const g = group();
      const rows = [...g.entries()].map(([uid, a]) => {
        const last = a[a.length - 1], u = [...a].reverse().find(m => !m.adminId);
        return {uid, a, last, name: u?.userName || u?.userEmail || uid, unread: a.filter(m => !m.adminId && !m.replyTo && m.readByAdmin !== true).length};
      }).sort((x, y) => ms(y.last) - ms(x.last));
      usersEl.innerHTML = rows.length ? rows.map(r => `<button type="button" class="mz-ac-user ${r.uid === active ? 'active' : ''}" data-uid="${esc(r.uid)}"><b><span>${esc(r.name)}</span>${r.unread ? `<i>${r.unread}</i>` : ''}</b><small>${esc((r.last.adminId ? t('you') + ': ' : '') + r.last.text)}</small></button>`).join('') : `<div class="mz-chat-empty">${t('chats')}</div>`;
      const cur = rows.find(r => r.uid === active);
      form.hidden = !cur; ta.placeholder = t('reply'); btn.textContent = t('send');
      if (!cur) { title.textContent = t('pick'); thread.innerHTML = ''; return; }
      title.innerHTML = `${esc(cur.name)}<small>${esc(cur.a.find(m => m.userEmail)?.userEmail || '')}</small>`;
      thread.innerHTML = cur.a.map(m => bubble(m, !!m.adminId)).join(''); bottom(thread);
      cur.a.filter(m => !m.adminId && m.readByAdmin !== true && !marked.has(m.id)).forEach(m => { marked.add(m.id); db.collection('messages').doc(m.id).update({readByAdmin: true}).catch(() => {}); });
    };
    usersEl.onclick = e => { const b = e.target.closest('[data-uid]'); if (!b) return; active = b.dataset.uid; render(); ta.focus(); };
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
    form.onsubmit = async e => {
      e.preventDefault();
      const text = ta.value.trim(); const a = group().get(active); if (!text || !a) return;
      const rootMsg = [...a].reverse().find(m => !m.adminId && !m.replyTo) || a[a.length - 1];
      btn.disabled = true;
      try { await A().adminChatReply(active, rootMsg.id, text); ta.value = ''; } catch (err) { console.warn('admin chat reply', err); alert(t('err')); }
      btn.disabled = false; ta.focus();
    };
    db.collection('messages').onSnapshot(snap => { all = snap.docs.map(d => ({id: d.id, ...d.data()})); render(); }, err => console.warn('admin chats', err));
    new MutationObserver(render).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
    render();
    // live registered-users counter
    db.collection('users').onSnapshot(s => document.querySelectorAll('[data-total-users]').forEach(el => el.textContent = s.size), () => {});
  }

  /* ---------- boot ---------- */
  async function boot() {
    const auth = A(); if (!auth || !auth.configured) return;
    await auth.ready; if (!auth.auth) return;
    const page = document.body.dataset.page || '';
    const skip = ['admin', 'admin-login', 'login'].includes(page) || document.body.dataset.protected === 'admin' || /(login|admin-login)\.html$/.test(location.pathname);
    auth.auth.onAuthStateChanged(async user => {
      destroyWidget();
      if (!user) return;
      if (document.getElementById('adminChats')) { if (await auth.isAdmin(user)) startAdmin(); return; }
      if (skip) return;
      if (await auth.isAdmin(user)) return;
      buildWidget(user);
    });
  }
  window.addEventListener('moaaz:admin-ready', () => { if (A()?.auth?.currentUser) A().isAdmin(A().auth.currentUser).then(ok => ok && startAdmin()); });
  document.addEventListener('DOMContentLoaded', boot);
})();
