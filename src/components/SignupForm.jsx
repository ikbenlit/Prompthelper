// SignupForm.jsx
import { useState, useEffect } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db, sendVerificationEmail } from '../firebase';

export default function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (status === 'success') {
      console.log('Navigating to verify-email page...');
      navigate('/verify-email', { replace: true });
    }
  }, [status, navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return value.trim().length < 2 ? 'Voornaam moet minimaal 2 tekens bevatten' : '';
      case 'lastName':
        return value.trim().length < 2 ? 'Achternaam moet minimaal 2 tekens bevatten' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Voer een geldig e-mailadres in' : '';
      case 'company':
        return value.trim().length > 0 && value.trim().length < 2 ? 'Bedrijfsnaam moet minimaal 2 tekens bevatten' : '';
      case 'password':
        return value.length < 8 ? 'Wachtwoord moet minimaal 8 tekens bevatten' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Wachtwoorden komen niet overeen' : '';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setGeneralError('');

    try {
      console.log('Starting registration process...');
      
      // Create user with Firebase Auth
      console.log('Creating user with Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log('User created successfully:', user.uid);

      // Sla credentials tijdelijk op voor verificatie
      localStorage.setItem('tempEmail', formData.email);
      localStorage.setItem('tempPassword', formData.password);

      // Prepare user data for Firestore
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Preparing to write to Firestore:', userData);

      // Write to Firestore with retry mechanism
      let retryCount = 0;
      const maxRetries = 3;
      let success = false;

      while (retryCount < maxRetries && !success) {
        try {
          console.log(`Writing to Firestore document: users/${user.uid} (Attempt ${retryCount + 1}/${maxRetries})`);
          await setDoc(doc(db, 'users', user.uid), userData);
          success = true;
          console.log('Successfully wrote to Firestore');
        } catch (firestoreError) {
          console.error(`Firestore write attempt ${retryCount + 1} failed:`, {
            code: firestoreError.code,
            message: firestoreError.message,
            path: `users/${user.uid}`
          });
          
          retryCount++;
          if (retryCount === maxRetries) {
            throw firestoreError;
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      // Send verification email
      await sendVerificationEmail(user);
      console.log('Verification email sent');

      setStatus('success');
      navigate('/verify-email', { replace: true });

    } catch (error) {
      console.error('Registration error:', {
        code: error.code,
        message: error.message
      });

      // Cleanup if user was created but Firestore write failed
      if (error.code === 'permission-denied' || error.code === 'unavailable') {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            await currentUser.delete();
            console.log('Cleaned up user after Firestore write failure');
          }
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError);
        }
      }

      setStatus('error');
      if (error.code === 'auth/email-already-in-use') {
        setGeneralError('Dit e-mailadres is al in gebruik. Probeer in te loggen of gebruik een ander e-mailadres.');
      } else if (error.code === 'auth/invalid-email') {
        setGeneralError('Ongeldig e-mailadres. Controleer het formaat en probeer het opnieuw.');
      } else if (error.code === 'auth/network-request-failed') {
        setGeneralError('Netwerkfout. Controleer je internetverbinding en probeer het opnieuw.');
      } else if (error.code === 'permission-denied') {
        setGeneralError('Geen toegang tot de database. Neem contact op met de beheerder.');
      } else {
        setGeneralError('Er is een fout opgetreden bij het registreren. Probeer het later opnieuw.');
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-green-800">Bedankt voor je registratie!</h3>
        <p className="text-green-600 mb-3">
          Je account is aangemaakt. We hebben een verificatie-email verstuurd naar {formData.email}.
        </p>
        <p className="text-green-700">
          Je wordt nu doorgestuurd naar de verificatiepagina...
        </p>
        <div className="mt-4 flex justify-center">
          <svg className="animate-spin h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6">
      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{generalError}</p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Voornaam *</label>
        <input
          type="text"
          name="firstName"
          required
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Achternaam *</label>
        <input
          type="text"
          name="lastName"
          required
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">E-mailadres *</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Wachtwoord *</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bevestig wachtwoord *</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bedrijfsnaam</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.company ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-100">
        <p>Na registratie ontvang je een verificatie-email. Klik op de link in de email om je account te activeren.</p>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {status === 'loading' ? 'Bezig met registreren...' : 'Registreren'}
      </button>

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            Er is een probleem opgetreden bij het registreren. Probeer het later opnieuw of neem contact op met ondersteuning.
          </p>
        </div>
      )}
    </form>
  );
}