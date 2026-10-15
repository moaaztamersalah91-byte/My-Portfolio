import {auth,db,onAuthStateChanged,getDoc,doc,setDoc,addDoc,collection,query,orderBy,onSnapshot,serverTimestamp} from './firebase.js';
const $=(s,r=document)=>r.querySelector(s);
const ar=()=>document.documentElement.lang!=='en';
const t=(a,e)=>ar()?a:e;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tm=ts=>{const d=ts?.toDate?ts.toDate():null;return d?d.toLocaleTimeString(ar()?'ar-EG':'en-GB',{hour:'2-digit',minute:'2-digit'}):''};
const dt=ts=>{const d=ts?.toDate?ts.toDate():null;return d?d.toLocaleDateString(ar()?'ar-EG':'en-GB',{day:'numeric',month:'short',year:'numeric'}):'—'};
const ding=n=>{try{window.LAVERA_SOUNDS?.[n]?.()}catch{}};
const introDone=()=>new Promise(r=>{if(!$('.lavera-initial-loader')&&!$('.lavera-intro'))return r();const i=setInterval(()=>{if(!$('.lavera-initial-loader')&&!$('.lavera-intro')){clearInterval(i);r()}},300)});

/* ---------- shared thread renderer ---------- */
function bubbles(box,docs,me){
  const near=box.scrollHeight-box.scrollTop-box.clientHeight<80;
  box.innerHTML=docs.map(m=>`<div class="lv-msg ${m.from===me?'mine':'theirs'}"><p>${esc(m.text)}</p><small>${tm(m.createdAt)}</small></div>`).join('');
  if(near||!box._init){box.scrollTop=box.scrollHeight;box._init=1}
}
async function send(uid,from,text){
  text=text.trim().slice(0,1000);if(!text)return;
  await addDoc(collection(db,'chats',uid,'messages'),{from,text,uid:auth.currentUser.uid,createdAt:serverTimestamp()});
  await setDoc(doc(db,'chats',uid),from==='customer'?{customerUid:uid,lastMessage:text,lastAt:serverTimestamp(),unreadAdmin:true}:{customerUid:uid,lastMessage:text,lastAt:serverTimestamp(),unreadCustomer:true},{merge:true});
}

/* ---------- customer widget ---------- */
let custStarted=false;
async function startCustomer(user){
  if(custStarted)return;custStarted=true;
  // register / sync the account so the dashboard can list it
  try{const ref=doc(db,'customers',user.uid),s=await getDoc(ref);const p={uid:user.uid,email:user.email||''};if(!s.exists()||!s.data().createdAt)p.createdAt=serverTimestamp();if(user.displayName&&!s.data()?.name)p.name=user.displayName;await setDoc(ref,p,{merge:true})}catch(e){console.warn(e)}
  const w=document.createElement('div');w.className='lv-chat';
  w.innerHTML=`<button class="lv-chat-fab" type="button" aria-label="Chat"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h16v11H9l-5 4z"/></svg><i class="lv-dot" hidden></i></button>
  <section class="lv-chat-panel" hidden><header><div><b>LAVÉRA</b><small>${t('فريق الدعم — متصل','Support team — online')}</small></div><button type="button" class="lv-x" aria-label="Close">×</button></header>
  <div class="lv-thread"></div><form><input maxlength="1000" autocomplete="off" placeholder="${t('اكتبي رسالتك…','Write a message…')}"><button class="btn" type="submit">↗</button></form></section>`;
  document.body.appendChild(w);
  const fab=$('.lv-chat-fab',w),panel=$('.lv-chat-panel',w),thread=$('.lv-thread',w),dot=$('.lv-dot',w),input=$('input',w);
  let docs=[],first=true,unread=false;
  const greet=()=>`<div class="lv-msg theirs"><p>${t('أهلًا بكِ في LAVÉRA ✨ اكتبي لنا أي استفسار وفريقنا يرد عليكِ هنا مباشرة.','Welcome to LAVÉRA ✨ Write to us anytime — our team replies right here.')}</p></div>`;
  const draw=()=>{if(!docs.length){thread.innerHTML=greet();return}bubbles(thread,docs,'customer')};
  const open=()=>{panel.hidden=false;fab.classList.add('open');dot.hidden=true;draw();thread.scrollTop=thread.scrollHeight;setDoc(doc(db,'chats',user.uid),{customerUid:user.uid,unreadCustomer:false},{merge:true}).catch(()=>{});setTimeout(()=>input.focus(),50)};
  const close=()=>{panel.hidden=true;fab.classList.remove('open')};
  fab.onclick=()=>panel.hidden?open():close();$('.lv-x',w).onclick=close;
  $('form',w).onsubmit=async e=>{e.preventDefault();const v=input.value;input.value='';try{await send(user.uid,'customer',v)}catch(err){console.error(err);input.value=v}};
  onSnapshot(query(collection(db,'chats',user.uid,'messages'),orderBy('createdAt','asc')),snap=>{
    docs=snap.docs.map(d=>d.data());
    const last=docs[docs.length-1];
    if(!first&&last?.from==='admin'&&snap.docChanges().some(c=>c.type==='added')){ding('notification');if(panel.hidden)dot.hidden=false;else setDoc(doc(db,'chats',user.uid),{unreadCustomer:false},{merge:true}).catch(()=>{})}
    first=false;draw();
  },e=>console.warn(e));
  // open right after sign-in (once per session), after the intro finishes
  let fresh=false;try{fresh=sessionStorage.getItem('laveraChatOpened')!=='1';sessionStorage.setItem('laveraChatOpened','1')}catch{}
  if(fresh)introDone().then(()=>setTimeout(open,600));
}

/* ---------- admin: customers + chats ---------- */
function startAdmin(){
  const cList=$('#customersList'),chList=$('#chatConvList'),thread=$('#chatAdminThread'),form=$('#chatAdminForm'),head=$('#chatAdminHead');
  if(!cList&&!chList)return;
  let customers=[],chats=new Map(),active=null,unsubThread=null,fc=true,fch=true;
  const name=c=>c.name||c.email||c.uid;
  const badge=()=>{const n=[...chats.values()].filter(x=>x.unreadAdmin).length;const b=$('#chatBadge');if(b){b.textContent=n;b.hidden=!n}const cb=$('#customerBadge');if(cb){cb.textContent=customers.length;cb.hidden=!customers.length}const sc=$('#statCustomers');if(sc)sc.textContent=customers.length};
  const drawCustomers=()=>{if(!cList)return;const q=($('#customerSearch')?.value||'').toLowerCase();const rows=customers.filter(c=>!q||(name(c)+(c.email||'')+(c.phone||'')).toLowerCase().includes(q));
    cList.innerHTML=rows.length?`<div class="lv-table">${rows.map(c=>`<article class="lv-row"><div class="lv-ava">${esc(name(c).charAt(0).toUpperCase())}</div><div class="lv-grow"><strong>${esc(c.name||'—')}</strong><small>${esc(c.email||'')}${c.phone?' · '+esc(c.phone):''}</small></div><small>${dt(c.createdAt)}</small><button class="btn btn-outline small-btn" data-chat="${esc(c.uid||c.id)}" type="button">${t('محادثة','Chat')}</button></article>`).join('')}</div>`:`<div class="empty-admin"><h2>${t('لا توجد حسابات','No accounts yet')}</h2></div>`;
    cList.querySelectorAll('[data-chat]').forEach(b=>b.onclick=()=>{$('[data-section="chats"]')?.click();openChat(b.dataset.chat)})};
  const drawConvs=()=>{if(!chList)return;const q=($('#chatSearch')?.value||'').toLowerCase();
    const rows=customers.filter(c=>!q||name(c).toLowerCase().includes(q)).map(c=>({c,ch:chats.get(c.uid||c.id)||{}})).sort((a,b)=>(b.ch.lastAt?.seconds||b.c.createdAt?.seconds||0)-(a.ch.lastAt?.seconds||a.c.createdAt?.seconds||0));
    chList.innerHTML=rows.map(({c,ch})=>`<button type="button" class="lv-conv ${active===(c.uid||c.id)?'active':''} ${ch.unreadAdmin?'unread':''}" data-chat="${esc(c.uid||c.id)}"><div class="lv-ava">${esc(name(c).charAt(0).toUpperCase())}</div><div class="lv-grow"><strong>${esc(name(c))}</strong><small>${esc(ch.lastMessage||t('لا رسائل بعد','No messages yet'))}</small></div>${ch.unreadAdmin?'<i class="lv-dot"></i>':''}</button>`).join('')||`<p class="muted">${t('لا توجد محادثات','No conversations')}</p>`;
    chList.querySelectorAll('[data-chat]').forEach(b=>b.onclick=()=>openChat(b.dataset.chat))};
  function openChat(uid){
    active=uid;const c=customers.find(x=>(x.uid||x.id)===uid)||{uid};
    if(head)head.innerHTML=`<div class="lv-ava">${esc(name(c).charAt(0).toUpperCase())}</div><div><strong>${esc(name(c))}</strong><small>${esc(c.email||'')}</small></div>`;
    form.hidden=false;thread.innerHTML='';thread._init=0;drawConvs();
    unsubThread?.();let first=true;
    unsubThread=onSnapshot(query(collection(db,'chats',uid,'messages'),orderBy('createdAt','asc')),snap=>{
      const docs=snap.docs.map(d=>d.data());bubbles(thread,docs,'admin');
      if(!docs.length)thread.innerHTML=`<p class="muted lv-empty">${t('ابدئي المحادثة مع العميلة.','Start the conversation.')}</p>`;
      setDoc(doc(db,'chats',uid),{customerUid:uid,unreadAdmin:false},{merge:true}).catch(()=>{});first=false;
    },e=>console.error(e));
  }
  form.onsubmit=async e=>{e.preventDefault();if(!active)return;const i=$('input',form),v=i.value;i.value='';try{await send(active,'admin',v)}catch(err){console.error(err);i.value=v}};
  $('#customerSearch')?.addEventListener('input',drawCustomers);$('#chatSearch')?.addEventListener('input',drawConvs);
  onSnapshot(collection(db,'customers'),snap=>{
    const fresh=snap.docChanges().filter(c=>c.type==='added');
    customers=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    if(!fc&&fresh.length){ding('adminBell');window.showToast?.(`حساب جديد: ${fresh[0].doc.data().name||fresh[0].doc.data().email||''}`,'New account registered')}
    fc=false;drawCustomers();drawConvs();badge();
  },e=>console.error('customers',e));
  onSnapshot(collection(db,'chats'),snap=>{
    if(!fch&&snap.docChanges().some(c=>c.doc.data().unreadAdmin&&c.type!=='removed'&&c.doc.id!==active))ding('adminBell');
    fch=false;chats=new Map(snap.docs.map(d=>[d.id,d.data()]));drawConvs();badge();
  },e=>console.error('chats',e));
}

/* ---------- boot ---------- */
onAuthStateChanged(auth,async user=>{
  if(!user)return;
  const isDash=!!$('.dashboard-shell');
  let admin=false;try{admin=(await getDoc(doc(db,'admins',user.uid))).exists()}catch{}
  if(isDash){if(admin)startAdmin();return}
  if(admin||$('.admin-auth-page')||location.pathname.includes('admin'))return;
  startCustomer(user);
});
