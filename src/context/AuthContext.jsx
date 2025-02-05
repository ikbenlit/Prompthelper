import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (import.meta.env.DEV) {
        console.groupCollapsed('Auth State Update');
        console.log('User:', user ? user.uid : 'None');
        console.groupEnd();
      }
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.debug('Login successful for:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Auth Error:', { 
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      });
      throw new Error('Inloggen mislukt. Controleer je gegevens.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.debug('User logged out');
    } catch (error) {
      console.error('Logout Error:', {
        code: error.code,
        message: error.message,
        stack: error.stack.split('\n')[0] // Eerste regel van stack trace
      });
      throw new Error('Uitloggen mislukt. Probeer het opnieuw.');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};