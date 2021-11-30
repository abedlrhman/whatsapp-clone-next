import '../styles/globals.css'
// handling firebase data
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import {auth, db} from '../firebase'
// components
import Login from './login'
import Loading from '../components/Loading'
import { useEffect } from 'react'


function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)  
  
  useEffect(() => {
    if(user) {
      const usersDoc = doc(db, 'users', user.uid)
      setDoc(usersDoc, { 
        email: user.email,
        leastSeen: serverTimestamp(),
        photoURL: user.photoURL
      }, { 
        merge: true
      });
    }
  }, [user])
  
  if(loading) return <Loading />
  
  if(!user) return <Login />
  
  return <Component {...pageProps} />
}

export default MyApp
