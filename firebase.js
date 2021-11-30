import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAQaRRak0UR8HN-ShnHsXWMdj_Mwvpi2hM",
  authDomain: "whatsapp-clone-next-db86a.firebaseapp.com",
  projectId: "whatsapp-clone-next-db86a",
  storageBucket: "whatsapp-clone-next-db86a.appspot.com",
  messagingSenderId: "968267152913",
  appId: "1:968267152913:web:457b30c96745f38d2afbb0"
};


const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export { db, auth, provider }