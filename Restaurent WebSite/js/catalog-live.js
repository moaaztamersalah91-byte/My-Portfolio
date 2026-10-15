import {db} from '../firebase/client.js';
import {collection,onSnapshot} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';

const state=window.TasteCatalog={products:[],categories:[],ready:false,error:false,live:false,status:'connecting'};
const names=['products','categories','offers','meals'];
const loaded=Object.fromEntries(names.map(name=>[name,false]));
const server=Object.fromEntries(names.map(name=>[name,false]));
const errors=new Set();
let productData=[],categoryData=[],offerData=[],mealData=[];
const text=value=>typeof value==='string'?value.trim():'';
const image=value=>typeof value==='string'&&/^data:image\/(webp|png|jpeg);base64,/.test(value)?value:'';

function normalizeItem(id,sourceId,sourceCollection,data,defaultCategory=''){
 return {
  id,sourceId,sourceCollection,
  en:text(data.nameEn)||text(data.nameAr),
  ar:text(data.nameAr)||text(data.nameEn),
  description:text(data.descriptionEn)||text(data.descriptionAr),
  descriptionAr:text(data.descriptionAr)||text(data.descriptionEn),
  category:text(data.category)||defaultCategory,
  price:Number(data.price)||0,
  oldPrice:Number(data.oldPrice)||0,
  available:data.available!==false,
  featured:data.featured===true,
  image:image(data.image)
 };
}
function publish(){
 state.products=[...productData,...offerData,...mealData];
 state.categories=categoryData;
 state.ready=Object.values(loaded).every(Boolean);
 state.error=errors.size>0;
 state.live=!state.error&&Object.values(server).every(Boolean);
 state.status=!navigator.onLine?'offline':state.error?'error':state.live?'live':state.ready?'connecting':'loading';
 window.dispatchEvent(new Event('tastehouse:catalog'));
}
function failed(name,error){
 console.error(`Live catalog feed (${name}):`,error);
 errors.add(name);loaded[name]=true;server[name]=false;publish();
}
function listen(name,apply){
 onSnapshot(collection(db,name),{includeMetadataChanges:true},snapshot=>{
  errors.delete(name);loaded[name]=true;server[name]=!snapshot.metadata.fromCache;
  apply(snapshot);publish();
 },error=>failed(name,error));
}
listen('products',snapshot=>{productData=snapshot.docs.map(d=>normalizeItem(d.id,d.id,'products',d.data()));});
listen('categories',snapshot=>{categoryData=snapshot.docs.map(d=>({id:d.id,nameEn:text(d.data().nameEn),nameAr:text(d.data().nameAr)}));});
listen('offers',snapshot=>{offerData=snapshot.docs.map(d=>normalizeItem(`offer__${d.id}`,d.id,'offers',d.data(),'offers'));});
listen('meals',snapshot=>{mealData=snapshot.docs.map(d=>normalizeItem(`meal__${d.id}`,d.id,'meals',d.data(),'meals'));});

window.addEventListener('online',publish);
window.addEventListener('offline',publish);
