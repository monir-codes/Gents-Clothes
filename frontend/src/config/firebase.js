import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAfKwFQPKbep8QcP3u-GZ60iZ2t7oBy66A",
  authDomain: "gentfits-55801.firebaseapp.com",
  projectId: "gentfits-55801",
  storageBucket: "gentfits-55801.firebasestorage.app",
  messagingSenderId: "519555197855",
  appId: "1:519555197855:web:fb73bda99e9636701dabaa"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

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
