// Client-side image conversion. Store returned data URL in Firestore only after checking document size.
export async function imageToBase64(file,{maxDimension=800,quality=.68,maxBytes=100000}={}){
 if(!file?.type?.startsWith('image/'))throw new Error('Select an image.');
 const bitmap=await createImageBitmap(file);
 const ratio=Math.min(1,maxDimension/Math.max(bitmap.width,bitmap.height));
 const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
 canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
 let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
 if(!blob || blob.size>maxBytes)throw new Error('Image is too large after compression; select a smaller image.');
 return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob)});
}
