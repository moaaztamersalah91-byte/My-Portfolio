(() => {
  const configured = !!(window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey && !String(window.FIREBASE_CONFIG.apiKey).startsWith('YOUR_'));
  const labels = {
    en: {login:'Sign in',account:'Account',logout:'Sign out',messages:'Messages',notifications:'Notifications',admin:'Dashboard',loginRequired:'Please sign in to continue.',firebaseMissing:'Firebase is not configured yet.',email:'Email',password:'Password',google:'Continue with Google',emailLogin:'Continue with email',register:'Create account',name:'Name',send:'Send',message:'Message',reply:'Reply',close:'Close',markRead:'Mark read',noMessages:'No messages yet.',replyFromAdmin:'Admin reply',userMessage:'Your message',sent:'Sent',bell:'Notifications',invalid:'Please check your details.',adminLogin:'Admin sign in',adminOnly:'This area is restricted to the authorized administrator.',accessDenied:'This account is not authorized for the dashboard.',access:'Access',adminPanel:'ADMIN PANEL',newIdentity:'New identity',or:'OR',createOne:'Create one',backLogin:'Back to sign in',signInHint:'Sign in to keep your messages, admin replies and notifications in one place.',registerHint:'Create an account so your messages and admin replies stay with you.',requiredField:'This field is required.',authError:'Something went wrong. Please try again.',invalidCredentials:'The email or password is incorrect.',emailInUse:'This email is already in use.',weakPassword:'Password must be at least 6 characters.',popupClosed:'The sign-in window was closed.',networkError:'A network error occurred. Please try again.',downloadLoginRequired:'Please sign in to download this project.',downloads:'Downloads'},
    ar: {login:'تسجيل الدخول',account:'حسابي',logout:'تسجيل الخروج',messages:'الرسائل',notifications:'الإشعارات',admin:'لوحة الإدارة',loginRequired:'سجّل دخولك للمتابعة.',firebaseMissing:'فايربيس غير مُعد بعد.',email:'البريد الإلكتروني',password:'كلمة المرور',google:'المتابعة باستخدام جوجل',emailLogin:'المتابعة بالبريد الإلكتروني',register:'إنشاء حساب',name:'الاسم',send:'إرسال',message:'الرسالة',reply:'رد',close:'إغلاق',markRead:'تحديد كمقروء',noMessages:'لا توجد رسائل بعد.',replyFromAdmin:'رد الإدارة',userMessage:'رسالتك',sent:'تم الإرسال',bell:'الإشعارات',invalid:'راجع بياناتك.',adminLogin:'دخول الإدارة',adminOnly:'هذه المنطقة مخصصة لحساب الإدارة المصرح له فقط.',accessDenied:'هذا الحساب غير مصرح له بدخول لوحة الإدارة.',access:'دخول',adminPanel:'لوحة الإدارة',newIdentity:'حساب جديد',or:'أو',createOne:'أنشئ حسابك',backLogin:'العودة لتسجيل الدخول',signInHint:'سجّل دخولك علشان تتابع رسائلك وردود الإدارة وإشعاراتك في مكان واحد.',registerHint:'أنشئ حسابك علشان رسائلك وردود الإدارة تفضل محفوظة عندك.',requiredField:'الحقل ده مطلوب.',authError:'حصل خطأ. جرّب مرة تانية.',invalidCredentials:'البريد الإلكتروني أو كلمة المرور غير صحيحة.',emailInUse:'البريد الإلكتروني ده مستخدم بالفعل.',weakPassword:'كلمة المرور لازم تكون 6 أحرف على الأقل.',popupClosed:'تم إغلاق نافذة تسجيل الدخول.',networkError:'حصلت مشكلة في الاتصال. جرّب مرة تانية.',downloadLoginRequired:'سجّل دخولك لتحميل المشروع.',downloads:'التحميلات'}
  };
  const t = k => (labels[document.documentElement.lang] || labels.en)[k] || k;
  let db = null, auth = null, provider = null;
  let ready = Promise.resolve();
  let stopLiveUser = null;
  let stopLiveAdmin = null;
  let liveUserUid = null;
  let liveAdminUid = null;
  const load = src => new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});

  if(configured){
    ready = load('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
      .then(()=>load('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js'))
      .then(()=>load('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js'))
      .then(()=>{
        if(!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
        auth=firebase.auth(); db=firebase.firestore(); provider=new firebase.auth.GoogleAuthProvider();
        auth.onAuthStateChanged(async user=>{
          stopLiveListeners();
          window.MOAAZ_USER=user||null;
          if(user) await ensureUser(user);
          refreshUserUI(user);
          handleProtectedPages(user);
          if(user){
            startUserLive(user);
            if(await isAdmin(user)) startAdminLive(user);
            if(document.getElementById('accountPage')) window.dispatchEvent(new Event('moaaz:account-ready'));
          } else {
            updateUnread(null);
          }
        });
      }).catch(err=>{console.error('Firebase init failed',err); window.MOAAZ_USER=null;});
  } else window.MOAAZ_USER=null;

  function icon(type){
    const icons={user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-4 3-6 7-6s6.2 2 7 6"/></svg>',bell:'<svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/></svg>'}; return icons[type]||'';
  }
  async function ensureUser(user){
    if(!db) return;
    try {
      const ref=db.collection('users').doc(user.uid);
      const snap=await ref.get();
      const profile={uid:user.uid,name:user.displayName||'',email:user.email||'',photoURL:user.photoURL||'',provider:(user.providerData[0]?.providerId||'password'),lastLoginAt:firebase.firestore.FieldValue.serverTimestamp()};
      if(snap.exists) await ref.update(profile);
      else await ref.set({...profile,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    } catch(e){ console.warn('user profile sync',e); }
  }
  async function isAdmin(user){
    if(!db || !user) return false;
    try { const snap=await db.collection('admins').doc(user.uid).get(); return snap.exists && snap.data().role==='admin'; } catch(e){ return false; }
  }
  async function requireAdmin(){
    await ready;
    const user=auth?.currentUser;
    if(!user) return false;
    return isAdmin(user);
  }
  function ensureLiveToast(){
    let toast=document.getElementById('moaaz-live-toast');
    if(toast)return toast;
    toast=document.createElement('button');
    toast.type='button';
    toast.id='moaaz-live-toast';
    toast.className='moaaz-live-toast';
    toast.setAttribute('aria-live','polite');
    toast.innerHTML='<span class="moaaz-toast-icon" aria-hidden="true">✓</span><span class="moaaz-toast-copy"><b></b><small></small></span><i class="moaaz-toast-progress" aria-hidden="true"></i>';
    document.body.appendChild(toast);
    return toast;
  }
  function showLiveToast(kind, data){
    const toast=ensureLiveToast();
    const ar=document.documentElement.lang==='ar';
    const isAdminToast=kind==='admin-message';
    const title=isAdminToast?(ar?'رسالة جديدة':'New message'):(ar?'رد جديد من الإدارة':'New reply from admin');
    const name=data?.userName||data?.adminName||'';
    const body=isAdminToast
      ? `${name?name+' — ':''}${String(data?.text||'').trim()}`
      : `${name?name+' — ':''}${String(data?.text||'').trim()}`;
    toast.querySelector('.moaaz-toast-icon').textContent=isAdminToast?'✉':'↩';
    toast.querySelector('.moaaz-toast-copy b').textContent=title;
    toast.querySelector('.moaaz-toast-copy small').textContent=body;
    toast.classList.toggle('is-ar',ar);
    toast.dataset.target=isAdminToast?'admin.html':'account.html#notifications';
    toast.classList.remove('show','restart');
    void toast.offsetWidth;
    toast.classList.add('show','restart');
    clearTimeout(window.__moaazLiveToastTimer);
    window.__moaazLiveToastTimer=setTimeout(()=>toast.classList.remove('show'),6500);
    toast.onclick=()=>{ const target=toast.dataset.target; toast.classList.remove('show'); if(target) location.href=target; };
  }
  function refreshUserUI(user){
    document.querySelectorAll('[data-auth-slot]').forEach(slot=>{
      slot.innerHTML = user ? `<a class="auth-user-link" href="account.html" title="${t('account')}">${user.photoURL?`<img src="${user.photoURL}" alt="">`:icon('user')}<span>${escapeHtml((user.displayName||user.email||'').split(' ')[0])}</span></a><a class="notif-link" href="account.html#notifications" title="${t('bell')}">${icon('bell')}<b data-unread-count>0</b></a>` : `<a class="auth-login-link" href="login.html">${icon('user')}<span>${t('login')}</span></a>`;
    });
    if(user && document.body){
      document.querySelectorAll('.desktop-nav a[href="admin.html"]').forEach(a=>{ if(!a.querySelector('[data-admin-unread-count]')){const b=document.createElement('b');b.className='live-nav-badge';b.dataset.adminUnreadCount='';b.hidden=true;b.textContent='0';a.appendChild(b);} });
    }
  }
  function escapeHtml(v){return String(v||'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
  function setUnreadBadges(count, selector='[data-unread-count]'){
    document.querySelectorAll(selector).forEach(x=>{x.textContent=count>99?'99+':String(count);x.hidden=count===0});
  }
  async function updateUnread(user){
    if(!db || !user){setUnreadBadges(0);setUnreadBadges(0,'[data-admin-unread-count]');return;}
    try{ const snap=await db.collection('notifications').where('recipientId','==',user.uid).where('read','==',false).get(); setUnreadBadges(snap.size); }catch(e){setUnreadBadges(0)}
  }
  function updateAdminUnread(count){setUnreadBadges(count,'[data-admin-unread-count]');document.querySelectorAll('[data-admin-unread-stat]').forEach(x=>x.textContent=count);}
  function stopLiveListeners(){
    if(typeof stopLiveUser==='function')stopLiveUser();
    if(typeof stopLiveAdmin==='function')stopLiveAdmin();
    stopLiveUser=null;stopLiveAdmin=null;liveUserUid=null;liveAdminUid=null;
  }
  function startUserLive(user){
    if(!db||!user||liveUserUid===user.uid)return;
    liveUserUid=user.uid;
    const seenKey=`moaaz_seen_replies_${user.uid}`;
    let seen=new Set();
    try{seen=new Set(JSON.parse(sessionStorage.getItem(seenKey)||'[]'));}catch(_){ }
    const unsubs=[];
    let firstMessageSnapshot=true;
    unsubs.push(db.collection('messages').where('userId','==',user.uid).onSnapshot(snap=>{
      snap.docChanges().forEach(change=>{
        if(change.type!=='added')return;
        const d=change.doc.data();
        if(!d.adminId || seen.has(change.doc.id))return;
        seen.add(change.doc.id); try{sessionStorage.setItem(seenKey,JSON.stringify([...seen].slice(-100)));}catch(_){ }
        if(firstMessageSnapshot)return;
        showLiveToast('user-reply',d);
        window.dispatchEvent(new CustomEvent('moaaz:message-live',{detail:{type:'reply',message:d}}));
      });
      firstMessageSnapshot=false;
    },err=>console.warn('user live messages',err)));
    unsubs.push(db.collection('notifications').where('recipientId','==',user.uid).where('read','==',false).onSnapshot(snap=>{
      setUnreadBadges(snap.size);
      const added=snap.docChanges().filter(c=>c.type==='added');
    },err=>console.warn('user live notifications',err)));
    stopLiveUser=()=>unsubs.forEach(fn=>fn());
  }
  async function startAdminLive(user){
    if(!db||!user||liveAdminUid===user.uid)return;
    liveAdminUid=user.uid;
    let first=true;
    const snapHandler=snap=>{
      const root=snap.docs.filter(d=>!d.data().replyTo);
      const unread=root.filter(d=>d.data().readByAdmin!==true).length;
      updateAdminUnread(unread);
      if(first){first=false;return;}
      snap.docChanges().forEach(change=>{
        if(change.type!=='added')return;
        const d=change.doc.data();
        if(d.replyTo)return;
        showLiveToast('admin-message',d);
        window.dispatchEvent(new CustomEvent('moaaz:admin-message-live',{detail:{message:d}}));
      });
    };
    stopLiveAdmin=db.collection('messages').onSnapshot(snapHandler,err=>console.warn('admin live messages',err));
  }
  async function signInGoogle(){await ready;if(!auth)throw new Error('FIREBASE_NOT_READY');return auth.signInWithPopup(provider)}
  async function signInEmail(email,password){await ready;if(!auth)throw new Error('FIREBASE_NOT_READY');return auth.signInWithEmailAndPassword(email,password)}
  async function registerEmail(email,password,name){await ready;if(!auth)throw new Error('FIREBASE_NOT_READY');const c=await auth.createUserWithEmailAndPassword(email,password);await c.user.updateProfile({displayName:name});await ensureUser(c.user);return c}
  async function logout(){await ready;if(auth)return auth.signOut()}
  async function sendMessage(text){
    await ready;if(!db||!auth?.currentUser)throw new Error('AUTH_REQUIRED');const u=auth.currentUser;
    const ref=await db.collection('messages').add({userId:u.uid,userName:u.displayName||u.email,userEmail:u.email||'',text:String(text).trim(),createdAt:firebase.firestore.FieldValue.serverTimestamp(),readByAdmin:false});
    return ref;
  }
  async function deleteAdminReply(messageId){
    await ready;
    if(!db||!auth?.currentUser) throw new Error('AUTH_REQUIRED');
    const uid=auth.currentUser.uid;
    const ref=db.collection('messages').doc(String(messageId));
    const snap=await ref.get();
    if(!snap.exists) throw new Error('MESSAGE_NOT_FOUND');
    const data=snap.data()||{};
    if(data.userId!==uid || !data.replyTo || !data.adminId) throw new Error('DELETE_NOT_ALLOWED');
    const batch=db.batch();
    batch.delete(ref);
    const notes=await db.collection('notifications').where('recipientId','==',uid).where('messageId','==',String(messageId)).get();
    notes.forEach(doc=>batch.delete(doc.ref));
    try{ await batch.commit(); }
    catch(err){
      err.operation='DELETE_ADMIN_REPLY';
      console.error('[DELETE_REPLY] Firestore batch failed', {code:err.code, message:err.message, messageId, userId:uid});
      throw err;
    }
    return true;
  }
  async function deleteUserMessage(messageId){
    await ready;
    if(!db||!auth?.currentUser) throw new Error('AUTH_REQUIRED');
    const uid=auth.currentUser.uid;
    const rootRef=db.collection('messages').doc(String(messageId));
    const rootSnap=await rootRef.get();
    if(!rootSnap.exists) throw new Error('MESSAGE_NOT_FOUND');
    const root=rootSnap.data()||{};
    if(root.userId!==uid || root.replyTo) throw new Error('DELETE_NOT_ALLOWED');

    const batch=db.batch();
    const deletedMessageIds=new Set([String(messageId)]);
    const threadSnap=await db.collection('messages').where('userId','==',uid).get();
    threadSnap.forEach(doc=>{
      const data=doc.data()||{};
      if(doc.id===String(messageId) || data.replyTo===String(messageId) || data.threadId===String(messageId)){
        deletedMessageIds.add(doc.id);
        batch.delete(doc.ref);
      }
    });

    const notes=await db.collection('notifications').where('recipientId','==',uid).get();
    notes.forEach(doc=>{
      const data=doc.data()||{};
      if(deletedMessageIds.has(String(data.messageId||'')) || data.threadId===String(messageId)) batch.delete(doc.ref);
    });

    try{
      await batch.commit();
    }catch(err){
      err.operation='DELETE_USER_MESSAGE';
      console.error('[DELETE_MESSAGE] Firestore batch failed', {code:err.code, message:err.message, messageId, userId:uid});
      throw err;
    }
    return true;
  }
  async function replyToMessage(messageId, recipientId, text){
    await ready;
    if(!db||!auth?.currentUser||!(await isAdmin(auth.currentUser))) throw new Error('ADMIN_REQUIRED');
    const cleanText=String(text||'').trim();
    if(!cleanText) throw new Error('EMPTY_REPLY');
    const admin=auth.currentUser;
    const messageRef=db.collection('messages').doc();
    const notificationRef=db.collection('notifications').doc();
    const now=firebase.firestore.FieldValue.serverTimestamp();
    const batch=db.batch();
    batch.set(messageRef,{threadId:messageId,replyTo:messageId,userId:recipientId,adminId:admin.uid,adminName:admin.displayName||admin.email||'Admin',text:cleanText,createdAt:now,readByUser:false});
    batch.set(notificationRef,{recipientId,type:'reply',messageId:messageRef.id,read:false,text:'Admin replied to your message',textEn:'Admin replied to your message',textAr:'الأدمن رد على رسالتك',adminName:admin.displayName||admin.email||'Admin',createdAt:now});
    batch.update(db.collection('messages').doc(messageId),{readByAdmin:true,repliedByAdmin:true});
    try{
      await batch.commit();
    }catch(err){
      err.operation='ADMIN_REPLY_BATCH';
      err.adminUid=admin.uid;
      err.recipientId=recipientId;
      err.messageId=messageId;
      console.error('[ADMIN_REPLY] Firestore batch failed', {code:err.code, message:err.message, adminUid:admin.uid, recipientId, messageId});
      throw err;
    }
    return messageRef;
  }
  async function recordDownload(projectId){
    await ready;
    if(!db) {
      const err=new Error('FIREBASE_NOT_CONFIGURED');
      err.code='FIREBASE_NOT_CONFIGURED';
      throw err;
    }
    if(!auth?.currentUser){
      const err=new Error('AUTH_REQUIRED');
      err.code='AUTH_REQUIRED';
      throw err;
    }
    const ref=db.collection('projects').doc(projectId);
    const downloadRef=db.collection('downloads').doc();
    try {
      let nextCount=null;
      await db.runTransaction(async tx=>{
        const snap=await tx.get(ref);
        if(!snap.exists || snap.data().published !== true) throw new Error('PROJECT_NOT_AVAILABLE');
        const current=Number(snap.data().downloadCount||0);
        nextCount=current+1;
        const userId=auth?.currentUser?.uid||null;
        tx.update(ref,{downloadCount:nextCount,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
        tx.set(downloadRef,{projectId,userId,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
      });
      window.dispatchEvent(new CustomEvent('moaaz:download-count',{detail:{projectId,count:nextCount}}));
      return nextCount;
    } catch(e){
      console.warn('download counter',e);
      if(e?.code==='AUTH_REQUIRED' || e?.code==='FIREBASE_NOT_CONFIGURED') throw e;
      return null;
    }
  }
  function handleProtectedPages(user){
    const page=document.body?.dataset?.protected;
    if(page==='admin'){
      if(!user){location.replace('admin-login.html');return;}
      isAdmin(user).then(ok=>{if(!ok)location.replace('admin-login.html?denied=1');else window.dispatchEvent(new Event('moaaz:admin-ready'));});
    }
    if(page==='account' && !user && location.pathname.endsWith('account.html')) location.replace('login.html');
  }
  function authErrorMessage(err){
    const code=String(err?.code||'');
    const map={
      'auth/invalid-credential':'invalidCredentials','auth/invalid-login-credentials':'invalidCredentials','auth/wrong-password':'invalidCredentials','auth/user-not-found':'invalidCredentials',
      'auth/email-already-in-use':'emailInUse','auth/weak-password':'weakPassword','auth/popup-closed-by-user':'popupClosed','auth/network-request-failed':'networkError','AUTH_REQUIRED':'downloadLoginRequired','FIREBASE_NOT_CONFIGURED':'firebaseMissing'
    };
    return t(map[code]||'authError');
  }
  function showDownloadAuthToast(){
    const toast=ensureLiveToast();
    const ar=document.documentElement.lang==='ar';
    toast.querySelector('.moaaz-toast-icon').textContent='🔒';
    toast.querySelector('.moaaz-toast-copy b').textContent=ar?'تسجيل الدخول مطلوب':'Sign in required';
    toast.querySelector('.moaaz-toast-copy small').textContent=ar?'سجّل دخولك لتحميل المشروع.':'Please sign in to download this project.';
    toast.classList.toggle('is-ar',ar);
    toast.classList.add('show');
    clearTimeout(showDownloadAuthToast.timer);
    showDownloadAuthToast.timer=setTimeout(()=>toast.classList.remove('show'),5000);
  }

  function getAuthReturnUrl(){
    const raw=new URLSearchParams(location.search).get('returnTo');
    if(!raw)return 'account.html';
    try{
      const target=new URL(raw,location.href);
      if(target.origin!==location.origin)return 'account.html';
      return target.href;
    }catch(_){return 'account.html';}
  }

  function bindLoginPage(){
    const box=document.getElementById('loginPanel');if(!box)return;
    const ar=document.documentElement.lang==='ar';
    document.title=ar?'تسجيل الدخول — معاذ صلاح':'Sign in — Moaaz Salah';
    box.innerHTML=`<div class="auth-orbit"></div><div class="auth-mark">M<span>•</span></div><p class="auth-kicker">Moaaz / ${t('access')}</p><h1>${t('login')}</h1><p class="auth-sub">${t('signInHint')}</p><button class="auth-google" id="googleBtn"><span class="google-logo" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 12.2c0-.7-.06-1.4-.18-2H12v3.79h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.18Z"/><path fill="#34A853" d="M12 21.99c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.55 0-4.72-1.72-5.5-4.04H3.26v2.53A9.74 9.74 0 0 0 12 21.99Z"/><path fill="#FBBC05" d="M6.5 14.06A5.86 5.86 0 0 1 6.19 12c0-.72.12-1.42.31-2.06V7.41H3.26A10 10 0 0 0 2 12c0 1.66.4 3.23 1.26 4.59l3.24-2.53Z"/><path fill="#EA4335" d="M12 5.9c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 2.94 14.63 2 12 2a9.74 9.74 0 0 0-8.74 5.41l3.24 2.53C7.28 7.62 9.45 5.9 12 5.9Z"/></svg></span>${t('google')}</button><div class="auth-divider"><span>${t('or')}</span></div><form id="emailLoginForm"><label>${t('email')}<input type="email" name="email" autocomplete="email" required></label><label>${t('password')}<input type="password" name="password" autocomplete="current-password" required minlength="6"></label><button class="btn btn-solid" type="submit">${t('emailLogin')} ↗</button><p class="auth-error" id="authError"></p></form><p class="auth-switch">${t('register')}؟ <button id="registerMode" type="button">${t('createOne')}</button></p>`;
    box.querySelector('#googleBtn').onclick=async()=>{try{await signInGoogle();location.href=getAuthReturnUrl()}catch(e){box.querySelector('#authError').textContent=authErrorMessage(e)}};
    box.querySelector('#emailLoginForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);try{await signInEmail(f.get('email'),f.get('password'));location.href=getAuthReturnUrl()}catch(err){box.querySelector('#authError').textContent=authErrorMessage(err)}};
    box.querySelector('#registerMode').onclick=()=>bindRegister(box);
  }
  function bindRegister(box){
    const ar=document.documentElement.lang==='ar';
    document.title=ar?'إنشاء حساب — معاذ صلاح':'Create account — Moaaz Salah';
    box.innerHTML=`<div class="auth-orbit"></div><div class="auth-mark">M<span>•</span></div><p class="auth-kicker">Moaaz / ${t('newIdentity')}</p><h1>${t('register')}</h1><p class="auth-sub">${t('registerHint')}</p><form id="registerForm"><label>${t('name')}<input name="name" required autocomplete="name"></label><label>${t('email')}<input type="email" name="email" required autocomplete="email"></label><label>${t('password')}<input type="password" name="password" required minlength="6" autocomplete="new-password"></label><button class="btn btn-solid" type="submit">${t('register')} ↗</button><p class="auth-error" id="authError"></p></form><p class="auth-switch"><button id="backLogin" type="button">← ${t('backLogin')}</button></p>`;
    box.querySelector('#registerForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);try{await registerEmail(f.get('email'),f.get('password'),f.get('name'));location.href=getAuthReturnUrl()}catch(err){box.querySelector('#authError').textContent=authErrorMessage(err)}};
    box.querySelector('#backLogin').onclick=()=>bindLoginPage();
  }

  async function bindAdminLogin(){
    const box=document.getElementById('adminLoginPanel');
    if(!box)return;

    const denied=new URLSearchParams(location.search).get('denied')==='1';
    const isAr=document.documentElement.lang==='ar';
    const panelLabel=document.querySelector('[data-admin-panel-label]');
    if(panelLabel) panelLabel.textContent=t('adminPanel')+' · 2026';
    document.title=isAr?'دخول الإدارة — معاذ صلاح':'Admin Login — Moaaz Salah';

    box.innerHTML=`
      <span class="auth-eyebrow">${isAr?'منطقة الإدارة':'ADMIN ACCESS'}</span>
      <h1>${t('adminLogin')}</h1>
      <p class="auth-description">${t('adminOnly')}</p>

      ${denied ? `<div class="auth-denied">${t('accessDenied')}</div>` : ''}

      <form id="adminEmailForm" class="auth-form">
        <label>
          <span>${t('email')}</span>
          <input type="email" name="email" required autocomplete="username">
        </label>

        <label>
          <span>${t('password')}</span>
          <input type="password" name="password" required minlength="6" autocomplete="current-password">
        </label>

        <button class="btn btn-solid auth-submit" type="submit">
          <span>${t('adminLogin')}</span><b>↗</b>
        </button>

        <div class="auth-divider"><span>${isAr?'أو':'OR'}</span></div>

        <button class="auth-google auth-google-lavera" type="button" id="adminGoogle">
          <span class="google-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path fill="#4285F4" d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.41Z"/>
              <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.93-3.31.93-2.55 0-4.71-1.72-5.49-4.03H3.27v2.51A9.75 9.75 0 0 0 12 21.75Z"/>
              <path fill="#FBBC05" d="M6.51 13.85A5.86 5.86 0 0 1 6.2 12c0-.64.11-1.26.31-1.85V7.64H3.27A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.02 4.36l3.24-2.51Z"/>
              <path fill="#EA4335" d="M12 6.12c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.24 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.73 5.39l3.24 2.51C7.29 7.84 9.45 6.12 12 6.12Z"/>
            </svg>
          </span>
          <span>${t('google')}</span>
        </button>

        <p class="auth-error" id="adminError" role="alert" aria-live="polite"></p>
        <p class="auth-note">${isAr?'تسجيل الدخول متاح للحسابات المصرح لها فقط.':'Sign-in is available to authorized accounts only.'}</p>
      </form>
    `;

    const errorEl=box.querySelector('#adminError');
    const setError=(message)=>{
      errorEl.textContent=message||'';
      errorEl.classList.toggle('show',!!message);
    };

    const finish=async()=>{
      const user=auth?.currentUser;
      if(!user){
        setError(t('invalid'));
        return;
      }

      const authorized=await isAdmin(user);
      if(authorized){
        location.replace('admin.html');
        return;
      }

      // Match the reference project's behavior: unauthorized users are signed out immediately.
      try{ await logout(); }catch(_){}
      setError(t('accessDenied'));
    };

    box.querySelector('#adminGoogle').onclick=async()=>{
      const btn=box.querySelector('#adminGoogle');
      btn.disabled=true;
      setError('');
      try{
        await signInGoogle();
        await finish();
      }catch(e){
        console.error(e);
        try{
          if(auth?.currentUser) await logout();
        }catch(_){}
        setError(authErrorMessage(e));
      }finally{
        btn.disabled=false;
      }
    };

    box.querySelector('#adminEmailForm').onsubmit=async e=>{
      e.preventDefault();
      const form=e.currentTarget;
      const submit=form.querySelector('.auth-submit');
      const f=new FormData(form);
      submit.disabled=true;
      setError('');
      try{
        await signInEmail(String(f.get('email')||'').trim(),String(f.get('password')||''));
        await finish();
      }catch(err){
        console.error(err);
        try{
          if(auth?.currentUser) await logout();
        }catch(_){}
        setError(err.code==='auth/invalid-credential' || err.code==='auth/wrong-password' || err.code==='auth/user-not-found'
          ? (isAr?'بيانات الدخول غير صحيحة أو الحساب غير موجود.':'Incorrect credentials or account not found.')
          : (err.code||t('invalid')));
      }finally{
        submit.disabled=false;
      }
    };
  }

  window.MOAAZ_AUTH={ready,configured,labels,t,isAdmin,requireAdmin,showLiveToast,showDownloadAuthToast,signInGoogle,signInEmail,registerEmail,logout,sendMessage,replyToMessage,deleteAdminReply,deleteUserMessage,recordDownload,updateUnread,authErrorMessage,bindLoginPage,bindAdminLogin,get db(){return db},get auth(){return auth}};

  document.addEventListener('DOMContentLoaded',()=>{
    if(document.getElementById('loginPanel')){ready.then(()=>bindLoginPage());}
    if(document.getElementById('adminLoginPanel')){ready.then(()=>bindAdminLogin());}
  });
  window.addEventListener('moaaz:language',()=>{if(document.getElementById('loginPanel')) bindLoginPage(); if(document.getElementById('adminLoginPanel')) bindAdminLogin();});
})();
