import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../context/AuthContext';
import clsx from 'clsx';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await resetPassword(email);
      setMessage(t('login.resetSuccess')); 
    } catch (err) {
      setError(t('login.resetError'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          {t('login.forgotPassword')}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {t('login.forgotPasswordSubtitle')}
        </p>

        {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
            {t('login.sendResetLink')}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {t('login.backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
}
