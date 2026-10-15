// Shared Firebase customer workflows. No local demo submission fallback.
import {auth,db,onAuthStateChanged} from '../firebase/client.js';
import {collection,doc,addDoc,setDoc,onSnapshot,serverTimestamp,runTransaction,query,where} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
const state=window.TasteLive={user:null,userProfile:null,orders:[],reservations:[],messages:[],ready:false,error:''};
let unsub=[];
const signal=()=>window.dispatchEvent(new Event('tastehouse:live'));
const own=(name)=>onSnapshot(query(collection(db,name),where('userId','==',state.user.uid)),snap=>{state[name]=snap.docs.filter(d=>d.data().userId===state.user?.uid).map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));signal()},err=>{state.error=err.message;signal()});
onAuthStateChanged(auth,u=>{
 unsub.forEach(f=>f());unsub=[];state.user=u;state.userProfile=null;state.orders=[];state.reservations=[];state.messages=[];state.ready=true;state.error='';
 if(u){
  for(const key of ['orders','reservations','messages'])unsub.push(own(key));
  // Keep the customer's profile live and create a minimal profile the first time they sign in.
  const profileRef=doc(db,'customers',u.uid);let bootstrapped=false;
  unsub.push(onSnapshot(profileRef,snap=>{
   if(snap.exists()){state.userProfile={id:snap.id,...snap.data()};signal();return;}
   state.userProfile={id:u.uid,displayName:u.displayName||'',email:u.email||'',phone:''};signal();
   if(!bootstrapped){bootstrapped=true;setDoc(profileRef,{displayName:u.displayName||'',email:u.email||'',phone:'',updatedAt:serverTimestamp()}).catch(err=>{state.error=err.message;signal();});}
  },err=>{state.error=err.message;signal();}));
 }
 signal();
});
const required=()=>{if(!auth.currentUser)throw Error('Please sign in first / يجب تسجيل الدخول أولاً');return auth.currentUser};
const clean=(v,max=250)=>String(v||'').trim().slice(0,max);
state.checkout=async(values,basket)=>{
 const user=required(),entries=Object.entries(basket).filter(([,q])=>Number.isSafeInteger(q)&&q>0&&q<=30);
 if(!entries.length||entries.length!==Object.keys(basket).length||entries.length>25)throw Error('Invalid or empty cart');
 const ref=doc(collection(db,'orders'));
 await runTransaction(db,async tx=>{
  const resolveItem=id=>id.startsWith('offer__')?{collection:'offers',id:id.slice('offer__'.length)}:id.startsWith('meal__')?{collection:'meals',id:id.slice('meal__'.length)}:{collection:'products',id};
  const sources=entries.map(([id])=>resolveItem(id));
  const snapshots=[];for(const src of sources)snapshots.push(await tx.get(doc(db,src.collection,src.id)));
  const items=entries.map(([key,q],i)=>{const snap=snapshots[i],p=snap.data(),src=sources[i];if(!snap.exists()||p.available===false||!Number.isFinite(Number(p.price))||Number(p.price)<0)throw Error('An item is no longer available');return {productId:key,sourceCollection:src.collection,sourceId:src.id,name:clean(p.nameEn||p.nameAr),nameAr:clean(p.nameAr||p.nameEn),price:Number(p.price),quantity:q};});
  const total=Math.round(items.reduce((n,x)=>n+x.price*x.quantity,0)*100)/100;
  tx.set(ref,{userId:user.uid,customerName:clean(values.name,100),phone:clean(values.phone,30),type:values.type==='pickup'?'takeaway':'delivery',address:clean(values.address,500),items,total,status:'New',stockDeducted:false,payment:'cash',source:'website',createdAt:serverTimestamp()});
 });return ref.id;
};
state.reserve=async v=>{const user=required();if(!v.date||!v.time||!Number.isInteger(+v.guests)||+v.guests<1||+v.guests>20)throw Error('Invalid reservation details');const d=await addDoc(collection(db,'reservations'),{userId:user.uid,name:clean(v.name,100),phone:clean(v.phone,30),date:clean(v.date,12),time:clean(v.time,8),guests:+v.guests,notes:clean(v.notes,500),status:'Pending',createdAt:serverTimestamp()});return d.id;};
state.message=async v=>{const user=required();if(!clean(v.message,2000)||!clean(v.name)||!clean(v.email))throw Error('Complete all required fields');const d=await addDoc(collection(db,'messages'),{userId:user.uid,name:clean(v.name,100),email:clean(v.email,150),text:clean(v.message,2000),createdAt:serverTimestamp()});return d.id;};
state.saveProfile=async v=>{const user=required();await setDoc(doc(db,'customers',user.uid),{displayName:clean(v.displayName||user.displayName,100),email:user.email||'',phone:clean(v.phone,30),updatedAt:serverTimestamp()},{merge:true});};
