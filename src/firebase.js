import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBD5WCAQGdiD3LK4Gq2p122lPVRvoWsTdU",
  authDomain: "navigationapp-d423d.firebaseapp.com",
  projectId: "navigationapp-d423d",
  storageBucket: "navigationapp-d423d.appspot.com",
  messagingSenderId: "623217451127",
  appId: "1:623217451127:web:a2cdaf072dc2e2df42e672",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
export default firebaseConfig;
