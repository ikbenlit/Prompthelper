import { initializeApp } from 'firebase/app';
import { getAuth, sendEmailVerification, applyActionCode } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence in development
if (import.meta.env.DEV) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence not supported by browser');
    }
  });
}

// Debug logging in development
if (import.meta.env.DEV) {
  console.log('Firebase Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });
}

export { auth, db };

/**
 * Verstuurt een verificatie-e-mail naar de ingelogde gebruiker
 */
export const sendVerificationEmail = async (user) => {
  try {
    if (!user) {
      console.error('Geen gebruiker gevonden om verificatie-e-mail naar te sturen');
      return { success: false, error: 'Geen gebruiker gevonden' };
    }
    
    await sendEmailVerification(user);
    console.debug('Verificatie-e-mail verstuurd naar:', user.email);
    return { success: true };
  } catch (error) {
    console.error('Fout bij versturen verificatie-e-mail:', error);
    return { 
      success: false, 
      error: error.message || 'Fout bij versturen verificatie-e-mail'
    };
  }
};

/**
 * Verwerkt de verificatiecode uit de e-mail link
 */
export const verifyEmail = async (oobCode) => {
  try {
    if (!oobCode) {
      return { success: false, error: 'Geen verificatiecode gevonden' };
    }
    
    await applyActionCode(auth, oobCode);
    console.debug('E-mail succesvol geverifieerd');
    return { success: true };
  } catch (error) {
    console.error('Fout bij e-mail verificatie:', error);
    return { 
      success: false, 
      error: error.message || 'Fout bij e-mail verificatie'
    };
  }
};