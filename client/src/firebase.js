// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-1de6f.firebaseapp.com",
  projectId: "mern-estate-1de6f",
  storageBucket: "mern-estate-1de6f.appspot.com",
  messagingSenderId: "181910520594",
  appId: "1:181910520594:web:be37d6703768c3fe9529cb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);