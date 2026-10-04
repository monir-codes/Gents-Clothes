import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyClRsztlWD3HkQF8jglzjYevFb0zPuxRkc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ronggoboti-fashion.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ronggoboti-fashion",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ronggoboti-fashion.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "584390255528",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:584390255528:web:363cb7b4a3985087dc339d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Firebase Login Error", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase Logout Error", error);
    throw error;
  }
};
