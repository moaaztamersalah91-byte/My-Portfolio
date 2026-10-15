import { auth, db, googleProvider, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, getDocs, getDoc, collection, doc, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, serverTimestamp, runTransaction } from './firebase.js';
(function(){
window.showToast=(a,e)=>showToast(a,e);
let currentCustomer=null;
function customerIsSignedIn(){return !!auth.currentUser;}
function customerProfileRef(uid){return doc(db,'customers',uid);}
function customerAccountUrl(){return location.pathname.includes('/pages/')?'account.html':'pages/account.html';}
async function requireCustomerAuth(){
  if(auth.currentUser){currentCustomer=auth.currentUser;return true;}
  const user=await new Promise(resolve=>{let done=false;const unsub=onAuthStateChanged(auth,u=>{if(done)return;done=true;unsub();resolve(u||null)});setTimeout(()=>{if(done)return;done=true;unsub();resolve(auth.currentUser||null)},1800)});
  if(user){currentCustomer=user;return true;}
  showToast('سجّلي الدخول أولًا للمتابعة.','Please sign in to continue.');
  window.setTimeout(()=>location.href=customerAccountUrl(),250);
  return false;
}
function updateAccountLinks(){
  document.querySelectorAll('[data-account-link]').forEach(a=>{
    const ar=document.documentElement.lang==='ar';
    a.textContent=currentCustomer?(ar?'حسابي':'Account'):(ar?'تسجيل الدخول':'Sign in');
  });
}
onAuthStateChanged(auth,user=>{
  currentCustomer=user;
  updateAccountLinks();
});
const initialLoader=document.getElementById('laveraInitialLoader');
const initialLoaderSeen=sessionStorage.getItem('laveraInitialLoaderSeen')==='1';
if(initialLoader && !initialLoaderSeen && !initialLoader.dataset.started){
  initialLoader.dataset.started='true';
  sessionStorage.setItem('laveraInitialLoaderSeen','1');
  document.documentElement.classList.add('lavera-loading-active');
  document.body.classList.add('lavera-initial-loading');
  const percentEl=document.getElementById('laveraInitialPercent');
  const statusEl=document.getElementById('laveraInitialStatus');
  const messages=['PREPARING EXPERIENCE','LOADING COLLECTION','POLISHING DETAILS','SYNCING INTERFACE','ALMOST READY'];
  const duration=3600;
  const startedAt=performance.now();
  const finish=()=>{
    percentEl&&(percentEl.textContent='100');
    statusEl&&(statusEl.textContent='WELCOME TO LAVÉRA');
    initialLoader.classList.add('is-complete');
    document.documentElement.classList.remove('lavera-loading-active');
    document.body.classList.remove('lavera-initial-loading');
    startIntro();
    window.setTimeout(()=>initialLoader.remove(),850);
  };
  const tick=(now)=>{
    const progress=Math.min(100,Math.floor(((now-startedAt)/duration)*100));
    if(percentEl) percentEl.textContent=String(Math.max(1,progress)).padStart(2,'0');
    if(statusEl){
      const index=Math.min(messages.length-1,Math.floor(progress/20));
      statusEl.textContent=messages[index];
    }
    if(progress<100) requestAnimationFrame(tick); else finish();
  };
  requestAnimationFrame(tick);
}else if(initialLoader){
  initialLoader.remove();
}
const root=document.documentElement;
const savedTheme=localStorage.getItem('laveraTheme');
if(savedTheme) root.dataset.theme=savedTheme;
function startIntro(){
  if(document.querySelector('.lavera-intro'))return;
  const en=document.documentElement.lang==='en';
  const o=document.createElement('div');o.className='lavera-intro';
  o.innerHTML=`<i class="li-curtain li-l"></i><i class="li-curtain li-r"></i><div class="li-c"><div class="li-kicker">MAISON DE LINGERIE · EST. 2026</div><div class="li-brand">${[...'LAVÉRA'].map((c,i)=>`<span style="--i:${i}">${c}</span>`).join('')}</div><div class="li-line"></div><p class="li-tag">${en?'Quiet luxury, made to be felt.':'فخامة هادئة، تُحَسّ قبل أن تُرى.'}</p><button type="button" class="li-enter">${en?'ENTER THE ATELIER':'ادخلي إلى العالم'} ↗</button></div><div class="li-bar"><i></i></div>`;
  document.body.appendChild(o);document.body.classList.add('lavera-intro-lock');
  let done=false;
  const close=()=>{if(done)return;done=true;o.classList.add('is-open');setTimeout(()=>{o.remove();document.body.classList.remove('lavera-intro-lock')},1100)};
  o.querySelector('.li-enter').addEventListener('click',close);o.addEventListener('click',close);
  setTimeout(close,5200);
}
function updateThemeIcon(){const b=document.getElementById('themeBtn');if(b)b.textContent=root.dataset.theme==='dark'?'☀':'☾'}
function setTheme(){
 const next=root.dataset.theme==='dark'?'light':'dark';
 root.dataset.theme=next;
 try{localStorage.setItem('laveraTheme',next)}catch{}
 updateThemeIcon();
}

function getNavigationPageName(href, anchor){
 const lang=document.documentElement.lang==='ar'?'ar':'en';
 const raw=(href||'').split('#')[0].split('?')[0];
 const file=raw.split('/').pop().toLowerCase() || 'index.html';
 const names={
  'index.html':{ar:'الرئيسية',en:'HOME'},
  'shop.html':{ar:'المتجر',en:'SHOP'},
  'about.html':{ar:'قصتنا',en:'OUR STORY'},
  'contact.html':{ar:'تواصل معنا',en:'CONTACT'},
  'cart.html':{ar:'حقيبة التسوق',en:'SHOPPING BAG'},
  'wishlist.html':{ar:'المفضلة',en:'WISHLIST'},
  'checkout.html':{ar:'إتمام الطلب',en:'CHECKOUT'},
  'payment.html':{ar:'الدفع الآمن',en:'SECURE PAYMENT'},
  'product.html':{ar:'المنتج',en:'PRODUCT'},
  'order-details.html':{ar:'تفاصيل الطلب',en:'ORDER DETAILS'},
  'admin.html':{ar:'لوحة التحكم',en:'DASHBOARD'},
  'admin-login.html':{ar:'تسجيل الدخول',en:'ADMIN LOGIN'}
 };
 if(names[file]) return names[file][lang];
 const label=anchor?.dataset?.[lang==='ar'?'ar':'en'] || anchor?.textContent?.trim();
 return label ? label.toUpperCase() : (lang==='ar'?'جارٍ الانتقال':'LOADING');
}
function navigateWithTransition(anchor){
 if(!anchor || anchor.dataset.transitionBound==='true') return;
 const href=anchor.getAttribute('href');
 if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || anchor.target==='_blank') return;
 let destination;
 try{ destination=new URL(href, location.href); }catch{return;}
 if(destination.origin!==location.origin) return;
 const current=new URL(location.href);
 if(destination.pathname===current.pathname && destination.search===current.search && destination.hash===current.hash) return;
 anchor.dataset.transitionBound='true';
 anchor.addEventListener('click',e=>{
   if(e.defaultPrevented || e.button!==0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
   e.preventDefault();
   if(document.querySelector('.lavera-page-transition')) return;
   const lang=document.documentElement.lang==='ar'?'ar':'en';
   const name=getNavigationPageName(destination.pathname,anchor);
   const overlay=document.createElement('div');
   overlay.className='lavera-page-transition';
   overlay.setAttribute('aria-hidden','true');
   overlay.innerHTML=`
     <div class="lavera-page-transition__bg"></div>
     <div class="lavera-page-transition__ring"></div>
     <div class="lavera-page-transition__content">
       <div class="lavera-page-transition__kicker">${lang==='ar'?'جارٍ الانتقال إلى':'ENTERING'}</div>
       <div class="lavera-page-transition__name"></div>
       <div class="lavera-page-transition__line"><i></i></div>
       <div class="lavera-page-transition__meta">${lang==='ar'?'لحظة واحدة':'PLEASE WAIT'}</div>
     </div>`;
   document.body.appendChild(overlay);
   overlay.querySelector('.lavera-page-transition__name').textContent=name;
   document.body.classList.add('lavera-page-transition-lock');
   requestAnimationFrame(()=>overlay.classList.add('is-visible'));
   const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
   const duration=reduce?900:4000;
   window.setTimeout(()=>overlay.classList.add('is-leaving'),Math.max(350,duration-450));
   window.setTimeout(()=>{window.location.href=destination.href;},duration);
 },{once:true});
}
function initPageNavigationTransitions(){}

function showLanguageTransition(nextLang){applyLang(nextLang);}
function applyLang(lang){
 if(window.LAVERA_I18N) window.LAVERA_I18N.translate(lang);
 document.querySelectorAll('[data-ar][data-en]').forEach(el=>el.innerHTML=el.dataset[lang]);
 document.querySelectorAll('[data-placeholder-ar][data-placeholder-en]').forEach(el=>el.placeholder=el.dataset[lang==='ar'?'placeholderAr':'placeholderEn']);
 document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';const title=document.querySelector('[data-title-ar][data-title-en]');if(title)document.title=title.dataset[lang];
 const b=document.getElementById('langBtn');if(b)b.textContent=lang==='ar'?'EN':'AR';
 localStorage.setItem('laveraLang',lang);updateCart();updateVariantLabels();if(document.querySelector('.product-page')?._product)initReviews(document.querySelector('.product-page'),document.querySelector('.product-page')._product.id);if(document.body.classList.contains('dashboard-body')){renderOrders();renderMessages();renderReviewsAdmin();Promise.all([getOrdersFromFirestore(),getProductsFromFirestore()]).then(([o,p])=>{renderFinance(o);renderNotifications(o,p)}).catch(()=>{});}
}
function getCartItems(){
  try{
    const raw=localStorage.getItem('laveraCartItems');
    if(raw){
      const parsed=JSON.parse(raw);
      if(Array.isArray(parsed)) return parsed;
    }
  }catch(e){console.warn('Cart read failed',e);}
  // Backward compatibility with the old count-only cart.
  const legacy=Number(localStorage.getItem('laveraCart')||0);
  if(legacy>0){
    const item={id:'legacy-silk-elan',name:'Silk Élan Set',price:1299,image:'../Images/product-champagne.jpg',color:'champagne',size:'L',quantity:legacy};
    localStorage.setItem('laveraCartItems',JSON.stringify([item]));
    return [item];
  }
  return [];
}
function saveCartItems(items){
  localStorage.setItem('laveraCartItems',JSON.stringify(items));
  localStorage.setItem('laveraCart',String(items.reduce((sum,i)=>sum+(Number(i.quantity)||0),0)));
}
function cartCount(){return getCartItems().reduce((sum,i)=>sum+(Number(i.quantity)||0),0)}
const SHIPPING_ZONES={
  'القاهرة':{price:60,days:'1–2 يوم'},'الجيزة':{price:60,days:'1–2 يوم'},'القليوبية':{price:70,days:'1–2 يوم'},
  'الإسكندرية':{price:80,days:'2–3 أيام'},'الدقهلية':{price:90,days:'2–4 أيام'},'الشرقية':{price:90,days:'2–4 أيام'},
  'الغربية':{price:90,days:'2–4 أيام'},'المنوفية':{price:90,days:'2–4 أيام'},'البحيرة':{price:90,days:'2–4 أيام'},
  'كفر الشيخ':{price:95,days:'2–4 أيام'},'دمياط':{price:95,days:'2–4 أيام'},'بورسعيد':{price:95,days:'2–4 أيام'},
  'الإسماعيلية':{price:95,days:'2–4 أيام'},'السويس':{price:95,days:'2–4 أيام'},'الفيوم':{price:100,days:'3–5 أيام'},
  'بني سويف':{price:100,days:'3–5 أيام'},'المنيا':{price:110,days:'3–5 أيام'},'أسيوط':{price:110,days:'3–5 أيام'},
  'سوهاج':{price:120,days:'3–5 أيام'},'قنا':{price:120,days:'3–5 أيام'},'الأقصر':{price:125,days:'3–5 أيام'},
  'أسوان':{price:130,days:'4–6 أيام'},'البحر الأحمر':{price:130,days:'4–6 أيام'},'الوادي الجديد':{price:140,days:'4–6 أيام'},
  'مطروح':{price:130,days:'4–6 أيام'},'شمال سيناء':{price:140,days:'4–6 أيام'},'جنوب سيناء':{price:140,days:'4–6 أيام'}
};
function cartTotals(items=getCartItems(),governorate=''){
  const subtotal=items.reduce((sum,i)=>sum+(Number(i.price)||0)*(Number(i.quantity)||0),0);
  const zone=SHIPPING_ZONES[governorate];
  const shipping=zone?zone.price:(subtotal===0?0:80);
  return {subtotal,shipping,total:subtotal+shipping,zone};
}
function updateCart(){
  const items=getCartItems(), n=cartCount();
  document.querySelectorAll('.cart-count,.desktop-bag b').forEach(e=>e.textContent=n);
  const empty=document.querySelector('[data-cart-empty]'); const layout=document.querySelector('[data-cart-layout]');
  if(empty&&layout){empty.hidden=n>0;layout.hidden=n===0;if(n>0)renderCart();}
}
function escapeHtml(value){return String(value??'').replace(/[&<>\"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[char]))}
function showToast(ar,en){
 const t=document.getElementById('toast');
 if(!t)return;
 const isAr=document.documentElement.lang==='ar';
 const text=isAr?ar:en;
 t.innerHTML=`<span class="toast-icon" aria-hidden="true">✓</span><span class="toast-text"></span><i class="toast-progress" aria-hidden="true"></i>`;
 const textEl=t.querySelector('.toast-text');
 if(textEl) textEl.textContent=text;
 t.setAttribute('role','status');
 t.setAttribute('aria-live','polite');
 t.classList.add('show');
 t.classList.toggle('is-ar',isAr);
 clearTimeout(window._toast);
 requestAnimationFrame(()=>{ t.classList.remove('toast-restart'); void t.offsetWidth; t.classList.add('toast-restart'); });
 window._toast=setTimeout(()=>t.classList.remove('show'),5000);
}
function renderCart(){
  const list=document.querySelector('[data-cart-items]'); if(!list)return;
  const items=getCartItems(), {subtotal,shipping,total}=cartTotals(items);
  list.innerHTML='';
  items.forEach((item,index)=>{
    const qty=Number(item.quantity)||1;
    const lineTotal=(Number(item.price)||0)*qty;
    const meta=[item.color,item.size].filter(Boolean).join(' · ');
    const article=document.createElement('article');
    article.className='cart-item';
    article.innerHTML=`<div class="cart-thumb"><img src="${item.image||'../Images/product-black.jpg'}" alt="${item.name||''}"></div>
      <div><h3>${item.name||'Product'}</h3><div class="cart-meta">${meta||''}</div>
      <div class="qty"><button type="button" data-qty-minus>−</button><span>${qty}</span><button type="button" data-qty-plus>+</button></div></div>
      <div class="cart-price"><strong>${lineTotal.toLocaleString()} EGP</strong><br><button class="remove" type="button" data-remove data-ar="حذف" data-en="Remove">حذف</button></div>`;
    list.appendChild(article);
    article.querySelector('[data-qty-minus]').onclick=()=>{
      const next=getCartItems(); next[index].quantity=Math.max(0,(Number(next[index].quantity)||1)-1);
      if(next[index].quantity===0)next.splice(index,1); saveCartItems(next); updateCart();
    };
    article.querySelector('[data-qty-plus]').onclick=async()=>{
      const next=getCartItems();
      const current=Math.max(1,Number(next[index].quantity)||1);
      const live=await getAvailableStockForCartItem(next[index]);
      if(live < current + 1){
        showToast(
          live===0?'هذا الاختيار نفد من المخزون.':'الكمية المتاحة لهذا الاختيار أقل من المطلوب.',
          live===0?'This option is out of stock.':'The available quantity is lower than requested.'
        );
        updateCart();
        return;
      }
      next[index].quantity=current+1; saveCartItems(next); updateCart();
    };
    article.querySelector('[data-remove]').onclick=()=>{
      const next=getCartItems(); next.splice(index,1); saveCartItems(next); updateCart();
    };
  });
  const set=(sel,val)=>{const e=document.querySelector(sel);if(e)e.textContent=val};
  set('[data-subtotal]',`${subtotal.toLocaleString()} EGP`);
  set('[data-shipping]',shipping===0?(document.documentElement.lang==='ar'?'مجاني':'Free'):`${shipping} EGP`);
  set('[data-total]',`${total.toLocaleString()} EGP`);
  document.querySelectorAll('[data-ar][data-en]').forEach(el=>el.innerHTML=el.dataset[document.documentElement.lang]);
}
function addProductToCart(product, quantity, color, size){
  const items=getCartItems();
  const key=[product.id||product.name||'product',color||'',size||''].join('|');
  const existing=items.find(i=>i.key===key);
  if(existing) existing.quantity+=quantity;
  else items.push({key,id:product.id||product.name,name:product.name,price:Number(product.price)||0,image:product.image||'../Images/product-black.jpg',color:color||'',size:size||'',quantity});
  saveCartItems(items); updateCart();
}
function getSelectedColor(){return document.querySelector('.color-option.selected')?.dataset.color||'champagne'}
function getSelectedSize(){return document.querySelector('.sizes button.selected')?.textContent||'L'}
function getStock(){
 const p=document.querySelector('.product-page')?._product;
 if(p){
   const keyColor=getSelectedColor(), keySize=getSelectedSize();
   const v=(p.variants||[]).find(x=>String(x.color)===String(keyColor)&&String(x.size)===String(keySize));
   return Number(v?.qty)||0;
 }
 const stockMap={'champagne-S':6,'champagne-M':8,'champagne-L':5,'champagne-XL':2,'black-S':4,'black-M':7,'black-L':3,'black-XL':1,'ivory-S':3,'ivory-M':4,'ivory-L':2,'ivory-XL':0};
 return stockMap[`${getSelectedColor()}-${getSelectedSize()}`]??0;
}
async function getAvailableStockForCartItem(item){
  const id=String(item?.id||'').trim();
  if(!id)return 0;
  try{
    const snap=await getDoc(doc(db,'products',id));
    if(!snap.exists())return 0;
    return getVariantStockFromProduct({id:snap.id,...snap.data()},item);
  }catch(error){
    console.error('Live stock check failed',error);
    return 0;
  }
}
async function updateVariantStock(){
 const add=document.querySelector('[data-add-product]');
 const status=document.querySelector('[data-stock-status]');
 const n=document.querySelector('[data-product-qty]');
 const p=document.querySelector('.product-page')?._product;
 const selectedItem=p?{id:p.id,color:getSelectedColor(),size:getSelectedSize()}:null;
 let stock=selectedItem?await getAvailableStockForCartItem(selectedItem):getStock();
 if(n){n.textContent=stock>0?Math.min(Number(n.textContent)||1,stock):0;}
 if(status){
   status.classList.toggle('low',stock>0&&stock<=3);
   status.textContent=document.documentElement.lang==='ar'
     ?(stock===0?'غير متوفر حاليًا':stock<=3?`متبقي ${stock} قطع فقط`:`متوفر — ${stock} قطع`)
     :(stock===0?'Currently unavailable':stock<=3?`Only ${stock} left`:`In stock — ${stock} pieces`);
 }
 if(add){
   add.disabled=stock===0;
   add.setAttribute('aria-disabled',stock===0?'true':'false');
   add.style.opacity=stock===0?'.5':'1';
   add.style.pointerEvents=stock===0?'none':'';
 }
 return stock;
}
function updateVariantLabels(){updateVariantStock();document.querySelectorAll('.color-option label span:last-child').forEach(()=>{});}
window.addToCart=async function(){
 if(!(await requireCustomerAuth())) return;
 const product=document.querySelector('.product-page')?._product||{id:'silk-elan',name:'Silk Élan Set',price:1299,image:'../Images/product-champagne.jpg'};
 const chosen={id:product.id,color:getSelectedColor(),size:getSelectedSize()};
 const stock=await getAvailableStockForCartItem(chosen);
 if(stock<=0){
   showToast('هذا الاختيار غير متوفر حاليًا.','This option is currently unavailable.');
   await updateVariantStock();
   return;
 }
 const qty=Math.max(1,Math.min(Number(document.querySelector('[data-product-qty]')?.textContent||1),stock));
 const existing=getCartItems().find(i=>i.id===product.id&&String(i.color)===String(chosen.color)&&String(i.size).toUpperCase()===String(chosen.size).toUpperCase());
 const alreadyInCart=Number(existing?.quantity)||0;
 if(alreadyInCart+qty>stock){
   const remaining=Math.max(0,stock-alreadyInCart);
   showToast(remaining===0?'هذا الاختيار موجود بالفعل بأقصى كمية متاحة.':`المتاح لإضافته ${remaining} قطعة فقط.`,remaining===0?'This option is already at the available limit.':`Only ${remaining} more ${remaining===1?'item':'items'} can be added.`);
   return;
 }
 addProductToCart(product,qty,getSelectedColor(),getSelectedSize());
 if(window.LAVERA_SOUNDS) window.LAVERA_SOUNDS.cart();
 showToast('تمت إضافة المنتج إلى حقيبة التسوق.','Product added to your bag.');
 await updateVariantStock();
}
window.applyShopFilter=function(category){document.querySelectorAll('.filters button').forEach(b=>b.classList.toggle('active',b.dataset.filter===category));document.querySelectorAll('.shop-grid .product').forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category})}
function addVariantRow(data={color:'black',size:'M',qty:0}){
 const wrap=document.getElementById('variants');if(!wrap)return;
 const row=document.createElement('div');row.className='variant-row';
 row.innerHTML=`<input name="color" value="${data.color}" placeholder="أسود / Black"><select name="size"><option ${data.size==='S'?'selected':''}>S</option><option ${data.size==='M'?'selected':''}>M</option><option ${data.size==='L'?'selected':''}>L</option><option ${data.size==='XL'?'selected':''}>XL</option></select><input name="qty" type="number" min="0" value="${data.qty}" placeholder="0"><button type="button" class="remove-row" aria-label="remove">×</button>`;
 wrap.appendChild(row);
 row.querySelector('.remove-row').onclick=()=>{row.remove();updateStockTotal()};
 row.querySelectorAll('input,select').forEach(i=>i.addEventListener('input',updateStockTotal));
 updateStockTotal();
}
function updateStockTotal(){let total=0;document.querySelectorAll('#variants input[name="qty"]').forEach(i=>total+=Math.max(0,Number(i.value)||0));const el=document.getElementById('stockTotal');if(el)el.textContent=total.toLocaleString()}
function initProductPage(){
 document.querySelectorAll('.sizes button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.sizes button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');const q=document.querySelector('[data-product-qty]');if(q)q.textContent='1';updateVariantStock()}));
 document.querySelectorAll('.color-option').forEach(i=>i.addEventListener('click',()=>{document.querySelectorAll('.color-option').forEach(x=>x.classList.remove('selected'));i.classList.add('selected');const q=document.querySelector('[data-product-qty]');if(q)q.textContent='1';updateVariantStock()}));
 document.querySelector('[data-product-minus]')?.addEventListener('click',()=>{const q=document.querySelector('[data-product-qty]');if(q&&Number(q.textContent)>1)q.textContent=Number(q.textContent)-1;});
 document.querySelector('[data-product-plus]')?.addEventListener('click',async()=>{
   const q=document.querySelector('[data-product-qty]'); if(!q)return;
   const stock=await updateVariantStock();
   const current=Number(q.textContent)||0;
   if(stock===0){if(window.LAVERA_SOUNDS) window.LAVERA_SOUNDS.error();
   showToast('هذا الاختيار غير متوفر حاليًا.','This option is currently unavailable.');return;}
   if(current<stock)q.textContent=String(current+1);
 });
 updateVariantStock();
 
}
function initAdmin(){
 addVariantRow({color:'black',size:'M',qty:8});addVariantRow({color:'champagne',size:'M',qty:6});
 document.getElementById('addVariant')?.addEventListener('click',()=>addVariantRow());
 document.getElementById('productForm')?.addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.currentTarget);const variants=[...document.querySelectorAll('.variant-row')].map(row=>({color:row.querySelector('[name=color]').value.trim(),size:row.querySelector('[name=size]').value,qty:Number(row.querySelector('[name=qty]').value)||0})).filter(v=>v.color);const product={name:form.get('name'),price:Number(form.get('price'))||0,category:form.get('category'),variants,createdAt:new Date().toISOString()};localStorage.setItem('laveraDemoProduct',JSON.stringify(product));showToast('تم حفظ المنتج والاختيارات بنجاح.','Product and variants saved successfully.');});
 document.getElementById('productForm')?.addEventListener('reset',()=>setTimeout(updateStockTotal,0));
}


async function getProductsFromFirestore(){
 try{
   const snap=await getDocs(query(collection(db,'products'),orderBy('createdAt','desc')));
   return snap.docs.map(d=>({id:d.id,...d.data()}));
 }catch(e){console.error(e);showToast('تعذر تحميل المنتجات حاليًا.','Products could not be loaded right now.');return [];}
}
async function migrateDemoProducts(){
 const snap=await getDocs(query(collection(db,'products'),limit(1)));if(!snap.empty)return;
 const defaults=[
  {name:'Silk Élan Set',price:1299,category:'sets',image:'../Images/product-champagne.jpg',variants:[{color:'شامبين',size:'S',qty:6},{color:'شامبين',size:'M',qty:8},{color:'أسود',size:'L',qty:5}]},
  {name:'Noir Lace Set',price:1499,category:'lingerie',image:'../Images/product-black.jpg',variants:[{color:'أسود',size:'M',qty:4},{color:'أسود',size:'L',qty:2}]}
 ];
 for(const p of defaults)await addDoc(collection(db,'products'),{...p,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),published:true});
}
async function isAuthorizedAdmin(user){
 if(!user?.uid)return false;
 try{
  const adminSnap=await getDoc(doc(db,'admins',user.uid));
  return adminSnap.exists() && adminSnap.data()?.active !== false;
 }catch(err){
  console.error('Admin authorization check failed:',err);
  return false;
 }
}
async function initAdminLogin(){
 const form=document.getElementById('adminLoginForm');if(!form)return;
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  const f=new FormData(form);
  try{
   const credential=await signInWithEmailAndPassword(auth,String(f.get('email')).trim(),String(f.get('password')));
   if(await isAuthorizedAdmin(credential.user)){
    location.href='admin.html';
   }else{
    await signOut(auth);
    showToast('هذا الحساب غير مصرح له بدخول لوحة التحكم.','This account is not authorized to access the dashboard.');
   }
  }catch(err){
   console.error(err);
   showToast('بيانات الدخول غير صحيحة أو الحساب غير موجود.','Incorrect credentials or account not found.');
  }
 });
 document.getElementById('googleAdminLogin')?.addEventListener('click',async()=>{
  try{
   const credential=await signInWithPopup(auth,googleProvider);
   if(await isAuthorizedAdmin(credential.user)){
    location.href='admin.html';
   }else{
    await signOut(auth);
    showToast('حساب Google هذا غير مصرح له بدخول لوحة التحكم.','This Google account is not authorized to access the dashboard.');
   }
  }catch(err){
   console.error(err);
   showToast('تعذر تسجيل الدخول بحساب Google.','Google sign-in failed.');
  }
 });
}
async function ensureAdmin(){
 if(!document.body.classList.contains('dashboard-body'))return true;
 return new Promise(resolve=>{
  const unsub=onAuthStateChanged(auth,async user=>{
   unsub();
   if(!user){
    location.href='admin-login.html';
    resolve(false);
    return;
   }
   const authorized=await isAuthorizedAdmin(user);
   if(!authorized){
    await signOut(auth);
    location.href='admin-login.html';
    resolve(false);
    return;
   }
   resolve(true);
  });
 });
}
function variantRow(data={color:'أسود',size:'M',qty:0}){
 const row=document.createElement('div');row.className='dash-variant-row';
 row.innerHTML=`<input name="vcolor" value="${String(data.color||'').replace(/"/g,'&quot;')}" placeholder="أسود / Black"><select name="vsize"><option ${data.size==='S'?'selected':''}>S</option><option ${data.size==='M'?'selected':''}>M</option><option ${data.size==='L'?'selected':''}>L</option><option ${data.size==='XL'?'selected':''}>XL</option></select><input name="vqty" type="number" min="0" value="${Number(data.qty)||0}"><button type="button" aria-label="remove">×</button>`;
 row.querySelector('button').onclick=()=>{row.remove();updateModalTotal()};row.querySelectorAll('input,select').forEach(x=>x.addEventListener('input',updateModalTotal));return row;
}
function updateModalTotal(){let total=0;document.querySelectorAll('#modalVariants .dash-variant-row [name=vqty]').forEach(x=>total+=Math.max(0,Number(x.value)||0));const el=document.getElementById('modalStockTotal');if(el)el.textContent=total.toLocaleString()}
function openProductModal(product){
 const modal=document.getElementById('productModal'),form=document.getElementById('dashboardProductForm');if(!modal||!form)return;
 form.reset();
document.getElementById('modalVariants').innerHTML='';
form.elements.id.value=product?.id||'';
form.elements.name.value=product?.name||'';
form.elements.price.value=product?.price??'';
form.elements.category.value=product?.category||'sets';
 (product?.variants?.length?product.variants:[{color:'أسود',size:'M',qty:0}]).forEach(v=>document.getElementById('modalVariants').appendChild(variantRow(v)));
 document.getElementById('modalTitle').innerHTML=product?'تعديل المنتج':'إضافة منتج جديد';modal.classList.add('open');updateModalTotal();
}
function closeProductModal(){document.getElementById('productModal')?.classList.remove('open')}
function categoryLabel(cat){const ar={sets:'أطقم',lingerie:'لانجري',lounge:'منزلية'},en={sets:'Sets',lingerie:'Lingerie',lounge:'Loungewear'};return document.documentElement.lang==='ar'?(ar[cat]||cat):(en[cat]||cat)}
function totalStock(product){return (product.variants||[]).reduce((n,v)=>n+(Number(v.qty)||0),0)}
async function renderNotifications(_orders, products){
  const wrap=document.getElementById('notificationList');
  if(!wrap)return;
  const ar=document.documentElement.lang==='ar';
  const lowItems=[];
  (products||[]).forEach(p=>{
    const stock=totalStock(p);
    if(stock<=5){
      lowItems.push({name:String(p.name||'Product'),stock});
    }
  });
  lowItems.sort((a,b)=>a.stock-b.stock);
  if(!lowItems.length){
    wrap.innerHTML=`<div class="empty-notification"><span>✓</span><p>${ar?'المخزون بحالة جيدة — لا توجد تنبيهات.':'Inventory is healthy — no alerts.'}</p></div>`;
    return;
  }
  wrap.innerHTML=lowItems.map(item=>{
    const out=item.stock===0;
    const label=out
      ?(ar?`نفد مخزون «${item.name}»`:`“${item.name}” is out of stock`)
      :(ar?`مخزون «${item.name}» منخفض — متبقي ${item.stock} قطع`:`“${item.name}” is low — ${item.stock} unit${item.stock===1?'':'s'} left`);
    return `<button class="notification-row ${out?'is-out':'is-low'}" type="button" data-notify-section="inventory"><i>${out?'×':'!'}</i><span>${escapeHtml(label)}</span><b>↗</b></button>`;
  }).join('');
  wrap.querySelectorAll('[data-notify-section]').forEach(b=>b.onclick=()=>document.querySelector(`[data-section="${b.dataset.notifySection}"]`)?.click());
}

let dashboardRealtimeUnsubs=[];
let dashboardRealtimeStarted=false;
let realtimeOrderIds=new Set();
let realtimeMessageIds=new Set();
let realtimeReviewIds=new Set();
let realtimeStockState=new Map();
let realtimeFirstOrders=true;
let realtimeFirstMessages=true;
let realtimeFirstReviews=true;
let realtimeFirstProducts=true;

function stopDashboardRealtime(){
  dashboardRealtimeUnsubs.forEach(fn=>{try{fn()}catch(_){}});
  dashboardRealtimeUnsubs=[];
  dashboardRealtimeStarted=false;
}

function playAdminEventSound(message){
  if(window.LAVERA_SOUNDS?.adminBell) window.LAVERA_SOUNDS.adminBell();
  if(message) showToast(message,'New dashboard activity received.');
}

let _dashT;function _dashRefresh(kind){clearTimeout(_dashT);_dashT=setTimeout(()=>{if(kind==='orders'){renderOrders();}else{renderDashboard();}},250)}
function startDashboardRealtime(){
  if(dashboardRealtimeStarted || !document.body.classList.contains('dashboard-body')) return;
  dashboardRealtimeStarted=true;
  const safeSnapshot=(target, fn)=>{
    try{
      const unsub=onSnapshot(collection(db,target),fn,err=>console.error(`Realtime ${target} listener failed:`,err));
      dashboardRealtimeUnsubs.push(unsub);
    }catch(err){console.error(`Realtime ${target} setup failed:`,err);}
  };

  safeSnapshot('orders', snap=>{
    const current=snap.docs.map(d=>({id:d.id,...d.data()}));
    const added=snap.docChanges().filter(c=>c.type==='added');
    if(realtimeFirstOrders){
      snap.docs.forEach(d=>realtimeOrderIds.add(d.id));
      realtimeFirstOrders=false;
    }else{
      const fresh=added.filter(c=>!realtimeOrderIds.has(c.doc.id));
      snap.docs.forEach(d=>realtimeOrderIds.add(d.id));
      if(fresh.length) playAdminEventSound(document.documentElement.lang==='ar'?`طلب جديد وصل إلى لوحة التحكم (${fresh.length}).`:`${fresh.length} new order${fresh.length>1?'s':''} received.`);
    }
    const products=[...realtimeStockState.values()].map(x=>x.product).filter(Boolean);
    const pe=document.getElementById('statPending'),ue=document.getElementById('statUnpaid');
    const pending=current.filter(o=>o.status==='pending').length,unpaid=current.filter(o=>o.paymentStatus!=='paid'&&o.status!=='cancelled').length;
    if(pe)pe.textContent=pending;if(ue)ue.textContent=unpaid;
    _dashRefresh('orders');
  });

  safeSnapshot('messages', snap=>{
    const added=snap.docChanges().filter(c=>c.type==='added');
    const customerReplies=snap.docChanges().filter(c=>c.type==='modified' && c.doc.data().customerReply);
    if(realtimeFirstMessages){snap.docs.forEach(d=>realtimeMessageIds.add(d.id));realtimeFirstMessages=false;}
    else{
      const fresh=added.filter(c=>!realtimeMessageIds.has(c.doc.id));snap.docs.forEach(d=>realtimeMessageIds.add(d.id));
      if(fresh.length)playAdminEventSound(document.documentElement.lang==='ar'?`رسالة جديدة وصلت إلى لوحة التحكم (${fresh.length}).`:`${fresh.length} new message${fresh.length>1?'s':''} received.`);
      if(customerReplies.length)playAdminEventSound(document.documentElement.lang==='ar'?`عميلة أرسلت ردًا جديدًا.`:`A customer sent a new reply.`);
    }
    renderMessages();
  });

  safeSnapshot('reviews', snap=>{
    const added=snap.docChanges().filter(c=>c.type==='added');
    if(realtimeFirstReviews){snap.docs.forEach(d=>realtimeReviewIds.add(d.id));realtimeFirstReviews=false;}
    else{
      const fresh=added.filter(c=>!realtimeReviewIds.has(c.doc.id));snap.docs.forEach(d=>realtimeReviewIds.add(d.id));
      if(fresh.length)playAdminEventSound(document.documentElement.lang==='ar'?`تقييم جديد وصل إلى لوحة التحكم (${fresh.length}).`:`${fresh.length} new review${fresh.length>1?'s':''} received.`);
    }
    renderReviewsAdmin();
  });

  safeSnapshot('products', snap=>{
    const products=snap.docs.map(d=>({id:d.id,...d.data()}));
    const next=new Map();
    products.forEach(p=>{
      const stock=totalStock(p);
      const prev=realtimeStockState.get(p.id)?.stock;
      next.set(p.id,{stock,product:p});
      if(!realtimeFirstProducts && typeof prev==='number'){
        const crossedLow=prev>5 && stock>0 && stock<=5;
        const becameOut=prev>0 && stock===0;
        if(crossedLow||becameOut){
          if(window.LAVERA_SOUNDS?.stockAlarm)window.LAVERA_SOUNDS.stockAlarm();
          showToast(
            becameOut ? `نفد مخزون ${p.name||'المنتج'}.` : `تحذير مخزون: ${p.name||'المنتج'} متبقي منه ${stock} قطع.`,
            becameOut ? `${p.name||'Product'} is out of stock.` : `Stock warning: ${p.name||'Product'} has only ${stock} units left.`
          );
        }
      }
    });
    realtimeStockState=next;
    realtimeFirstProducts=false;
    renderNotifications([],products);
    renderInventory(products);
    const low=products.filter(p=>{const s=totalStock(p);return s>0&&s<=5}).length;
    const out=products.filter(p=>totalStock(p)===0).length;
    ['statLow','lowCount2'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=low});
    const oe=document.getElementById('outCount');if(oe)oe.textContent=out;
    _dashRefresh('products');
  });
}

async function renderDashboard(){
 const products=await getProductsFromFirestore(),lang=document.documentElement.lang,tbody=document.getElementById('productsTable');if(!tbody)return;
 const q=(document.getElementById('productSearch')?.value||'').toLowerCase(),cat=document.getElementById('productFilter')?.value||'all';tbody.innerHTML='';
 products.filter(p=>(!q||String(p.name||'').toLowerCase().includes(q))&&(cat==='all'||p.category===cat)).forEach(p=>{
  const stock=totalStock(p),colors=[...new Set((p.variants||[]).map(v=>v.color))],sizes=[...new Set((p.variants||[]).map(v=>v.size))],tr=document.createElement('tr');
  tr.innerHTML=`<td><div class="table-product"><img src="${p.image||'../Images/product-black.jpg'}" alt=""><div><strong>${p.name}</strong><small>${categoryLabel(p.category)}</small></div></div></td><td>${Number(p.price||0).toLocaleString()} EGP</td><td>${colors.length}</td><td>${sizes.join(' · ')||'—'}</td><td><strong>${stock}</strong></td><td><span class="status-pill ${stock===0?'out':stock<=5?'low':''}">${stock===0?(lang==='ar'?'نفد':'Out of stock'):stock<=5?(lang==='ar'?'منخفض':'Low'):(lang==='ar'?'متوفر':'Active')}</span></td><td><div class="row-actions"><button type="button" data-edit="${p.id}">✎</button><button type="button" data-delete="${p.id}">×</button></div></td>`;
  tbody.appendChild(tr);
 });
 tbody.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openProductModal(products.find(x=>x.id===b.dataset.edit)));
 tbody.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(confirm(lang==='ar'?'متأكد إنك عايز تمسح المنتج؟':'Delete this product?')){try{await deleteDoc(doc(db,'products',b.dataset.delete));await renderDashboard();showToast('تم حذف المنتج.','Product deleted.')}catch(e){console.error(e);showToast('تعذر حذف المنتج.','Could not delete product.')}}});
 const count=products.length,low=products.filter(p=>{const s=totalStock(p);return s>0&&s<=5}).length,out=products.filter(p=>totalStock(p)===0).length;
 ['statProducts','healthyCount'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=id==='statProducts'?count:count-low-out});['statLow','lowCount2'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=low});const o=document.getElementById('outCount');if(o)o.textContent=out;
 const recent=document.getElementById('recentProducts');if(recent){recent.innerHTML='';products.slice(0,4).forEach(p=>{const d=document.createElement('div');d.className='mini-product';d.innerHTML=`<img src="${p.image||'../Images/product-black.jpg'}" alt=""><div><strong>${p.name}</strong><small>${Number(p.price||0).toLocaleString()} EGP · ${totalStock(p)} ${lang==='ar'?'قطعة':'units'}</small></div>`;recent.appendChild(d)})}
 renderInventory(products);
 const orders=await getOrdersFromFirestore().catch(()=>[]);
 const pending=orders.filter(o=>o.status==='pending').length,unpaid=orders.filter(o=>o.paymentStatus!=='paid'&&o.status!=='cancelled').length;
 const pe=document.getElementById('statPending'),ue=document.getElementById('statUnpaid');if(pe)pe.textContent=pending;if(ue)ue.textContent=unpaid;
 await renderFinance(orders);
 await renderNotifications(orders,products);
}
async function renderInventory(products){
  const wrap=document.getElementById('inventoryGrid');if(!wrap)return;wrap.innerHTML='';
  for(const p of products){
    const variants=Array.isArray(p.variants)?p.variants:[];
    const availableTotal=variants.reduce((n,v)=>n+Math.max(0,Number(v.qty)||0),0);
    const rows=variants.map(v=>{
      const available=Math.max(0,Number(v.qty)||0);
      const pct=availableTotal?Math.min(100,(available/Math.max(1,availableTotal))*100):0;
      return `<div class="stock-line"><span>${escapeHtml(v.color||'—')} · ${escapeHtml(v.size||'—')}</span><div class="stock-bar"><i style="width:${pct}%"></i></div><strong>${available}</strong></div>`;
    }).join('');
    const card=document.createElement('article');
    card.className='inventory-card';
    card.innerHTML=`<h3>${escapeHtml(p.name||'Product')}</h3><p>${escapeHtml(categoryLabel(p.category))} · ${availableTotal} ${document.documentElement.lang==='ar'?'متاح':'available'}</p><div class="stock-bars">${rows||'<span class="muted">No variants</span>'}</div>`;
    wrap.appendChild(card);
  }
}


function toDateValue(ts){
  if(!ts)return null;
  const d=ts.toDate?ts.toDate():new Date(ts);
  return Number.isNaN(d.getTime())?null:d;
}
function money(value){return `${Number(value||0).toLocaleString()} EGP`}
function orderIsRevenue(o){return o.paymentStatus==='paid' && o.status!=='cancelled'}
function periodStart(kind){
  const now=new Date();
  if(kind==='year')return new Date(now.getFullYear(),0,1);
  if(kind==='six')return new Date(now.getFullYear(),now.getMonth()-5,1);
  if(kind==='month')return new Date(now.getFullYear(),now.getMonth(),1);
  return new Date(now.getFullYear(),now.getMonth(),now.getDate());
}
function inPeriod(ts,start){const d=toDateValue(ts);return d&&d>=start}
async function getExpensesFromFirestore(){
  const snap=await getDocs(query(collection(db,'expenses'),orderBy('date','desc')));
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}
function expenseTotal(expenses,start){return expenses.filter(e=>inPeriod(e.date,start)).reduce((n,e)=>n+(Number(e.amount)||0),0)}
function revenueTotal(orders,start){return orders.filter(o=>orderIsRevenue(o)&&inPeriod(o.createdAt,start)).reduce((n,o)=>n+(Number(o.total)||0),0)}
function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}
function monthLabel(d){return d.toLocaleDateString(document.documentElement.lang==='ar'?'ar-EG':'en-EG',{month:'short'})}
async function renderFinance(orders){
  try{
    const expenses=await getExpensesFromFirestore();
    const annualRevenue=revenueTotal(orders,periodStart('year')),sixRevenue=revenueTotal(orders,periodStart('six'));
    const annualExpenses=expenseTotal(expenses,periodStart('year')),sixExpenses=expenseTotal(expenses,periodStart('six'));
    const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=money(v)};
    set('annualRevenue',annualRevenue);set('annualRevenueOverview',annualRevenue);set('sixRevenue',sixRevenue);set('annualExpenses',annualExpenses);set('sixExpenses',sixExpenses);
    set('annualNet',annualRevenue-annualExpenses);set('annualNetOverview',annualRevenue-annualExpenses);set('sixNet',sixRevenue-sixExpenses);
    const netA=document.getElementById('annualNet'),netS=document.getElementById('sixNet');
    [netA,netS].forEach(e=>{if(e)e.classList.toggle('negative',Number((e?.textContent||'').replace(/[^0-9.-]/g,''))<0)});
    const list=document.getElementById('expensesList');
    if(list){list.innerHTML=expenses.slice(0,12).map(e=>`<article class="expense-row"><div><strong>${escapeHtml(e.title||'Expense')}</strong><small>${escapeHtml(e.category||'Other')} · ${escapeHtml(e.date||'—')}</small></div><b>${money(e.amount)}</b><button class="row-delete" type="button" data-delete-expense="${e.id}">×</button></article>`).join('') || `<div class="empty-admin"><span>◌</span><h2>${document.documentElement.lang==='ar'?'لا توجد مصروفات':'No expenses yet'}</h2><p>${document.documentElement.lang==='ar'?'أضف أول مصروف لتبدأ حساب صافي الربح.':'Add your first expense to calculate net profit.'}</p></div>`;
      list.querySelectorAll('[data-delete-expense]').forEach(b=>b.onclick=async()=>{if(!confirm(document.documentElement.lang==='ar'?'حذف هذا المصروف؟':'Delete this expense?'))return;await deleteDoc(doc(db,'expenses',b.dataset.deleteExpense));await renderFinance(orders);showToast('تم حذف المصروف.','Expense deleted.')});
    }
    const chart=document.getElementById('financeChart');
    if(chart){const now=new Date(), months=[];for(let i=5;i>=0;i--){months.push(new Date(now.getFullYear(),now.getMonth()-i,1))}
      const rows=months.map(m=>{const k=monthKey(m);const r=orders.filter(o=>orderIsRevenue(o)&&monthKey(toDateValue(o.createdAt)||new Date(0))===k).reduce((n,o)=>n+(Number(o.total)||0),0);const x=expenses.filter(e=>String(e.date||'').startsWith(k)).reduce((n,e)=>n+(Number(e.amount)||0),0);return {m,r,x}});const max=Math.max(1,...rows.flatMap(x=>[x.r,x.x]));chart.innerHTML=rows.map(x=>`<div class="chart-col"><div class="chart-bars"><i class="bar revenue" style="height:${Math.max(4,x.r/max*100)}%" title="${money(x.r)}"></i><i class="bar expense" style="height:${Math.max(4,x.x/max*100)}%" title="${money(x.x)}"></i></div><small>${monthLabel(x.m)}</small></div>`).join('')}
    const best=document.getElementById('bestProducts');if(best){const map={};orders.filter(orderIsRevenue).forEach(o=>(o.items||[]).forEach(i=>{const k=i.id||i.name;map[k]??={name:i.name||'Product',qty:0,revenue:0};map[k].qty+=Number(i.quantity)||0;map[k].revenue+=(Number(i.price)||0)*(Number(i.quantity)||0)}));best.innerHTML=Object.values(map).sort((a,b)=>b.qty-a.qty).slice(0,6).map((x,i)=>`<div class="ranking-row"><span>${String(i+1).padStart(2,'0')}</span><strong>${escapeHtml(x.name)}</strong><small>${x.qty} ${document.documentElement.lang==='ar'?'قطعة':'units'}</small><b>${money(x.revenue)}</b></div>`).join('')||`<div class="muted">${document.documentElement.lang==='ar'?'لا توجد مبيعات مدفوعة بعد.':'No paid sales yet.'}</div>`}
    const insights=document.getElementById('customerInsights');if(insights){const paid=orders.filter(orderIsRevenue), phones=new Set(paid.map(o=>o.customer?.phone).filter(Boolean)),avg=paid.length?paid.reduce((n,o)=>n+(Number(o.total)||0),0)/paid.length:0;const gov={};paid.forEach(o=>{const g=o.customer?.governorate||'—';gov[g]=(gov[g]||0)+1});const top=Object.entries(gov).sort((a,b)=>b[1]-a[1])[0];insights.innerHTML=`<div><span>${document.documentElement.lang==='ar'?'عملاء فريدون':'Unique customers'}</span><strong>${phones.size}</strong></div><div><span>${document.documentElement.lang==='ar'?'متوسط الطلب':'Avg. order'}</span><strong>${money(avg)}</strong></div><div><span>${document.documentElement.lang==='ar'?'أفضل محافظة':'Top governorate'}</span><strong>${escapeHtml(top?.[0]||'—')}</strong></div>`}
  }catch(e){console.error(e);showToast('تعذر تحميل البيانات المالية.','Could not load financial data.')}
}
function openExpenseModal(){document.getElementById('expenseModal')?.classList.add('open');const f=document.getElementById('expenseForm');if(f){f.reset();f.elements.date.value=new Date().toISOString().slice(0,10)}}
function closeExpenseModal(){document.getElementById('expenseModal')?.classList.remove('open')}
let explorerRows=[];
let explorerType='';
function openDataExplorer(type, rows){
  const modal=document.getElementById('dataExplorerModal'); if(!modal)return;
  explorerType=type; explorerRows=Array.isArray(rows)?rows:[];
  const ar=document.documentElement.lang==='ar';
  const title=document.getElementById('explorerTitle'),sub=document.getElementById('explorerSubtitle'),ey=document.getElementById('explorerEyebrow'),search=document.getElementById('explorerSearch');
  if(type==='orders'){ey.textContent='ORDERS DATA';title.textContent=ar?'استعراض الطلبات':'Explore orders';sub.textContent=ar?'جدول كامل للطلبات داخل لوحة التحكم — مناسب للكمبيوتر والموبايل.':'A complete in-dashboard order table — designed for desktop and mobile.';search.placeholder=ar?'ابحث برقم الطلب أو العميل أو الهاتف...':'Search by order, customer or phone...'}
  else {ey.textContent='EXPENSES DATA';title.textContent=ar?'استعراض المصروفات':'Explore expenses';sub.textContent=ar?'كل المصروفات في جدول داخلي بدون الحاجة لأي برنامج خارجي.':'All expenses in an internal table — no external spreadsheet required.';search.placeholder=ar?'ابحث باسم المصروف أو التصنيف...':'Search by expense or category...'}
  search.value=''; renderExplorerTable(); modal.classList.add('open');
}
function closeDataExplorer(){document.getElementById('dataExplorerModal')?.classList.remove('open')}
function renderExplorerTable(){
  const wrap=document.getElementById('explorerTableWrap'),count=document.getElementById('explorerCount'); if(!wrap)return;
  const ar=document.documentElement.lang==='ar',q=(document.getElementById('explorerSearch')?.value||'').trim().toLowerCase();
  const rows=explorerRows.filter(r=>!q||JSON.stringify(r).toLowerCase().includes(q));
  if(count)count.textContent=ar?`${rows.length} سجل`:`${rows.length} records`;
  if(!rows.length){wrap.innerHTML=`<div class="explorer-empty"><span>◌</span><h3>${ar?'لا توجد بيانات':'No data found'}</h3><p>${ar?'جرّبي تغيير كلمة البحث.':'Try a different search.'}</p></div>`;return}
  if(explorerType==='orders'){
    wrap.innerHTML=`<table class="data-explorer-table"><thead><tr><th>${ar?'الطلب':'Order'}</th><th>${ar?'التاريخ':'Date'}</th><th>${ar?'العميل':'Customer'}</th><th>${ar?'الهاتف':'Phone'}</th><th>${ar?'الإجمالي':'Total'}</th><th>${ar?'الحالة':'Status'}</th><th>${ar?'الدفع':'Payment'}</th></tr></thead><tbody>${rows.map(o=>`<tr><td><strong>${escapeHtml(o.orderNumber||o.id)}</strong></td><td>${escapeHtml(formatOrderDate(o.createdAt))}</td><td>${escapeHtml(o.customer?.name||'—')}</td><td dir="ltr">${escapeHtml(o.customer?.phone||'—')}</td><td><strong>${money(o.total)}</strong></td><td>${escapeHtml(o.status||'—')}</td><td>${escapeHtml(o.paymentStatus||'—')}</td></tr>`).join('')}</tbody></table>`;
  }else{
    wrap.innerHTML=`<table class="data-explorer-table"><thead><tr><th>${ar?'التاريخ':'Date'}</th><th>${ar?'المصروف':'Expense'}</th><th>${ar?'التصنيف':'Category'}</th><th>${ar?'المبلغ':'Amount'}</th><th>${ar?'ملاحظات':'Notes'}</th></tr></thead><tbody>${rows.map(e=>`<tr><td>${escapeHtml(e.date||'—')}</td><td><strong>${escapeHtml(e.title||'—')}</strong></td><td>${escapeHtml(e.category||'—')}</td><td><strong>${money(e.amount)}</strong></td><td>${escapeHtml(e.notes||'—')}</td></tr>`).join('')}</tbody></table>`;
  }
}
async function createOrder(orderData){
  try{
    const items=mergeCartStockRequests(orderData?.items||[]);
    if(!items.length) throw Object.assign(new Error('EMPTY_ORDER'),{code:'invalid-argument'});

    const governorate=String(orderData?.customer?.governorate||'').trim();
    const zone=SHIPPING_ZONES[governorate];
    if(!zone) throw Object.assign(new Error('INVALID_GOVERNORATE'),{code:'invalid-argument'});

    const productIds=[...new Set(items.map(i=>String(i.id||'')).filter(Boolean))];
    const productRefs=new Map(productIds.map(id=>[id,doc(db,'products',id)]));
    const orderRef=doc(collection(db,'orders'));
    const orderNumber=`LV-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

    await runTransaction(db,async transaction=>{
      const productSnaps=new Map();
      for(const [id,ref] of productRefs) productSnaps.set(id,await transaction.get(ref));

      const changes={};
      const trustedItems=[];

      for(const item of items){
        const snap=productSnaps.get(String(item.id||''));
        if(!snap?.exists()) throw Object.assign(new Error('PRODUCT_UNAVAILABLE'),{code:'stock_conflict'});
        const product={id:snap.id,...snap.data()};
        const variants=Array.isArray(product.variants)?product.variants.map(v=>({...v})):[];
        const color=normalizeStockColor(item.color);
        const size=String(item.size||'').trim().toUpperCase();
        const idx=variants.findIndex(v=>normalizeStockColor(v.color)===color&&String(v.size||'').trim().toUpperCase()===size);
        if(idx<0) throw Object.assign(new Error('OPTION_UNAVAILABLE'),{code:'stock_conflict'});

        const available=Math.max(0,Number(variants[idx].qty)||0);
        const wanted=Math.max(1,Number(item.quantity)||1);
        if(available<wanted){
          const e=Object.assign(new Error('STOCK_CONFLICT'),{code:'stock_conflict'});
          e.issues=[{item,available,reason:available===0?'out':'insufficient'}];
          throw e;
        }

        variants[idx].qty=available-wanted;
        const variantKey=`${normalizeStockColor(variants[idx].color)}|${String(variants[idx].size||'').trim().toUpperCase()}`;
        changes[String(item.id)]??={};
        changes[String(item.id)][variantKey]=(changes[String(item.id)][variantKey]||0)+wanted;

        trustedItems.push({
          id:item.id,
          name:String(product.name||'Product'),
          price:Math.max(0,Number(product.price)||0),
          // Firestore has a 1 MiB document limit. Never copy large base64/data-URL
          // product images into the order document. Keep only a small/normal URL.
          image:(()=>{
            const img=String(product.image||'');
            if(!img) return '';
            if(img.startsWith('data:')) return img.length<=60000 ? img : '';
            return img.length<=120000 ? img : '';
          })(),
          color:String(variants[idx].color||item.color||''),
          size:String(variants[idx].size||item.size||''),
          quantity:wanted
        });
        transaction.update(productRefs.get(String(item.id)),{
          variants,
          updatedAt:serverTimestamp(),
          lastStockOrderId:orderRef.id
        });
      }

      const subtotal=trustedItems.reduce((sum,item)=>sum+item.price*item.quantity,0);
      const shipping=zone.price;

      // Final guard against oversized order documents.
      const orderPreview={customerUid:auth.currentUser?.uid||'',customer:orderData?.customer||{},items:trustedItems,subtotal,shipping,total:subtotal+shipping,deliveryEstimate:zone.days,paymentMethod:'instapay',paymentStatus:'pending',paymentReference:String(orderData?.paymentReference||'').trim(),paymentVerified:false,stockDecremented:true,stockChanges:changes,status:'pending',orderNumber};
      if(JSON.stringify(orderPreview).length>900000){
        const e=Object.assign(new Error('ORDER_DOCUMENT_TOO_LARGE'),{code:'order_too_large'});
        throw e;
      }

      transaction.set(orderRef,{
        customerUid:auth.currentUser?.uid||'',
        customer:{
          name:String(orderData?.customer?.name||'').trim(),
          phone:String(orderData?.customer?.phone||'').trim(),
          governorate,
          address:String(orderData?.customer?.address||'').trim(),
          notes:String(orderData?.customer?.notes||'').trim()
        },
        items:trustedItems,
        subtotal,
        shipping,
        total:subtotal+shipping,
        deliveryEstimate:zone.days,
        paymentMethod:'instapay',
        paymentStatus:'pending',
        paymentReference:String(orderData?.paymentReference||'').trim(),
        paymentVerified:false,
        stockDecremented:true,
        stockChanges:changes,
        status:'pending',
        orderNumber,
        createdAt:serverTimestamp(),
        updatedAt:serverTimestamp()
      });
    });

    return {id:orderRef.id,orderNumber};
  }catch(error){
    console.error('Order placement failed:',error);
    const wrapped=new Error(error?.message||'ORDER_FAILED');
    wrapped.code=error?.code||'ORDER_FAILED';
    wrapped.details=error?.details;
    wrapped.issues=error?.issues;
    throw wrapped;
  }
}

function formatOrderDate(ts){
  if(!ts)return '—';
  const d=ts.toDate?ts.toDate():new Date(ts);
  if(Number.isNaN(d.getTime()))return '—';
  return d.toLocaleString(document.documentElement.lang==='ar'?'ar-EG':'en-EG',{dateStyle:'medium',timeStyle:'short'});
}
function orderStatusLabel(status){
  const map={
    pending:{ar:'قيد المراجعة',en:'Pending'},
    confirmed:{ar:'تم التأكيد',en:'Confirmed'},
    shipped:{ar:'تم الشحن',en:'Shipped'},
    delivered:{ar:'تم التسليم',en:'Delivered'},
    cancelled:{ar:'ملغي',en:'Cancelled'}
  };
  const x=map[status]||map.pending;
  return document.documentElement.lang==='ar'?x.ar:x.en;
}
function normalizeStockColor(value){
  const v=String(value||'').trim().toLowerCase();
  const map={
    'black':'black','أسود':'black','الأسود':'black','noir':'black',
    'champagne':'champagne','شامبين':'champagne','الشامبين':'champagne',
    'ivory':'ivory','عاجي':'ivory','العاجي':'ivory'
  };
  return map[v]||v;
}

function getVariantStockFromProduct(product,item){
  const variants=Array.isArray(product?.variants)?product.variants:[];
  const color=normalizeStockColor(item.color);
  const size=String(item.size||'').trim().toUpperCase();
  const variant=variants.find(v=>
    normalizeStockColor(v.color)===color &&
    String(v.size||'').trim().toUpperCase()===size
  );
  return variant ? Math.max(0,Number(variant.qty)||0) : 0;
}

function mergeCartStockRequests(items){
  const map=new Map();
  for(const raw of (Array.isArray(items)?items:[])){
    const item={...raw,quantity:Math.max(1,Number(raw?.quantity)||1)};
    const key=[String(item?.id||''),normalizeStockColor(item?.color),String(item?.size||'').trim().toUpperCase()].join('|');
    const prev=map.get(key);
    if(prev)prev.quantity+=item.quantity; else map.set(key,item);
  }
  return [...map.values()];
}
async function validateCartStock(items=getCartItems()){
  const list=mergeCartStockRequests(items);
  if(!list.length)return {ok:true,issues:[]};
  const ids=[...new Set(list.map(i=>String(i.id||'')).filter(Boolean))];
  const products=await Promise.all(ids.map(async id=>{
    try{
      const snap=await getDoc(doc(db,'products',id));
      return snap.exists()?{id:snap.id,...snap.data()}:null;
    }catch(error){
      console.error('Stock check failed for product',id,error);
      return null;
    }
  }));
  const productMap=new Map(products.filter(Boolean).map(p=>[p.id,p]));
  const issues=[];
  for(const item of list){
    const product=productMap.get(String(item.id||''));
    if(!product){issues.push({item,available:0,reason:'missing'});continue;}
    const available=getVariantStockFromProduct(product,item);
    if(available<item.quantity)issues.push({item,available,reason:available===0?'out':'insufficient'});
  }
  return {ok:issues.length===0,issues};
}

function stockIssueMessage(issue){
  const name=issue?.item?.name||'Product';
  const available=Number(issue?.available)||0;
  if(document.documentElement.lang==='ar'){
    if(issue?.reason==='missing')return `المنتج غير متاح حاليًا.`;
    if(available===0)return `هذا المنتج نفد من المخزون.`;
    return `الكمية المتاحة حاليًا ${available} فقط.`;
  }
  if(issue?.reason==='missing')return `This product is no longer available.`;
  if(available===0)return `This product is out of stock.`;
  return `Only ${available} units are currently available.`;
}

async function initCheckout(){
  if(!(await requireCustomerAuth()))return;
  const form=document.getElementById('checkoutForm'); if(!form)return;
  const items=getCartItems();
  const itemsEl=document.getElementById('checkoutItems'), totalEl=document.getElementById('checkoutTotal');
  const subtotalEl=document.getElementById('checkoutSubtotal'), shippingEl=document.getElementById('checkoutShipping');
  const deliveryEl=document.getElementById('deliveryEstimate');
  const deliverySummaryEl=document.getElementById('deliveryEstimateSummary');
  const governorateEl=document.getElementById('governorate');
  if(!items.length){location.href='cart.html';return;}
  if(itemsEl)itemsEl.innerHTML=items.map(i=>`<div class="checkout-item"><span>${i.name} × ${i.quantity}</span><strong>${((Number(i.price)||0)*(Number(i.quantity)||0)).toLocaleString()} EGP</strong></div>`).join('');
  const refresh=()=>{
    const totals=cartTotals(items,governorateEl?.value||'');
    if(subtotalEl)subtotalEl.textContent=`${totals.subtotal.toLocaleString()} EGP`;
    if(shippingEl)shippingEl.textContent=totals.zone?`${totals.shipping.toLocaleString()} EGP`:(document.documentElement.lang==='ar'?'اختر المحافظة':'Select governorate');
    if(totalEl)totalEl.textContent=totals.zone?`${totals.total.toLocaleString()} EGP`:`${totals.subtotal.toLocaleString()} EGP`;
    if(deliveryEl)deliveryEl.textContent=totals.zone?(document.documentElement.lang==='ar'?`التوصيل المتوقع: ${totals.zone.days}`:`Estimated delivery: ${totals.zone.days}`):(document.documentElement.lang==='ar'?'اختاري المحافظة لمعرفة مدة التوصيل':'Select a governorate to see delivery time');
    if(deliverySummaryEl)deliverySummaryEl.textContent=totals.zone?(document.documentElement.lang==='ar'?`مدة التوصيل المتوقعة: ${totals.zone.days}`:`Estimated delivery time: ${totals.zone.days}`):(document.documentElement.lang==='ar'?'سيتم حساب الشحن حسب المحافظة.':'Shipping will be calculated by governorate.');
  };
  governorateEl?.addEventListener('change',refresh); refresh();
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const submit=form.querySelector('[type=submit]');
    const f=new FormData(form);
    const selectedGovernorate=governorateEl?.selectedOptions?.[0];
    const governorate=String(selectedGovernorate?.value || f.get('governorate') || '').trim();
    if(!SHIPPING_ZONES[governorate]){showToast('اختاري المحافظة أولًا لمعرفة سعر ومدة الشحن.','Choose a governorate first to calculate shipping.');governorateEl?.focus();return;}
    if(submit)submit.disabled=true;
    try{
      const stockCheck=await validateCartStock(items);
      if(!stockCheck.ok){
        showToast(stockIssueMessage(stockCheck.issues[0]),stockIssueMessage(stockCheck.issues[0]));
        if(submit)submit.disabled=false;
        return;
      }
      const totals=cartTotals(items,governorate),zone=totals.zone;
      const orderDraft={
        customer:{name:String(f.get('name')).trim(),phone:String(f.get('phone')).trim(),governorate,address:String(f.get('address')).trim(),notes:String(f.get('notes')||'').trim()},
        items:items.map(i=>({id:i.id,name:i.name,price:Number(i.price)||0,image:i.image||'',color:i.color||'',size:i.size||'',quantity:Number(i.quantity)||1})),
        subtotal:totals.subtotal,shipping:totals.shipping,total:totals.total,deliveryEstimate:zone.days
      };
      sessionStorage.setItem('laveraCheckoutDraft',JSON.stringify(orderDraft));
      location.href='payment.html';
    }catch(err){
      console.error(err); showToast('تعذر إرسال الطلب. حاول مرة أخرى.','Could not submit the order. Please try again.');
      if(submit)submit.disabled=false;
    }
  });
}
async function getOrdersFromFirestore(){
  const snap=await getDocs(query(collection(db,'orders')));
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}
async function updateOrderStatusWithStock(orderId,newStatus){
  const orderRef=doc(db,'orders',orderId);
  await runTransaction(db,async transaction=>{
    const snap=await transaction.get(orderRef);
    if(!snap.exists())throw new Error('ORDER_NOT_FOUND');
    const order={id:snap.id,...snap.data()};
    if(order.status===newStatus)return;
    const items=mergeCartStockRequests(order.items||[]);
    const productIds=[...new Set(items.map(i=>String(i.id||'')).filter(Boolean))];
    const productRefs=new Map(productIds.map(id=>[id,doc(db,'products',id)]));
    const productSnaps=new Map();
    for(const [id,ref] of productRefs)productSnaps.set(id,await transaction.get(ref));

    const changes=new Map();
    if(newStatus==='cancelled' && order.status!=='cancelled'){
      for(const item of items){
        const ps=productSnaps.get(String(item.id||''));
        if(!ps?.exists())continue;
        const product={id:ps.id,...ps.data()};
        const variants=Array.isArray(product.variants)?product.variants.map(v=>({...v})):[];
        const idx=variants.findIndex(v=>normalizeStockColor(v.color)===normalizeStockColor(item.color)&&String(v.size||'').trim().toUpperCase()===String(item.size||'').trim().toUpperCase());
        if(idx<0)continue;
        variants[idx].qty=Math.max(0,Number(variants[idx].qty)||0)+Math.max(1,Number(item.quantity)||1);
        changes.set(ps.id,variants);
      }
    }else if(order.status==='cancelled' && newStatus!=='cancelled'){
      for(const item of items){
        const ps=productSnaps.get(String(item.id||''));
        if(!ps?.exists())throw Object.assign(new Error('STOCK_CONFLICT'),{code:'stock_conflict',issues:[{item,available:0,reason:'missing'}]});
        const product={id:ps.id,...ps.data()};
        const variants=Array.isArray(product.variants)?product.variants.map(v=>({...v})):[];
        const idx=variants.findIndex(v=>normalizeStockColor(v.color)===normalizeStockColor(item.color)&&String(v.size||'').trim().toUpperCase()===String(item.size||'').trim().toUpperCase());
        if(idx<0)throw Object.assign(new Error('STOCK_CONFLICT'),{code:'stock_conflict',issues:[{item,available:0,reason:'out'}]});
        const available=Math.max(0,Number(variants[idx].qty)||0);
        const wanted=Math.max(1,Number(item.quantity)||1);
        if(available<wanted)throw Object.assign(new Error('STOCK_CONFLICT'),{code:'stock_conflict',issues:[{item,available,reason:available===0?'out':'insufficient'}]});
        variants[idx].qty=available-wanted;
        changes.set(ps.id,variants);
      }
    }
    changes.forEach((variants,id)=>transaction.update(productRefs.get(id),{variants,updatedAt:serverTimestamp()}));
    transaction.update(orderRef,{status:newStatus,updatedAt:serverTimestamp()});
    if(order.customerUid && window.LAVERA_V2?.notifyCustomer){
      const titles={pending:['تم استلام طلبك','Order received'],paid:['تم تأكيد الدفع','Payment confirmed'],processing:['بدأ تجهيز طلبك','Your order is being prepared'],shipped:['طلبك خرج للتوصيل','Your order is out for delivery'],delivered:['تم تسليم طلبك','Order delivered'],cancelled:['تم إلغاء طلبك','Order cancelled']};
      const bodies={pending:['طلبك الآن في انتظار مراجعة الدفع.','Your order is awaiting payment review.'],paid:['تم تأكيد التحويل بنجاح.','Your payment transfer has been confirmed.'],processing:['بدأ فريق LAVÉRA تجهيز طلبك.','The LAVÉRA team has started preparing your order.'],shipped:['طلبك في الطريق إليك.','Your order is on its way.'],delivered:['شكرًا لاختياركِ LAVÉRA.','Thank you for choosing LAVÉRA.'],cancelled:['تم تحديث حالة الطلب إلى ملغى.','Your order has been marked as cancelled.']};
      const n=doc(collection(db,'notifications')); transaction.set(n,{customerUid:order.customerUid,orderId, titleAr:titles[newStatus]?.[0]||'تحديث الطلب',titleEn:titles[newStatus]?.[1]||'Order update',bodyAr:bodies[newStatus]?.[0]||'تم تحديث حالة طلبك.',bodyEn:bodies[newStatus]?.[1]||'Your order status was updated.',read:false,createdAt:serverTimestamp()});
    }
  });
}

async function renderOrders(){
  const wrap=document.getElementById('ordersList'); if(!wrap)return;
  try{
    const orders=await getOrdersFromFirestore();
    const count=document.getElementById('statOrders'); if(count)count.textContent=orders.length;
    if(!orders.length){
      wrap.innerHTML=`<div class="empty-admin"><span>□</span><h2>${document.documentElement.lang==='ar'?'لا توجد طلبات حتى الآن':'No orders yet'}</h2><p>${document.documentElement.lang==='ar'?'عندما يؤكد العميل طلبه سيظهر هنا.':'Orders will appear here after a customer checks out.'}</p></div>`;
      return;
    }
    wrap.innerHTML=`<div class="table-wrap"><table class="product-table orders-table"><thead><tr>
      <th>${document.documentElement.lang==='ar'?'الطلب':'Order'}</th><th>${document.documentElement.lang==='ar'?'العميل':'Customer'}</th>
      <th>${document.documentElement.lang==='ar'?'الإجمالي':'Total'}</th><th>${document.documentElement.lang==='ar'?'التاريخ':'Date'}</th>
      <th>${document.documentElement.lang==='ar'?'الحالة':'Status'}</th><th></th></tr></thead><tbody id="ordersTableBody"></tbody></table></div>`;
    const tbody=document.getElementById('ordersTableBody');
    orders.forEach(o=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td><strong>#${o.orderNumber||o.id.slice(0,8).toUpperCase()}</strong><small class="order-items-count">${(o.items||[]).reduce((s,i)=>s+(Number(i.quantity)||0),0)} ${document.documentElement.lang==='ar'?'قطعة':'items'}</small></td>
        <td><strong>${o.customer?.name||'—'}</strong><small>${o.customer?.phone||''}</small></td>
        <td><strong>${Number(o.total||0).toLocaleString()} EGP</strong><small>${o.paymentStatus==='paid'?'✓ '+(document.documentElement.lang==='ar'?'مدفوع':'Paid'):(document.documentElement.lang==='ar'?'في انتظار الدفع':'Payment pending')}</small></td>
        <td>${formatOrderDate(o.createdAt)}</td>
        <td><select class="order-status" data-order-id="${o.id}">
          ${['pending','confirmed','shipped','delivered','cancelled'].map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${orderStatusLabel(s)}</option>`).join('')}
        </select></td>
        <td><button type="button" class="btn btn-outline small-btn" data-view-order="${o.id}">${document.documentElement.lang==='ar'?'التفاصيل':'Details'}</button>${o.paymentStatus!=='paid'?` <button type="button" class="btn small-btn" data-pay-order="${o.id}">${document.documentElement.lang==='ar'?'تأكيد الدفع':'Mark paid'}</button>`:''}</td>`;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.order-status').forEach(sel=>sel.addEventListener('change',async()=>{
      try{await updateOrderStatusWithStock(sel.dataset.orderId,sel.value);if(window.LAVERA_SOUNDS) window.LAVERA_SOUNDS.notification(); showToast('تم تحديث حالة الطلب.','Order status updated.');}
      catch(e){console.error(e);showToast(e?.code==='stock_conflict'?'لا توجد كمية كافية لإعادة تفعيل الطلب.':'تعذر تحديث الطلب.','Could not update order.');}
    }));
    tbody.querySelectorAll('[data-pay-order]').forEach(btn=>btn.addEventListener('click',async()=>{
      if(!confirm(document.documentElement.lang==='ar'?'هل تأكدت من وصول التحويل على InstaPay؟':'Have you verified the InstaPay transfer?'))return;
      try{
        await updateDoc(doc(db,'orders',btn.dataset.payOrder),{paymentStatus:'paid',paymentVerified:true,paymentVerifiedAt:serverTimestamp(),status:'confirmed',updatedAt:serverTimestamp()});
        if(window.LAVERA_SOUNDS) window.LAVERA_SOUNDS.notification(); showToast('تم تأكيد الدفع والطلب.','Payment verified and order confirmed.');
        await renderOrders();
      }catch(e){console.error(e);showToast('تعذر تأكيد الدفع.','Could not verify payment.');}
    }));
    tbody.querySelectorAll('[data-view-order]').forEach(btn=>btn.addEventListener('click',()=>{
      if(btn.dataset.viewOrder) location.href=`order-details.html?id=${encodeURIComponent(btn.dataset.viewOrder)}`;
    }));
  }catch(e){
    console.error(e);
    wrap.innerHTML=`<div class="empty-admin"><span>!</span><h2>${document.documentElement.lang==='ar'?'تعذر تحميل الطلبات':'Could not load orders'}</h2><p>${document.documentElement.lang==='ar'?'تحقق من اتصال الموقع وحاول مرة أخرى.':'Please check your connection and try again.'}</p></div>`;
  }
}


async function getMessagesFromFirestore(){
  const snap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

function updateMessageBadge(count) {
  const badge = document.getElementById('messageBadge');
  if (!badge) return;
  badge.textContent = count > 99 ? '99+' : String(count);
  badge.hidden = count === 0;
}

function messageDate(ts) {
  if (!ts) return '—';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-EG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

async function renderMessages() {
  const wrap = document.getElementById('messagesList');
  if (!wrap) return;

  try {
    const messages = await getMessagesFromFirestore();
    const unread = messages.filter((m) => m.read !== true).length;
    updateMessageBadge(unread);

    const stat = document.getElementById('statMessages');
    if (stat) stat.textContent = unread;

    if (!messages.length) {
      wrap.innerHTML = `
        <div class="empty-admin">
          <span>✉</span>
          <h2>${document.documentElement.lang === 'ar' ? 'لا توجد رسائل' : 'No messages yet'}</h2>
          <p>${document.documentElement.lang === 'ar' ? 'عندما يرسل أحد الزوار رسالة ستظهر هنا.' : 'Messages from the contact form will appear here.'}</p>
        </div>`;
      return;
    }

    wrap.innerHTML = messages.map((message) => {
      const isUnread = message.read !== true;
      const name = message.name || (document.documentElement.lang === 'ar' ? 'زائر' : 'Visitor');
      const email = message.email || '—';
      const body = message.message || '—';
      return `
        <article class="message-card ${isUnread ? 'is-unread' : ''}" data-message-id="${message.id}">
          <div class="message-card-head">
            <div class="message-sender">
              <span class="message-avatar">${escapeHtml(name.charAt(0).toUpperCase())}</span>
              <div>
                <strong>${escapeHtml(name)}</strong>
                <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
              </div>
            </div>
            <div class="message-meta">
              ${isUnread ? `<span class="message-unread">${document.documentElement.lang === 'ar' ? 'جديدة' : 'New'}</span>` : ''}
              <time>${messageDate(message.createdAt)}</time>
            </div>
          </div>
          <p class="message-body">${escapeHtml(body)}</p>
          <div class="message-reply-box"><textarea data-reply-input="${message.id}" placeholder="اكتب رد LAVÉRA...">${escapeHtml(message.adminReply||'')}</textarea><button type="button" class="btn small-btn" data-reply-message="${message.id}">${message.adminReply?'تحديث الرد':'الرد على العميل'}</button></div>
          <div class="message-actions">
            <button type="button" class="btn btn-outline small-btn" data-toggle-message="${message.id}" data-read="${message.read === true}">
              ${message.read === true
                ? (document.documentElement.lang === 'ar' ? 'تحديد كغير مقروء' : 'Mark unread')
                : (document.documentElement.lang === 'ar' ? 'تحديد كمقروء' : 'Mark as read')}
            </button>
            <button type="button" class="btn btn-danger small-btn" data-delete-message="${message.id}">
              ${document.documentElement.lang === 'ar' ? 'حذف' : 'Delete'}
            </button>
          </div>
        </article>`;
    }).join('');

    wrap.querySelectorAll('[data-toggle-message]').forEach((button) => {
      button.addEventListener('click', async () => {
        const id = button.dataset.toggleMessage;
        try {
          await updateDoc(doc(db, 'messages', id), { read: button.dataset.read !== 'true' });
          await renderMessages();
        } catch (error) {
          console.error(error);
          showToast('تعذر تحديث حالة الرسالة.', 'Could not update the message.');
        }
      });
    });

    wrap.querySelectorAll('[data-reply-message]').forEach((button) => {
      button.addEventListener('click', async () => {
        const id=button.dataset.replyMessage; const input=wrap.querySelector(`[data-reply-input="${id}"]`); const reply=String(input?.value||'').trim();
        if(!reply){showToast('اكتب الرد أولًا.','Write a reply first.');return;}
        try{const msgSnap=await getDoc(doc(db,'messages',id));await updateDoc(doc(db,'messages',id),{adminReply:reply,adminReplyAt:serverTimestamp(),read:true});const customerUid=msgSnap.exists()?msgSnap.data().customerUid:'';if(customerUid&&window.LAVERA_V2?.notifyCustomer)await window.LAVERA_V2.notifyCustomer(customerUid,'رد جديد من LAVÉRA','New reply from LAVÉRA','فريق LAVÉRA رد على رسالتك.','The LAVÉRA team replied to your message.');await renderMessages();showToast('تم إرسال الرد للعميل.','Reply sent to customer.');if(window.LAVERA_SOUNDS)window.LAVERA_SOUNDS.notification();}
        catch(error){console.error(error);showToast('تعذر إرسال الرد.','Could not send the reply.');}
      });
    });

    wrap.querySelectorAll('[data-delete-message]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm(
          document.documentElement.lang === 'ar'
            ? 'هل تريد حذف هذه الرسالة؟'
            : 'Delete this message?'
        );
        if (!confirmed) return;
        try {
          await deleteDoc(doc(db, 'messages', button.dataset.deleteMessage));
          await renderMessages();
          showToast('تم حذف الرسالة.', 'Message deleted.');
        } catch (error) {
          console.error(error);
          showToast('تعذر حذف الرسالة.', 'Could not delete the message.');
        }
      });
    });
  } catch (error) {
    console.error(error);
    updateMessageBadge(0);
    wrap.innerHTML = `
      <div class="empty-admin">
        <span>!</span>
        <h2>${document.documentElement.lang === 'ar' ? 'تعذر تحميل الرسائل' : 'Could not load messages'}</h2>
        <p>${document.documentElement.lang === 'ar' ? 'تحقق من اتصال الموقع وحاول مرة أخرى.' : 'Please check your connection and try again.'}</p>
      </div>`;
  }
}

function openOrderModal(order) {
  const modal = document.getElementById('orderDetailsModal');
  const content = document.getElementById('orderDetailsContent');
  if (!modal || !content || !order) return;

  const ar = document.documentElement.lang === 'ar';
  const customer = order.customer || {};
  const items = order.items || [];
  const itemsHtml = items.length
    ? items.map((item) => `
      <div class="order-detail-item">
        <img src="${escapeHtml(item.image || '../Images/product-black.jpg')}" alt="">
        <div>
          <strong>${escapeHtml(item.name || 'Product')}</strong>
          <small>${escapeHtml([item.color, item.size].filter(Boolean).join(' · ') || '—')}</small>
          <span>${ar ? 'الكمية' : 'Qty'}: ${Number(item.quantity) || 0}</span>
        </div>
        <b>${(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()} EGP</b>
      </div>`).join('')
    : `<p class="muted">${ar ? 'لا توجد منتجات.' : 'No products.'}</p>`;

  content.innerHTML = `
    <div class="order-modal-head">
      <div>
        <span class="eyebrow">${ar ? 'ORDER DETAILS' : 'ORDER DETAILS'}</span>
        <h2>#${escapeHtml(order.orderNumber||order.id.slice(0, 8).toUpperCase())}</h2>
        <p>${formatOrderDate(order.createdAt)}</p>
      </div>
      <span class="status-pill ${order.status === 'cancelled' ? 'out' : ''}">${orderStatusLabel(order.status)}</span>
    </div>
    <div class="order-detail-grid">
      <section class="order-detail-block">
        <span class="option-label">${ar ? 'بيانات العميل' : 'Customer details'}</span>
        <strong>${escapeHtml(customer.name || '—')}</strong>
        <a href="tel:${escapeHtml(customer.phone || '')}">${escapeHtml(customer.phone || '—')}</a>
        <span>${escapeHtml(customer.governorate || '—')}</span>
        <span>${escapeHtml(customer.address || '—')}</span>
        ${customer.notes ? `<p>${ar ? 'ملاحظات:' : 'Notes:'} ${escapeHtml(customer.notes)}</p>` : ''}
      </section>
      <section class="order-detail-block">
        <span class="option-label">${ar ? 'الدفع والشحن' : 'Payment & shipping'}</span>
        <span>${ar ? 'طريقة الدفع' : 'Payment method'}: <strong>${order.paymentMethod === 'instapay' ? 'InstaPay' : escapeHtml(order.paymentMethod || '—')}</strong></span>
        <span>${ar ? 'حالة الدفع' : 'Payment status'}: <strong>${order.paymentStatus === 'paid' ? (ar ? 'مدفوع' : 'Paid') : (ar ? 'قيد الانتظار' : 'Pending')}</strong></span>
        ${order.paymentReference ? `<span>${ar ? 'مرجع التحويل' : 'Transfer reference'}: <strong>${escapeHtml(order.paymentReference)}</strong></span>` : ''}
        <span>${ar ? 'التوصيل المتوقع' : 'Estimated delivery'}: <strong>${escapeHtml(order.deliveryEstimate || '—')}</strong></span>
      </section>
    </div>
    <section class="order-detail-block order-items-block">
      <span class="option-label">${ar ? 'المنتجات' : 'Items'}</span>
      <div class="order-detail-items">${itemsHtml}</div>
    </section>
    <div class="order-detail-total">
      <span>${ar ? 'المنتجات' : 'Subtotal'} <b>${Number(order.subtotal || 0).toLocaleString()} EGP</b></span>
      <span>${ar ? 'الشحن' : 'Shipping'} <b>${Number(order.shipping || 0).toLocaleString()} EGP</b></span>
      <strong>${ar ? 'الإجمالي' : 'Total'} <b>${Number(order.total || 0).toLocaleString()} EGP</b></strong>
    </div>`;

  modal.classList.add('open');
}

function closeOrderModal() {
  document.getElementById('orderDetailsModal')?.classList.remove('open');
}

function getCheckoutDraft(){
  try{return JSON.parse(sessionStorage.getItem('laveraCheckoutDraft')||'null')}catch(e){return null}
}
function initPayment(){
  const page=document.getElementById('paymentPage'); if(!page)return;
  const draft=getCheckoutDraft();
  if(!draft || !Array.isArray(draft.items) || !draft.items.length){location.href='cart.html';return;}

  const totalEl=document.getElementById('paymentTotal'), itemsEl=document.getElementById('paymentItems');
  if(totalEl)totalEl.textContent=`${Number(draft.total||0).toLocaleString()} EGP`;
  if(itemsEl)itemsEl.innerHTML=draft.items.map(i=>`<div class="checkout-item"><span>${i.name} × ${i.quantity}</span><strong>${((Number(i.price)||0)*(Number(i.quantity)||0)).toLocaleString()} EGP</strong></div>`).join('');

  const ipa = window.LAVERA_INSTAPAY_IPA || 'ضع-IPA-البائع-هنا';
  const ipaEl=document.getElementById('instapayIpa');
  if(ipaEl)ipaEl.textContent=ipa;

  document.getElementById('copyIpaBtn')?.addEventListener('click',async()=>{
    try{
      await navigator.clipboard.writeText(ipa);
      showToast('تم نسخ InstaPay IPA.','InstaPay IPA copied.');
    }catch(e){
      showToast('انسخ الـ IPA يدويًا.','Please copy the IPA manually.');
    }
  });

  document.getElementById('paymentForm')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const form=e.currentTarget, btn=form.querySelector('[type=submit]');
    const reference=String(document.getElementById('paymentReference')?.value||'').trim();
    if(!reference){
      showToast('اكتبي رقم/مرجع عملية التحويل أولًا.','Enter the transfer reference first.');
      return;
    }
    if(btn)btn.disabled=true;

    try{
      const stockCheck=await validateCartStock(draft.items);
      if(!stockCheck.ok){
        showToast(stockIssueMessage(stockCheck.issues[0]),stockIssueMessage(stockCheck.issues[0]));
        if(btn)btn.disabled=false;
        return;
      }
      const orderRef=await createOrder({
        ...draft,
        paymentMethod:'instapay',
        paymentStatus:'pending',
        paymentReference:reference,
        paymentVerified:false
      });
      sessionStorage.removeItem('laveraCheckoutDraft');
      localStorage.removeItem('laveraCartItems');
      localStorage.removeItem('laveraCart');
      if(window.LAVERA_SOUNDS) window.LAVERA_SOUNDS.success();
      location.href=`checkout.html?success=${encodeURIComponent(orderRef.id)}`;
    }catch(err){
      console.error(err);
      if(err?.code==='stock_conflict' || err?.code==='functions/resource-exhausted' || err?.code==='resource-exhausted' || err?.code==='functions/failed-precondition'){
        showToast('المنتج لم يعد متاحًا بالكمية المطلوبة.','The requested quantity is no longer available.');
      }else if(err?.code==='order_too_large' || /exceeds the maximum allowed size/i.test(err?.message||'')){
        showToast('تعذر حفظ الطلب لأن بيانات الصورة كبيرة جدًا. جرّبي مرة أخرى بعد تحديث الصفحة.','The order image data is too large. Please refresh and try again.');
      }else{
        showToast('تعذر إتمام الطلب حاليًا. حاول مرة أخرى.','The order could not be completed right now. Please try again.');
      }
      if(btn)btn.disabled=false;
    }
  });
}
async function initOrderDetailsPage(){
  const page=document.getElementById('orderDetailsPage'); if(!page)return;
  if(!(await ensureAdmin()))return;
  const id=new URLSearchParams(location.search).get('id');
  const content=document.getElementById('orderPageContent');
  if(!id||!content){location.href='admin.html#orders';return;}
  try{
    const snap=await getDoc(doc(db,'orders',id));
    if(!snap.exists()){content.innerHTML=`<div class="order-page-empty"><h2>${document.documentElement.lang==='ar'?'الطلب غير موجود':'Order not found'}</h2><p>${document.documentElement.lang==='ar'?'قد يكون الطلب قد حُذف أو أن الرابط غير صحيح.':'The order may have been deleted or the link is invalid.'}</p><a class="btn" href="admin.html#orders">${document.documentElement.lang==='ar'?'العودة إلى الطلبات':'Back to orders'}</a></div>`;return;}
    renderOrderPage({id:snap.id,...snap.data()});
  }catch(e){console.error(e);content.innerHTML=`<div class="order-page-empty"><h2>${document.documentElement.lang==='ar'?'تعذر تحميل الطلب':'Could not load order'}</h2><p>${document.documentElement.lang==='ar'?'تحقق من اتصال الموقع وحاول مرة أخرى.':'Please check your connection and try again.'}</p></div>`;}
}
function renderOrderPage(order){
  const content=document.getElementById('orderPageContent');if(!content)return;
  const ar=document.documentElement.lang==='ar',customer=order.customer||{},items=order.items||[];
  const itemsHtml=items.length?items.map(item=>`<article class="order-page-item"><img src="${escapeHtml(item.image||'../Images/product-black.jpg')}" alt=""><div><strong>${escapeHtml(item.name||'Product')}</strong><span>${escapeHtml([item.color,item.size].filter(Boolean).join(' · ')||'—')}</span><small>${ar?'الكمية':'Quantity'}: ${Number(item.quantity)||0}</small></div><b>${(Number(item.price||0)*Number(item.quantity||0)).toLocaleString()} EGP</b></article>`).join(''):`<p class="muted">${ar?'لا توجد منتجات.':'No products.'}</p>`;
  content.innerHTML=`<div class="order-page-hero"><div><a class="back" href="admin.html#orders">${ar?'← العودة إلى الطلبات':'← Back to orders'}</a><span class="eyebrow">ORDER DETAILS</span><h2>#${escapeHtml(order.orderNumber||order.id.slice(0,8).toUpperCase())}</h2><p>${formatOrderDate(order.createdAt)}</p></div><span class="status-pill ${order.status==='cancelled'?'out':''}">${orderStatusLabel(order.status)}</span></div><div class="order-page-grid"><section class="order-page-card"><span class="option-label">${ar?'بيانات العميل':'Customer details'}</span><strong>${escapeHtml(customer.name||'—')}</strong><a href="tel:${escapeHtml(customer.phone||'')}">${escapeHtml(customer.phone||'—')}</a><span>${escapeHtml(customer.governorate||'—')}</span><span>${escapeHtml(customer.address||'—')}</span>${customer.notes?`<p>${ar?'ملاحظات:':'Notes:'} ${escapeHtml(customer.notes)}</p>`:''}</section><section class="order-page-card"><span class="option-label">${ar?'الدفع والشحن':'Payment & shipping'}</span><span>${ar?'طريقة الدفع':'Payment method'}: <strong>${order.paymentMethod==='instapay'?'InstaPay':escapeHtml(order.paymentMethod||'—')}</strong></span><span>${ar?'حالة الدفع':'Payment status'}: <strong>${order.paymentStatus==='paid'?(ar?'مدفوع':'Paid'):(ar?'قيد المراجعة':'Pending')}</strong></span>${order.paymentReference?`<span>${ar?'مرجع التحويل':'Transfer reference'}: <strong>${escapeHtml(order.paymentReference)}</strong></span>`:''}<span>${ar?'التوصيل المتوقع':'Estimated delivery'}: <strong>${escapeHtml(order.deliveryEstimate||'—')}</strong></span></section></div><section class="order-page-card order-page-items"><div class="order-page-section-head"><div><span class="option-label">${ar?'المنتجات':'Items'}</span><h3>${ar?'محتويات الطلب':'Order items'}</h3></div><span>${items.length} ${ar?'منتج':'items'}</span></div><div class="order-page-items-list">${itemsHtml}</div></section><section class="order-page-card"><div class="order-page-section-head"><div><span class="option-label">${ar?'ملخص الدفع':'Payment summary'}</span><h3>${ar?'إجمالي العملية':'Order total'}</h3></div></div><div class="order-page-total"><span>${ar?'المجموع الفرعي':'Subtotal'}<b>${Number(order.subtotal||0).toLocaleString()} EGP</b></span><span>${ar?'الشحن':'Shipping'}<b>${Number(order.shipping||0).toLocaleString()} EGP</b></span><strong>${ar?'الإجمالي':'Total'}<b>${Number(order.total||0).toLocaleString()} EGP</b></strong></div></section></div>`;
}

async function initDashboard(){
 if(!(await ensureAdmin()))return;
 document.querySelectorAll('[data-section]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const name=a.dataset.section;document.querySelectorAll('.dash-section').forEach(s=>s.classList.remove('active'));document.getElementById('section-'+name)?.classList.add('active');document.querySelectorAll('.dash-nav a').forEach(x=>x.classList.toggle('active',x===a));const title=document.getElementById('dashTitle'),b=a.querySelector('b');if(title&&b)title.innerHTML=b.innerHTML;history.replaceState(null,'','#'+name);document.getElementById('dashboardSidebar')?.classList.remove('open');if(name==='orders')renderOrders();if(name==='messages')renderMessages();if(name==='reviews')renderReviewsAdmin();if(name==='finance')getOrdersFromFirestore().then(renderFinance).catch(err=>console.error(err))}));
 document.querySelectorAll('[data-open-product]').forEach(b=>b.addEventListener('click',()=>openProductModal()));document.getElementById('closeProduct')?.addEventListener('click',closeProductModal);document.getElementById('cancelProduct')?.addEventListener('click',closeProductModal);document.getElementById('productModal')?.addEventListener('click',e=>{if(e.target.id==='productModal')closeProductModal()});document.getElementById('modalAddVariant')?.addEventListener('click',()=>{document.getElementById('modalVariants').appendChild(variantRow());updateModalTotal()});
 document.getElementById('closeOrderDetails')?.addEventListener('click',closeOrderModal);document.getElementById('orderDetailsModal')?.addEventListener('click',(e)=>{if(e.target.id==='orderDetailsModal')closeOrderModal()});document.getElementById('dashboardProductForm')?.addEventListener('submit',async e=>{
  e.preventDefault();

  const f=new FormData(e.currentTarget);
  const id=String(f.get('id')||('p-'+Date.now()));

  const variants=[...document.querySelectorAll('#modalVariants .dash-variant-row')]
    .map(r=>({
      color:r.querySelector('[name=vcolor]').value.trim(),
      size:r.querySelector('[name=vsize]').value,
      qty:Math.max(
        0,
        Number(r.querySelector('[name=vqty]').value)||0
      )
    }))
    .filter(v=>v.color);

  const imageFile=f.get('image');

  let image='';

  /*
   * تحويل الصورة المختارة من الجهاز
   * إلى Data URL حتى يمكن حفظها داخل Firestore
   */
  if(imageFile instanceof File && imageFile.size>0){

    image=await new Promise((resolve,reject)=>{

      const reader=new FileReader();

      reader.onload=()=>{
        resolve(reader.result);
      };

      reader.onerror=()=>{
        reject(reader.error);
      };

      reader.readAsDataURL(imageFile);

    });
  }

  /*
   * لو بنعدل منتج قديم ومختارناش صورة جديدة،
   * نحتفظ بالصورة القديمة.
   */
  if(!image && f.get('id')){

    const oldProducts=await getProductsFromFirestore();

    const oldProduct=oldProducts.find(
      p=>p.id===id
    );

    image=oldProduct?.image||'';
  }

  const product={
    name:String(f.get('name')).trim(),
    price:Number(f.get('price'))||0,
    category:f.get('category'),

    image:image,

    images:String(f.get('images')||'')
      .split(/\n+/)
      .map(x=>x.trim())
      .filter(Boolean),

    variants,

    published:true,

    updatedAt:serverTimestamp()
  };

  try{

    if(f.get('id')){

      await updateDoc(
        doc(db,'products',id),
        product
      );

    }else{

      await setDoc(
        doc(db,'products',id),
        {
          ...product,
          createdAt:serverTimestamp()
        }
      );

    }

    closeProductModal();

    await renderDashboard();

    showToast(
      f.get('id')
        ? 'تم تعديل المنتج بنجاح.'
        : 'تمت إضافة المنتج بنجاح.',
      'Product saved successfully.'
    );

  }catch(err){

    console.error(err);

    showToast(
      'تعذر حفظ المنتج حاليًا.',
      'The product could not be saved right now.'
    );

  }

});
 document.getElementById('productSearch')?.addEventListener('input',()=>renderDashboard());
 document.getElementById('openExpense')?.addEventListener('click',openExpenseModal);document.getElementById('closeExpense')?.addEventListener('click',closeExpenseModal);document.getElementById('cancelExpense')?.addEventListener('click',closeExpenseModal);document.getElementById('expenseModal')?.addEventListener('click',e=>{if(e.target.id==='expenseModal')closeExpenseModal()});document.getElementById('expenseForm')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.currentTarget);try{await addDoc(collection(db,'expenses'),{title:String(f.get('title')).trim(),amount:Number(f.get('amount'))||0,category:String(f.get('category')),date:String(f.get('date')),notes:String(f.get('notes')||'').trim(),createdAt:serverTimestamp()});closeExpenseModal();await renderFinance(await getOrdersFromFirestore());showToast('تم تسجيل المصروف.','Expense saved.')}catch(err){console.error(err);showToast('تعذر حفظ المصروف.','Could not save expense.')}});
 document.getElementById('exploreOrders')?.addEventListener('click',async()=>{const os=await getOrdersFromFirestore();openDataExplorer('orders',os)});
 document.getElementById('exploreExpenses')?.addEventListener('click',async()=>{const es=await getExpensesFromFirestore();openDataExplorer('expenses',es)});
 document.getElementById('closeDataExplorer')?.addEventListener('click',closeDataExplorer);document.getElementById('dataExplorerModal')?.addEventListener('click',e=>{if(e.target.id==='dataExplorerModal')closeDataExplorer()});document.getElementById('explorerSearch')?.addEventListener('input',renderExplorerTable);document.getElementById('productFilter')?.addEventListener('change',()=>renderDashboard());document.getElementById('logoutBtn')?.addEventListener('click',async()=>{await signOut(auth);location.href='admin-login.html'});document.getElementById('dashMenu')?.addEventListener('click',()=>document.getElementById('dashboardSidebar')?.classList.toggle('open'));const hash=location.hash.replace('#','');if(hash){const a=document.querySelector(`[data-section="${hash}"]`);a?.click()};await renderDashboard();
  await renderOrders();
  await renderMessages();
  await renderReviewsAdmin();
}
function getWishlist(){try{return JSON.parse(localStorage.getItem('laveraWishlist')||'[]')}catch{return []}}
async function loadCustomerProfile(){
 if(!currentCustomer)return null;
 try{
   const snap=await getDoc(customerProfileRef(currentCustomer.uid));
   if(snap.exists()){
     const d=snap.data();
     if(Array.isArray(d.wishlist))localStorage.setItem('laveraWishlist',JSON.stringify(d.wishlist));
     return d;
   }
 }catch(e){console.error('Customer profile load failed',e)}
 return null;
}
async function persistCustomerProfile(patch={}){
 if(!currentCustomer)return;
 try{await setDoc(customerProfileRef(currentCustomer.uid),{uid:currentCustomer.uid,email:currentCustomer.email||'',updatedAt:serverTimestamp(),...patch},{merge:true})}
 catch(e){console.error('Customer profile save failed',e)}
}
async function toggleWishlist(id){
 if(!requireCustomerAuth())return false;
 const a=getWishlist(),i=a.indexOf(id);if(i>=0)a.splice(i,1);else a.push(id);
 localStorage.setItem('laveraWishlist',JSON.stringify(a));
 await persistCustomerProfile({wishlist:a});
 return i<0;
}
function syncWishlistButtons(){const a=getWishlist();document.querySelectorAll('[data-wishlist]').forEach(b=>{const on=a.includes(b.dataset.wishlist);b.textContent=on?'♥':'♡';b.classList.toggle('active',on)})}
function initWishlist(){document.addEventListener('click',async e=>{const b=e.target.closest('[data-wishlist]');if(!b)return;e.preventDefault();e.stopPropagation();if(await toggleWishlist(b.dataset.wishlist)){syncWishlistButtons();showToast('تمت إضافة القطعة إلى المفضلة.','Added to wishlist.')}else{syncWishlistButtons();showToast('تم تحديث المفضلة.','Wishlist updated.')}})}
async function initWishlistPage(){if(!(await requireCustomerAuth()))return;const grid=document.getElementById('wishlistGrid');if(!grid)return;const ids=getWishlist();if(!ids.length){grid.innerHTML='<div class="empty-admin" style="grid-column:1/-1"><span>♡</span><h2>'+ (document.documentElement.lang==='ar'?'قائمتك فارغة':'Your wishlist is empty') +'</h2><p>'+ (document.documentElement.lang==='ar'?'أضيفي المنتجات التي تحبينها من المتجر.':'Save products from the shop to see them here.') +'</p></div>';return;}onSnapshot(query(collection(db,'products'),orderBy('createdAt','desc')),psnap=>{const products=psnap.docs.map(d=>({id:d.id,...d.data()}));const ids=getWishlist();const items=products.filter(p=>ids.includes(p.id));grid.innerHTML=items.map(p=>'<article class="product"><button type="button" class="wishlist-btn active" data-wishlist="'+escapeHtml(p.id)+'">♥</button><a href="product.html?id='+encodeURIComponent(p.id)+'"><div class="product-image"><img src="'+escapeHtml(p.image||'../Images/product-black.jpg')+'" alt="'+escapeHtml(p.name||'')+'"></div></a><div class="product-info"><span>'+escapeHtml(categoryLabel(p.category))+'</span><h3>'+escapeHtml(p.name||'')+'</h3><p>'+money(p.price)+'</p><div class="product-actions"><a class="btn" href="product.html?id='+encodeURIComponent(p.id)+'">'+(document.documentElement.lang==='ar'?'عرض المنتج':'View product')+' ↗</a></div></div></article>').join('')||'<div class="empty-admin" style="grid-column:1/-1"><h2>'+ (document.documentElement.lang==='ar'?'لم تعد بعض القطع متاحة':'Some saved pieces are no longer available') +'</h2></div>';},e=>console.error(e));}
function initShopFromFirestore(){
 const grid=document.querySelector('.shop-grid');if(!grid)return;
 onSnapshot(query(collection(db,'products'),orderBy('createdAt','desc')),snap=>{const products=snap.docs.map(d=>({id:d.id,...d.data()}));if(!products.length)return;grid.innerHTML='';const frag=document.createDocumentFragment();
 products.filter(p=>p.published!==false).forEach(p=>{const card=document.createElement('article');card.className='product';card.dataset.category=p.category||'';const stock=totalStock(p),out=stock===0,stockText=out?(document.documentElement.lang==='ar'?'نفد المخزون':'OUT OF STOCK'):(stock<=5?(document.documentElement.lang==='ar'?`متبقي ${stock} قطع`:`Only ${stock} left`):(document.documentElement.lang==='ar'?`متوفر — ${stock} قطع`:`In stock — ${stock} pieces`));card.innerHTML=`<button type="button" class="wishlist-btn" data-wishlist="${p.id}" aria-label="Wishlist">♡</button><a href="product.html?id=${encodeURIComponent(p.id)}"><div class="product-image"><span class="product-badge">${out?(document.documentElement.lang==='ar'?'نفد المخزون':'OUT OF STOCK'):(p.badge||'NEW')}</span><img loading="lazy" decoding="async" src="${p.image||'../Images/product-black.jpg'}" alt="${p.name||''}"></div></a><div class="product-info"><span>${out?(document.documentElement.lang==='ar'?'غير متوفر':'Unavailable'):stockText}</span><h3>${p.name||''}</h3><p>${Number(p.price||0).toLocaleString()} EGP</p><div class="product-actions"><a class="btn" href="product.html?id=${encodeURIComponent(p.id)}"><span data-ar="عرض المنتج" data-en="View product">عرض المنتج</span> ↗</a></div></div>`;if(out)card.classList.add('is-out-of-stock');frag.appendChild(card)});grid.appendChild(frag);
 const countEl=document.querySelector('.toolbar>span');if(countEl)countEl.textContent=`${products.length.toString().padStart(2,'0')} PRODUCTS`;applyLang(document.documentElement.lang);syncWishlistButtons();const f=document.querySelector('.filters button.active,.filters button.selected');if(f)applyShopFilter(f.dataset.filter||'all');
 },err=>console.error(err));
}
async function renderReviewsAdmin(){const wrap=document.getElementById('reviewsAdminList');if(!wrap)return;try{const snap=await getDocs(collection(db,'reviews'));const rs=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));const pending=rs.filter(r=>r.approved!==true);const badge=document.getElementById('reviewBadge');if(badge){badge.textContent=pending.length;badge.hidden=pending.length===0}wrap.innerHTML=pending.length?pending.map(r=>`<article class="message-card"><div class="message-card-head"><div class="message-sender"><span class="message-avatar">★</span><div><strong>${escapeHtml(r.name||'Customer')}</strong><small>${escapeHtml(r.productId||'')}</small></div></div><div class="message-meta"><span>${'★'.repeat(Number(r.rating)||5)}</span></div></div><p class="message-body">${escapeHtml(r.comment||'')}</p><div class="message-actions"><button class="btn small-btn" data-approve-review="${r.id}">${document.documentElement.lang==='ar'?'نشر التقييم':'Approve & publish'}</button><button class="btn btn-danger small-btn" data-delete-review="${r.id}">${document.documentElement.lang==='ar'?'حذف':'Delete'}</button></div></article>`).join(''):`<div class="empty-admin"><span>✓</span><h2>${document.documentElement.lang==='ar'?'لا توجد تقييمات معلقة':'No pending reviews'}</h2><p>${document.documentElement.lang==='ar'?'كل التقييمات تمت مراجعتها.':'All reviews have been moderated.'}</p></div>`;wrap.querySelectorAll('[data-approve-review]').forEach(b=>b.onclick=async()=>{await updateDoc(doc(db,'reviews',b.dataset.approveReview),{approved:true,approvedAt:serverTimestamp()});await renderReviewsAdmin();showToast('تم نشر التقييم.','Review published.')});wrap.querySelectorAll('[data-delete-review]').forEach(b=>b.onclick=async()=>{if(!confirm(document.documentElement.lang==='ar'?'حذف التقييم؟':'Delete review?'))return;await deleteDoc(doc(db,'reviews',b.dataset.deleteReview));await renderReviewsAdmin();showToast('تم حذف التقييم.','Review deleted.')})}catch(e){console.error(e)}}
function bindReviewForm(page,productId){
 const form=page?.querySelector('#reviewForm');if(!form||form.dataset.bound)return;
 form.dataset.bound='1';
 let submitting=false;
 form.addEventListener('submit',async e=>{
  e.preventDefault();e.stopImmediatePropagation();
  if(submitting)return;
  const f=new FormData(form);
  const name=String(f.get('name')||'').trim();
  const comment=String(f.get('comment')||'').trim();
  const rating=Number(f.get('rating'));
  const btn=form.querySelector('[type="submit"]');
  if(!name||!comment){
   showToast('من فضلك اكتبي اسمكِ والتقييم.','Please enter your name and review.');
   (!name?form.elements.namedItem('name'):form.elements.namedItem('comment'))?.focus();
   return;
  }
  if(!Number.isInteger(rating)||rating<1||rating>5){
   showToast('اختاري تقييمًا من نجمة إلى 5 نجوم.','Please choose a rating from 1 to 5 stars.');
   form.elements.namedItem('rating')?.focus();
   return;
  }
  submitting=true;
  if(btn){btn.disabled=true;btn.setAttribute('aria-busy','true');}
  try{
   if(!(await requireCustomerAuth()))return;
   await addDoc(collection(db,'reviews'),{customerUid:currentCustomer.uid,productId,name,rating,comment,approved:false,createdAt:serverTimestamp()});
   form.reset();
   if(window.LAVERA_SOUNDS) window.LAVERA_SOUNDS.notification();
   showToast('تم إرسال تقييمك للمراجعة.','Your review was sent for approval.');
  }catch(err){
   console.error('Review submission failed:',err);
   showToast('تعذر إرسال التقييم. تحققي من الاتصال وحاولي مرة أخرى.','Could not submit the review. Check your connection and try again.');
  }finally{
   submitting=false;
   if(btn){btn.disabled=false;btn.removeAttribute('aria-busy');}
  }
 });
}
async function initReviews(page,productId){
 const wrap=page.querySelector('#reviewsList');if(!wrap)return;const ar=document.documentElement.lang==='ar';
 bindReviewForm(page,productId);
 if(wrap._unsub)wrap._unsub();wrap._unsub=onSnapshot(query(collection(db,'reviews'),where('approved','==',true)),snap=>{const reviews=snap.docs.map(d=>({id:d.id,...d.data()})).filter(r=>r.productId===productId);wrap.innerHTML=reviews.length?reviews.map(r=>`<article class="review-card"><div><strong>${escapeHtml(r.name|| (ar?'عميلة':'Customer'))}</strong><span>${'★'.repeat(Math.max(1,Math.min(5,Number(r.rating)||5)))}</span></div><p>${escapeHtml(r.comment||'')}</p></article>`).join(''):`<p class="muted">${ar?'كوني أول من يشارك رأيه.':'Be the first to leave a review.'}</p>`;
 },e=>console.error(e));
}
async function initProductFromFirestore(){
 const page=document.querySelector('.product-page');if(!page)return;const id=new URLSearchParams(location.search).get('id');if(!id)return;
 try{const snap=await getDoc(doc(db,'products',id));if(!snap.exists())return;const p={id:snap.id,...snap.data()};let first=true;onSnapshot(doc(db,'products',id),ns=>{if(first){first=false;return}if(!ns.exists())return;const np={id:ns.id,...ns.data()};page._product=np;const n=page.querySelector('.detail-copy h1'),pr=page.querySelector('.price'),im=page.querySelector('.detail-art img');if(n)n.textContent=np.name||'';if(pr)pr.textContent=`${Number(np.price||0).toLocaleString()} EGP`;if(im&&np.image&&im.getAttribute('src')!==np.image)im.src=np.image;updateVariantStock();});const img=page.querySelector('.detail-art img'),name=page.querySelector('.detail-copy h1'),price=page.querySelector('.price');if(img){img.src=p.image||'../Images/product-black.jpg';img.alt=p.name||''}if(name)name.textContent=p.name||'';if(price)price.textContent=`${Number(p.price||0).toLocaleString()} EGP`;page._product=p;
  const sizes=[...new Set((p.variants||[]).map(v=>v.size))],colors=[...new Set((p.variants||[]).map(v=>v.color))],sizeWrap=page.querySelector('.sizes'),colorWrap=page.querySelector('.color-options');
  if(sizeWrap)sizeWrap.innerHTML=(sizes.length?sizes:['S','M','L','XL']).map((s,i)=>`<button type="button" class="${i===0?'selected':''}">${s}</button>`).join('');
  const gallery=page.querySelector('.product-gallery');if(gallery){const imgs=[p.image,...(p.images||[])].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i);gallery.innerHTML=imgs.map((src,i)=>`<button type="button" class="gallery-thumb ${i===0?'active':''}" data-gallery-src="${escapeHtml(src)}"><img src="${escapeHtml(src)}" alt="${escapeHtml(p.name||'')}"></button>`).join('');gallery.querySelectorAll('[data-gallery-src]').forEach(b=>b.onclick=()=>{img.src=b.dataset.gallerySrc;gallery.querySelectorAll('.gallery-thumb').forEach(x=>x.classList.toggle('active',x===b))})}
  initReviews(page,p.id);
  if(colorWrap)colorWrap.innerHTML=(colors.length?colors:['شامبين']).map((c,i)=>`<button type="button" class="color-option ${i===0?'selected':''}" data-color="${c}" style="--c:#d9c5a1" aria-label="${c}"><i></i><span>${c}</span></button>`).join('');
  initProductPage();
 }catch(e){console.error(e)}
}
async function initCustomerAccount(){
 const root=document.getElementById('customerAccount');if(!root)return;
 const loginView=document.getElementById('accountLoginView'),dash=document.getElementById('accountDashboard');
 const loginForm=document.getElementById('customerLoginForm'),signupForm=document.getElementById('customerSignupForm');
 const googleBtn=document.getElementById('customerGoogleLogin');
 const setStatus=(msg,en)=>showToast(msg,en);
 async function enter(user){
   currentCustomer=user; await persistCustomerProfile({email:user.email||'',name:user.displayName||''}); await loadCustomerProfile();
   loginView.hidden=true;dash.hidden=false; updateAccountLinks(); await renderCustomerAccount();
 }
 loginForm?.addEventListener('submit',async e=>{e.preventDefault();try{const f=new FormData(loginForm);const c=await signInWithEmailAndPassword(auth,String(f.get('email')).trim(),String(f.get('password')));await enter(c.user)}catch(err){console.error(err);setStatus('بيانات الدخول غير صحيحة.','Incorrect email or password.')}});
 signupForm?.addEventListener('submit',async e=>{e.preventDefault();try{const f=new FormData(signupForm);const email=String(f.get('email')).trim(),password=String(f.get('password')),name=String(f.get('name')).trim();if(password.length<6){setStatus('كلمة المرور يجب أن تكون 6 أحرف على الأقل.','Password must be at least 6 characters.');return}const c=await createUserWithEmailAndPassword(auth,email,password);await persistCustomerProfile({name,email,phone:String(f.get('phone')||'').trim(),wishlist:getWishlist()});await enter(c.user)}catch(err){console.error(err);setStatus('تعذر إنشاء الحساب. قد يكون البريد مستخدمًا بالفعل.','Could not create the account. The email may already be in use.')}});
 googleBtn?.addEventListener('click',async()=>{try{const c=await signInWithPopup(auth,googleProvider);await enter(c.user)}catch(err){console.error(err);setStatus('تعذر تسجيل الدخول بحساب Google.','Google sign-in failed.')}});
 document.getElementById('accountLogout')?.addEventListener('click',async()=>{await signOut(auth);currentCustomer=null;loginView.hidden=false;dash.hidden=true;updateAccountLinks();});
 onAuthStateChanged(auth,async user=>{if(user && root.dataset.booted!=='1'){root.dataset.booted='1';await enter(user)}else if(!user){loginView.hidden=false;dash.hidden=true;}});
}
async function renderCustomerAccount(){
 const nameEl=document.getElementById('accountName'),emailEl=document.getElementById('accountEmail'),avatar=document.getElementById('accountAvatar');
 if(!currentCustomer)return;const profile=await loadCustomerProfile()||{};if(nameEl)nameEl.textContent=profile.name||currentCustomer.displayName||'LAVÉRA Client';if(emailEl)emailEl.textContent=currentCustomer.email||profile.email||'';if(avatar)avatar.textContent=(profile.name||currentCustomer.displayName||'L').trim().charAt(0).toUpperCase();
 const orderWrap=document.getElementById('customerOrdersList'),msgWrap=document.getElementById('customerMessagesList');
 if(window._accUnsubs)window._accUnsubs.forEach(u=>u());window._accUnsubs=[];
 try{window._accUnsubs.push(onSnapshot(query(collection(db,'orders'),where('customerUid','==',currentCustomer.uid)),osnap=>{const os=osnap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));if(orderWrap)orderWrap.innerHTML=os.length?os.map(o=>`<article class="account-list-card"><div><span class="eyebrow">${escapeHtml(o.orderNumber||o.id.slice(0,8).toUpperCase())}</span><strong>${money(o.total)}</strong><small>${formatOrderDate(o.createdAt)}</small></div><b>${escapeHtml(orderStatusLabel(o.status))}</b></article>`).join(''):`<div class="empty-admin"><span>□</span><h2>لا توجد طلبات بعد</h2><p>ستظهر طلباتك هنا بعد إتمام الشراء.</p></div>`;},e=>console.error(e)));}catch(e){console.error(e)}
 try{window._accUnsubs.push(onSnapshot(query(collection(db,'messages'),where('customerUid','==',currentCustomer.uid)),msnap=>{const ms=msnap.docs.map(d=>({id:d.id,...d.data()}));if(msgWrap)msgWrap.innerHTML=ms.length?ms.map(m=>`<article class="account-message"><div class="message-card-head"><strong>${messageDate(m.createdAt)}</strong>${m.adminReply?'<span class="message-unread">تم الرد</span>':''}</div><p>${escapeHtml(m.message||'')}</p>${m.adminReply?`<div class="admin-reply"><small>LAVÉRA</small><p>${escapeHtml(m.adminReply)}</p></div>`:`<div class="muted">في انتظار رد فريق LAVÉRA.</div>`}</article>`).join(''):`<div class="empty-admin"><span>✉</span><h2>لا توجد رسائل</h2><p>يمكنك التواصل معنا من صفحة تواصل معنا.</p></div>`;},e=>console.error(e)));}catch(e){console.error(e)}
}
document.addEventListener('DOMContentLoaded',()=>{
 updateThemeIcon();applyLang(localStorage.getItem('laveraLang')||'ar');
 document.getElementById('themeBtn')?.addEventListener('click',setTheme);
 document.getElementById('langBtn')?.addEventListener('click',()=>showLanguageTransition(document.documentElement.lang==='ar'?'en':'ar'));
 document.getElementById('menuBtn')?.addEventListener('click',()=>document.getElementById('mobileMenu')?.classList.toggle('open'));
 initPageNavigationTransitions();initWishlist();document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>applyShopFilter(b.dataset.filter||'all')));document.getElementById('shopSearch')?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.shop-grid .product').forEach(c=>c.hidden=q&&!c.textContent.toLowerCase().includes(q))});
 const form=document.querySelector('.contact-form');
 if(form){
   if(currentCustomer){loadCustomerProfile().then(profile=>{const fields=form.querySelectorAll('input,textarea');if(fields[0]&&!fields[0].value)fields[0].value=profile?.name||currentCustomer.displayName||'';if(fields[1]&&!fields[1].value)fields[1].value=currentCustomer.email||profile?.email||''})}
   form.addEventListener('submit',async(e)=>{e.preventDefault();if(!(await requireCustomerAuth()))return;const btn=form.querySelector('[type=submit]'),fields=form.querySelectorAll('input,textarea');if(btn)btn.disabled=true;try{await addDoc(collection(db,'messages'),{customerUid:currentCustomer.uid,name:String(fields[0]?.value||'').trim(),email:String(fields[1]?.value||'').trim(),message:String(fields[2]?.value||'').trim(),read:false,adminReply:'',createdAt:serverTimestamp()});await persistCustomerProfile({name:String(fields[0]?.value||'').trim(),phone:profilePhoneForSave()});if(window.LAVERA_SOUNDS)window.LAVERA_SOUNDS.notification();showToast('شكرًا لكِ، تم إرسال رسالتكِ.','Thank you. Your message has been sent.');form.reset()}catch(error){console.error(error);showToast('تعذر إرسال الرسالة. حاولي مرة أخرى.','Could not send the message. Please try again.')}finally{if(btn)btn.disabled=false}});
 }
 function profilePhoneForSave(){return '';}

 if(document.querySelector('.product-page'))initProductPage();
 if(document.getElementById('checkoutForm'))initCheckout();
 if(document.getElementById('paymentPage'))initPayment();
 if(document.querySelector('.admin-page'))initAdmin();
 updateAccountLinks();
 if(document.getElementById('customerAccount'))initCustomerAccount();
 updateCart();
 if(document.getElementById('adminLoginForm'))initAdminLogin();
 if(document.body.classList.contains('dashboard-body') && document.querySelector('.dashboard-shell'))initDashboard();
 if(document.getElementById('orderDetailsPage'))initOrderDetailsPage();
 if(document.querySelector('.shop-grid'))initShopFromFirestore();if(document.getElementById('wishlistGrid'))initWishlistPage();
 const reviewPage=document.querySelector('.product-page');if(reviewPage){const reviewProductId=new URLSearchParams(location.search).get('id');if(reviewProductId)bindReviewForm(reviewPage,reviewProductId);}
 if(document.querySelector('.product-page'))initProductFromFirestore();
});
})();
