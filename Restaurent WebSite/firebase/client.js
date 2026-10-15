import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,onAuthStateChanged,signOut} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js';
import {getFirestore} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
import {firebaseConfig,ADMIN_UID} from './config.js';
export {ADMIN_UID,onAuthStateChanged,signOut,signInWithEmailAndPassword,createUserWithEmailAndPassword};
export const app=initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
const google=new GoogleAuthProvider();
export const googleLogin=()=>signInWithPopup(auth,google);
export function requireAdmin(callback){
 return onAuthStateChanged(auth,u=>callback(!!ADMIN_UID && u?.uid===ADMIN_UID?u:null,
 !ADMIN_UID?'Administrator UID has not been configured.':u&&u.uid!==ADMIN_UID?'This account is not the authorized administrator.':null));
}
