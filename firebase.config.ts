import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAKw7aiISrdYrQt0LNxujJUHx_h9bvWvEQ",
    authDomain: "railway-ticket-booking-b94f2.firebaseapp.com",
    projectId: "railway-ticket-booking-b94f2",
    storageBucket: "railway-ticket-booking-b94f2.firebasestorage.app",
    messagingSenderId: "997017550737",
    appId: "1:997017550737:web:c0d62f986fb7ffe0246430",
    measurementId: "G-QELJ2KHB3J"
  };

// Initialize Firebase
const app = getApps().length? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getStorage(app);

export { app, auth, analytics }