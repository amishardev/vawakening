
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0a4FlKXefoF44P3Cpyhdl5Qi_5rJD7W8",
  authDomain: "vawakeningcom.firebaseapp.com",
  projectId: "vawakeningcom",
  storageBucket: "vawakeningcom.firebasestorage.app",
  messagingSenderId: "499372188023",
  appId: "1:499372188023:web:dfe021493eee883c55c172"
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const firestore: Firestore = getFirestore(app);

export { app, auth, firestore };
