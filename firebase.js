// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC8x6WeqJJHU5zLal77DfNepADIZ6e4IUU",
    authDomain: "twitter-clone-55543.firebaseapp.com",
    projectId: "twitter-clone-55543",
    storageBucket: "twitter-clone-55543.appspot.com",
    messagingSenderId: "517517407767",
    appId: "1:517517407767:web:87cb861a2045abdc5a4e52"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };