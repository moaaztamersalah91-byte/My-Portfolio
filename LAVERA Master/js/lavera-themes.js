/* LAVÉRA Theme Studio — visual only. Persists choice in localStorage. */
(()=>{
const d=document,root=d.documentElement;
const THEMES=[
['bloom','زهرة','Bloom','#fff7f3','#ff4f7b','#ff9a6c','#2a1a2e'],
['noir','نوار ذهبي','Noir Gold','#0c0a08','#d4ac62','#f3dfae','#f2ebdf'],
['mint','نعناع','Mint','#f3fcf8','#12b886','#4dd7c8','#0f2e26'],
['lavender','لافندر','Lavender','#faf7ff','#8b5cf6','#d946ef','#241a3d'],
['sunset','غروب','Sunset','#fff8ee','#ff6a3d','#ffc233','#3a1f10'],
['ocean','محيط','Ocean','#f2f8ff','#0a84ff','#00d4c8','#0b2240'],
['mono','مينيمال','Mono','#fafafa','#111111','#888888','#0a0a0a'],
['editorial','مجلة','Editorial','#f7f1e8','#8c5a3c','#c08a5c','#2b211a'],
['cyber','نيون','Cyber','#07070f','#ff2bd6','#00e5ff','#eef0ff'],
['velvet','مخمل','Velvet','#14070c','#e8a0b0','#f6cfa0','#fbeaee']];
const SIZES=[['S',.88],['M',1],['L',1.12]];
const get=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const set=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
// extra fonts
const l=d.createElement('link');l.rel='stylesheet';
l.href='https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=Cormorant+Garamond:wght@400;500;600&family=DM+Serif+Display&family=Fraunces:wght@500;600;700&family=Jost:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&family=Playfair+Display:wght@500;700&family=Space+Grotesk:wght@500;700&family=Amiri:wght@400;700&display=swap';
d.head.appendChild(l);
const ar=()=>(root.lang||'ar').startsWith('ar');
let cur=get('lv-style')||'bloom',ts=parseFloat(get('lv-ts')||'1');
if(!THEMES.some(t=>t[0]===cur))cur='bloom';
const apply=(id,flash)=>{
  if(flash){root.classList.add('ts-sw');const f=d.createElement('div');f.className='ts-flash';d.body.appendChild(f);setTimeout(()=>{f.remove();root.classList.remove('ts-sw')},750)}
  cur=id;root.dataset.style=id;set('lv-style',id);
  d.querySelectorAll('.ts-card').forEach(c=>c.classList.toggle('on',c.dataset.id===id));
};
const applyTs=v=>{ts=v;root.style.setProperty('--ts',v);set('lv-ts',v);d.querySelectorAll('.ts-seg button').forEach(b=>b.classList.toggle('on',parseFloat(b.dataset.v)===v))};
root.dataset.style=cur;root.style.setProperty('--ts',ts);
const build=()=>{
  const A=ar();
  const tab=d.createElement('button');tab.className='ts-tab';tab.setAttribute('aria-label','Theme Studio');
  tab.innerHTML='<i>🎨</i><span>'+(A?'ستوديو التصميم':'Theme Studio')+'</span>';
  const p=d.createElement('aside');p.className='ts-panel';
  p.innerHTML='<div class="ts-head"><div><b>Theme Studio</b><small>'+(A?'اختاري ستايل الموقع — يتحفظ تلقائيًا':'Pick your style — saved automatically')+'</small></div><button class="ts-x" aria-label="close">✕</button></div>'
  +'<div class="ts-grid">'+THEMES.map(t=>'<button class="ts-card" data-id="'+t[0]+'"><div class="ts-pv" style="background:'+t[3]+'"><u style="background:'+t[6]+'"></u><i class="p1" style="background:linear-gradient(135deg,'+t[4]+','+t[5]+')"></i><i class="p2" style="background:'+t[4]+'"></i></div>'+(A?t[1]:t[2])+'</button>').join('')+'</div>'
  +'<div class="ts-row"><span>'+(A?'حجم الخط':'Text size')+'</span><div class="ts-seg">'+SIZES.map(s=>'<button data-v="'+s[1]+'">'+s[0]+'</button>').join('')+'</div></div>'
  +'<div class="ts-actions"><button class="go" id="tsRnd">'+(A?'🎲 فاجئني':'🎲 Surprise me')+'</button><button id="tsReset">'+(A?'إعادة ضبط':'Reset')+'</button></div>';
  d.body.append(tab,p);
  const open=v=>p.classList.toggle('open',v);
  tab.onclick=()=>open(!p.classList.contains('open'));
  p.querySelector('.ts-x').onclick=()=>open(false);
  d.addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
  p.querySelectorAll('.ts-card').forEach(c=>c.onclick=()=>apply(c.dataset.id,true));
  p.querySelectorAll('.ts-seg button').forEach(b=>b.onclick=()=>applyTs(parseFloat(b.dataset.v)));
  p.querySelector('#tsRnd').onclick=()=>{let n;do{n=THEMES[Math.floor(Math.random()*THEMES.length)][0]}while(n===cur);apply(n,true)};
  p.querySelector('#tsReset').onclick=()=>{apply('bloom',true);applyTs(1)};
  apply(cur,false);applyTs(ts);
};
d.readyState==='loading'?d.addEventListener('DOMContentLoaded',build):build();
})();
