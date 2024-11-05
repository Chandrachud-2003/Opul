// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBwhgymso34F3H7z45zPERkGepi3wn1j94",
  authDomain: "opul-a6ed5.firebaseapp.com",
  projectId: "opul-a6ed5",
  storageBucket: "opul-a6ed5.firebasestorage.app",
  messagingSenderId: "168036682520",
  appId: "1:168036682520:web:2f0be4030a0290d073ec6d",
  measurementId: "G-V5LCVTG99V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.setPersistence(browserLocalPersistence);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

// Default export for convenience
export default app;