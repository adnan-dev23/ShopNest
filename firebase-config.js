// Firebase Modular SDKs (CDN imports for Vanilla JS)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Aapka verified Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyACIVN9eNVXV5pBeWwwake438tbYD3ZF0o",
  authDomain: "shopmarkets-d064d.firebaseapp.com",
  projectId: "shopmarkets-d064d",
  storageBucket: "shopmarkets-d064d.firebasestorage.app",
  messagingSenderId: "459218750693",
  appId: "1:459218750693:web:afe63993d7ed7b8340180c",
  measurementId: "G-VH2YYYYX9K"
};

// Initialize Services
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export Firestore Helpers
export { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy 
};