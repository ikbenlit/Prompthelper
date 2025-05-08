import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, sendVerificationEmail as firebaseSendVerificationEmail } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationCheckInterval, setVerificationCheckInterval] = useState(null);

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

  // Periodiek controleren van de verificatiestatus
  useEffect(() => {
    if (user && !user.emailVerified) {
      const interval = setInterval(async () => {
        await checkEmailVerification();
      }, 30000); // Elke 30 seconden controleren
      
      setVerificationCheckInterval(interval);
      
      return () => {
        clearInterval(interval);
        setVerificationCheckInterval(null);
      };
    } else if (verificationCheckInterval) {
      clearInterval(verificationCheckInterval);
      setVerificationCheckInterval(null);
    }
  }, [user]);

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

  /**
   * Verstuurt een verificatie-e-mail naar de huidige gebruiker
   * @returns {Object} Object met success status en eventuele error
   */
  const sendVerificationEmail = async () => {
    try {
      if (!user) {
        return { success: false, error: 'Geen ingelogde gebruiker' };
      }
      
      if (user.emailVerified) {
        return { success: false, error: 'E-mailadres is al geverifieerd' };
      }
      
      return await firebaseSendVerificationEmail(user);
    } catch (error) {
      console.error('Verificatie e-mail fout:', error);
      return { 
        success: false, 
        error: error.message || 'Fout bij versturen verificatie-e-mail' 
      };
    }
  };

  /**
   * Controleert of het e-mailadres van de gebruiker is geverifieerd
   * @returns {Boolean} true als geverifieerd, anders false
   */
  const checkEmailVerification = async () => {
    try {
      if (!user) {
        return false;
      }
      
      // Gebruikersgegevens vernieuwen om de laatste verificatiestatus te krijgen
      await user.reload();
      const updatedUser = auth.currentUser;
      
      if (updatedUser && updatedUser.emailVerified) {
        console.debug('E-mail is geverifieerd voor gebruiker:', updatedUser.uid);
        setUser(updatedUser); // Update de gebruiker in de context
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Verificatie check fout:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    sendVerificationEmail,
    checkEmailVerification,
    isEmailVerified: user?.emailVerified || false
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