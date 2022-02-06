import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDh7lpH4-atZ1nNXOrlgxJLockCEi-_2Sc",
    authDomain: "storytelling-edf7e.firebaseapp.com",
    projectId: "storytelling-edf7e",
    storageBucket: "storytelling-edf7e.appspot.com",
    messagingSenderId: "967786761331",
    appId: "1:967786761331:web:af3e3190e9b0400869ae06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const provider2 = new GithubAuthProvider();