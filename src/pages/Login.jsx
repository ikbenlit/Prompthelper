import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resetPassword } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import logo from '../assets/promptbuilder_logo.png';
import BearAnimation from '../components/BearAnimation';
import { Confetti } from '../components/Confetti';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [currentFocus, setCurrentFocus] = useState("EMAIL");
  const confettiRef = useRef(null);

  // Confetti configuratie
  const confettiConfig = {
    particleCount: 50,
    spread: 70,
    colors: ['#ffffff', '#fbbf24', '#f59e0b'],
    origin: { y: 0.6 }
  };

  // Confetti bij page load
  useEffect(() => {
    confettiRef.current?.fire(confettiConfig);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      navigate(location.state?.from || '/');
    } catch (error) {
      setError(t('login.error'));
    }
  };

  // Confetti bij focus op input velden
  const handleFocus = (field) => {
    setCurrentFocus(field);
    confettiRef.current?.fire(confettiConfig);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-screen w-full">
        {/* Login Form Section (Left) */}
        <div className="w-full md:w-1/3 p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('login.title')}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t('login.subtitle')}
              </p>
            </div>

            <div>
              <BearAnimation 
                currentFocus={currentFocus}
                emailLength={email.length}
              />
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/50 p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('login.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => handleFocus("EMAIL")}
                    className={clsx(
                      'block w-full px-4 py-3 rounded-lg text-sm transition-colors',
                      'border border-gray-300 dark:border-gray-600',
                      'bg-white dark:bg-gray-700',
                      'text-gray-900 dark:text-white',
                      'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                      'dark:focus:ring-primary-400'
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('login.password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => handleFocus("PASSWORD")}
                      className={clsx(
                        'block w-full px-4 py-3 rounded-lg text-sm transition-colors',
                        'border border-gray-300 dark:border-gray-600',
                        'bg-white dark:bg-gray-700',
                        'text-gray-900 dark:text-white',
                        'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        'dark:focus:ring-primary-400'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={clsx(
                    'w-full px-4 py-3 text-sm font-medium rounded-lg',
                    'bg-primary-600 text-white shadow-sm',
                    'hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    'dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800',
                    'transition-colors duration-200'
                  )}
                >
                  {t('login.submit')}
                </button>
              </div>

              <div className="text-center mt-4 space-y-2">
                <Link 
                  to="/signup"
                  className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {t('login.createAccount')}
                </Link>
                <Link 
                  to="/forgot-password"
                  className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Welcome Section (Right) met moderne animaties */}
        <div className="hidden md:flex md:w-2/3 relative overflow-hidden bg-gradient-to-b from-white via-red-500 via-orange-300 to-yellow-300">
          <Confetti
            ref={confettiRef}
            className="absolute inset-0 z-20"
            options={{
              ...confettiConfig,
              gravity: 0.15,
              ticks: 200
            }}
            manualStart={true}
          />

          {/* Animated grid overlay */}
          <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 gap-2 opacity-10 animate-moveGrid">
            {[...Array(400)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white/20 rounded-full" />
            ))}
          </div>

          <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
            <div className="max-w-xl text-center">
              <img src={logo} alt="PromptBuilder" className="h-14 mb-8 mx-auto" />
              <h1 className="text-3xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                {t('login.welcome')}
              </h1>
              <p className="text-1xl text-white/90 leading-relaxed mb-12 whitespace-pre-line">
                {t('login.welcomeText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}