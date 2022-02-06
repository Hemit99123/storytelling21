import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAUeZnvEoR09jy_UcrubVhz9_anHQoARes",
    authDomain: "storytelling21-43842.firebaseapp.com",
    projectId: "storytelling21-43842",
    storageBucket: "storytelling21-43842.appspot.com",
    messagingSenderId: "560010805607",
    appId: "1:560010805607:web:a39d4ed2827925746fefc2",
    measurementId: "G-KK56HRS8L1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();