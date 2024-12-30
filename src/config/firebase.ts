import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCjI-BFMQ6K1Dzssyxshb-efKEWCB6Nzi8",
  authDomain: "personal-website-378b7.firebaseapp.com",
  projectId: "personal-website-378b7",
  storageBucket: "personal-website-378b7.firebasestorage.app",
  messagingSenderId: "383852203886",
  appId: "1:383852203886:web:05a93c4d0ceeb4c296fb7f"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
