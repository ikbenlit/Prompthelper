import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import logo from '../assets/promptbuilder_logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto flex min-h-screen">
        {/* Login Form Section (Left) */}
        <div className="w-full md:w-1/3 p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-6">
              <img src={logo} alt="PromptBuilder" className="h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('login.title')}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t('login.subtitle')}
              </p>
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
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
{/*
              <div className="text-center mt-4">
                <a 
                  href="#" 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {t('login.forgotPassword')}
                </a>
              </div>
*/}
            </form>
          </div>
        </div>

        {/* Welcome Section (Right) met moderne animaties */}
        <div 
          className={clsx(
            'hidden md:flex md:w-2/3',
            'relative overflow-hidden',
            'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'
          )}
        >
          {/* Moderne floating circles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm animate-pulse-subtle"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                left: `${Math.random() * 80 + 10}%`,       // aangepast voor betere positionering
                top: `${Math.random() * 80 + 10}%`,        // aangepast voor betere positionering
                animationDelay: `${i * 2}s`,               // consistentere delays
                animationDuration: `${Math.random() * 4 + 8}s`,  // langere duratie
                opacity: Math.random() * 0.3 + 0.2,        // toegevoegd voor subtielere bubbles
              }}
            />
          ))}

          {/* Glassmorphism card */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
              <div className="max-w-xl text-center">
                <img src={logo} alt="PromptBuilder" className="h-14 mb-8 mx-auto" />
                <h1 className="text-3xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  {t('login.welcome')}
                </h1>
                <p className="text-1xl text-white/90 leading-relaxed mb-12 whitespace-pre-line">
                  {t('login.welcomeText')}
                </p>
                
                {/* Feature bullets
                <div className="mt-8 space-y-6">
                  {['Personaliseer je prompts', 'Verhoog je productiviteit', 'Verbeter je resultaten'].map((feature, index) => (
                    <div key={index} className="flex items-center justify-center text-white/90">
                      <svg className="w-6 h-6 mr-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xl">{feature}</span>
                    </div>
                  ))}
                </div>
                */}
            </div>
          </div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Animated mesh gradient */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M50 0v100M0 50h100" stroke="white" stroke-width="0.5" fill="none" /%3E%3C/svg%3E")',
              backgroundSize: '30px 30px',
              animation: 'moveGrid 20s linear infinite'
            }}
          />
        </div>
      </div>
    </div>
  );
} 