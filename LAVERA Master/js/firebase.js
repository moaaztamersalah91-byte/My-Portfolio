import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getFirestore,
  runTransaction,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOhS-Knn5p14xgX7Aso6eCht5aeFpHxt4",
  authDomain: "lavera-store.firebaseapp.com",
  projectId: "lavera-store",
  storageBucket: "lavera-store.firebasestorage.app",
  messagingSenderId: "122976748110",
  appId: "1:122976748110:web:bcaebc801b6b251907391f",
  measurementId: "G-YW36E3MF2F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export {
  app, auth, db, googleProvider,
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup,
  signOut, getDocs, getDoc, collection, doc, setDoc, addDoc,
  updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, serverTimestamp, runTransaction
};
