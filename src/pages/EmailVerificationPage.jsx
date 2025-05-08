import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Confetti } from '../components/Confetti';
import { verifyEmail, auth } from '../firebase';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';

export default function EmailVerificationPage() {
  const { user, sendVerificationEmail, checkEmailVerification, isEmailVerified } = useAuth();
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { oobCode } = useParams();
  const confettiRef = useRef(null);
  const checkIntervalRef = useRef(null);
  const isRedirectingRef = useRef(false);
  
  // Confetti configuratie
  const confettiConfig = {
    particleCount: 100,
    spread: 70,
    colors: ['#ffffff', '#fbbf24', '#f59e0b', '#10b981'],
    origin: { y: 0.6 }
  };

  // Cleanup functie voor intervals
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Verwerk de verificatie-URL als deze aanwezig is
  useEffect(() => {
    const processVerificationCode = async () => {
      if (oobCode && !showSuccess) {
        setIsVerifying(true);
        try {
          const result = await verifyEmail(oobCode);
          if (result.success) {
            // Wacht even tot de verificatiestatus is bijgewerkt
            await new Promise(resolve => setTimeout(resolve, 1000));
            const verified = await checkEmailVerification();
            if (verified) {
              setShowSuccess(true);
              confettiRef.current?.fire(confettiConfig);
            }
          } else {
            setVerificationError(result.error);
          }
        } catch (error) {
          console.error('Verificatie fout:', error);
          setVerificationError(error.message);
        } finally {
          setIsVerifying(false);
        }
      }
    };

    processVerificationCode();
  }, [oobCode, checkEmailVerification, showSuccess]);
  
  // Redirect naar login als er geen gebruiker is
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Periodieke verificatiestatus check
  useEffect(() => {
    if (user && !isEmailVerified && !oobCode && !showSuccess) {
      const checkVerification = async () => {
        if (isVerifying) return;
        
        setIsVerifying(true);
        try {
          const verified = await checkEmailVerification();
          if (verified) {
            setShowSuccess(true);
            confettiRef.current?.fire(confettiConfig);
            if (checkIntervalRef.current) {
              clearInterval(checkIntervalRef.current);
            }
          }
        } catch (error) {
          console.error('Verificatie check fout:', error);
        } finally {
          setIsVerifying(false);
        }
      };
      
      // Direct controleren bij laden van de pagina
      checkVerification();
      
      // Start periodieke check elke 5 seconden
      checkIntervalRef.current = setInterval(checkVerification, 5000);
      
      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    } else if (isEmailVerified && !showSuccess) {
      setShowSuccess(true);
      confettiRef.current?.fire(confettiConfig);
    }
  }, [user, isEmailVerified, checkEmailVerification, oobCode, showSuccess]);
  
  // Countdown voor wanneer de email zou moeten aankomen
  useEffect(() => {
    if (emailSent && emailCountdown > 0) {
      const timer = setInterval(() => {
        setEmailCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [emailSent, emailCountdown]);
  
  // Email opnieuw versturen
  const handleResend = async () => {
    if (resendDisabled) return;
    
    const result = await sendVerificationEmail();
    
    if (result.success) {
      setResendDisabled(true);
      setEmailSent(true);
      setEmailCountdown(60);
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  
  // Handmatig de verificatiestatus controleren
  const handleCheckVerification = async () => {
    if (showSuccess || isVerifying) return;
    
    setIsVerifying(true);
    try {
      const verified = await checkEmailVerification();
      if (verified) {
        setShowSuccess(true);
        confettiRef.current?.fire(confettiConfig);
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      }
    } catch (error) {
      console.error('Verificatie check fout:', error);
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Functie om naar de app te navigeren
  const handleNavigateToApp = async () => {
    if (isRedirectingRef.current) return;
    isRedirectingRef.current = true;

    try {
      console.log('Navigating to app...');
      console.log('User status:', {
        isLoggedIn: !!user,
        isEmailVerified: user?.emailVerified
      });

      if (user && user.emailVerified) {
        // Gebruik window.location voor een harde redirect
        window.location.href = '/';
      } else if (user) {
        // Gebruiker is ingelogd maar niet geverifieerd
        const storedEmail = localStorage.getItem('tempEmail');
        const storedPassword = localStorage.getItem('tempPassword');

        if (storedEmail && storedPassword) {
          try {
            await signOut(auth);
            await signInWithEmailAndPassword(auth, storedEmail, storedPassword);
            localStorage.removeItem('tempEmail');
            localStorage.removeItem('tempPassword');
            // Gebruik window.location voor een harde redirect
            window.location.href = '/';
          } catch (error) {
            console.error('Error during re-authentication:', error);
            window.location.href = '/login';
          }
        } else {
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/login';
    } finally {
      isRedirectingRef.current = false;
    }
  };
  
  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <Confetti ref={confettiRef} />
        
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('verification.success.title')}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {t('verification.success.message')}
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleNavigateToApp}
              className="w-full px-6 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              {t('verification.success.directAccess')}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('verification.title')}</h1>
      
      {verificationError && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
          <p className="text-red-800">
            {verificationError}
          </p>
        </div>
      )}
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-blue-800">
          {t('verification.instructions')} <strong>{user?.email}</strong>
        </p>
        
        {emailSent && emailCountdown > 0 && (
          <p className="mt-2 text-blue-600">
            {t('verification.emailCountdown', { count: emailCountdown })}
          </p>
        )}
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{t('verification.emailPreview.title')}</h2>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="border-b border-gray-300 pb-2 mb-3">
            <p><strong>{t('verification.emailPreview.from')}</strong> PromptBuilder &lt;noreply@promptbuilder.app&gt;</p>
            <p><strong>{t('verification.emailPreview.subject')}</strong> {t('verification.emailPreview.subject')}</p>
          </div>
          <div className="p-4 bg-white rounded border border-gray-200">
            <p className="mb-3">{t('verification.emailPreview.content.greeting')}</p>
            <p className="mb-3">{t('verification.emailPreview.content.message')}</p>
            <div className="my-4 text-center">
    {/* Button vervangen door URL-link weergave */}
    <div className="p-2 bg-gray-100 border border-gray-300 rounded-md text-blue-600 break-all">
      https://promptbuilder.app/verify-email?oobCode=ABC123DEF456GHI789
    </div>
    <p className="mt-2 text-sm text-gray-500">
      {t('verification.emailPreview.content.linkInstructions')}
    </p>
  </div>
            <p className="mb-3">{t('verification.emailPreview.content.disclaimer')}</p>
            <p>{t('verification.emailPreview.content.signature')}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{t('verification.noEmail.title')}</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>{t('verification.noEmail.checkSpam')}</li>
          <li>{t('verification.noEmail.checkAddress')}</li>
          <li>{t('verification.noEmail.waitAndRefresh')}</li>
        </ul>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleResend}
            disabled={resendDisabled}
            className={clsx(
              "px-4 py-2 rounded-md",
              resendDisabled 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {resendDisabled 
              ? `${t('verification.resendWait')} (${countdown}s)` 
              : t('verification.resend')}
          </button>
          
          <button 
            onClick={handleCheckVerification}
            disabled={isVerifying}
            className={clsx(
              "px-4 py-2 rounded-md",
              isVerifying
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            )}
          >
            {isVerifying ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('verification.checking')}
              </span>
            ) : t('verification.checkStatus')}
          </button>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{t('verification.help.title')}</h2>
        <p className="text-gray-700">
          {t('verification.help.message')} <a href={`mailto:${t('verification.help.email')}`} className="text-blue-600 hover:underline">{t('verification.help.email')}</a>
        </p>
      </div>
    </div>
  );
} 