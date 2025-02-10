import { useState } from 'react';
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
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [currentFocus, setCurrentFocus] = useState("EMAIL");

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
                    onFocus={() => setCurrentFocus("EMAIL")}
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
                    onFocus={() => setCurrentFocus("PASSWORD")}
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

              <div className="text-center mt-4 space-y-2">
                {/*
                <Link 
                  to="/signup"
                  className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {t('login.createAccount')}
                </Link>
                */}
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
          {/* Confetti overlay */}
          <Confetti
            className="absolute inset-0 z-20"
            options={{
              particleCount: 30,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#ffffff', '#fbbf24', '#f59e0b'],
              gravity: 0.15,
              ticks: 200
            }}
            manualStart={false}
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