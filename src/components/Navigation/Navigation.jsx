import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import { useState } from 'react';
import logoLight from '../../assets/promptbuilder_logo.png';
import logoDark from '../../assets/promptbuilder_logo_darkmode.png';

export default function Navigation() {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
<nav className="bg-gradient-to-r from-white via-red-500 via-orange-300 to-yellow-300 dark:from-gray-800 dark:via-gray-900 dark:to-black shadow-md border-b border-red-500">
      
<div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
               <img 
                  src={darkMode ? logoDark : logoLight} 
                  alt="PromptBuilder Logo"
                  className="h-12 w-auto object-contain transition-all duration-200 hover:opacity-90 hover:scale-105"
                />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Auth Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 rounded-lg transition-colors shadow-sm text-sm font-medium"
              >
                {t('navigation.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 rounded-lg transition-colors shadow-sm text-sm font-medium"
              >
                {t('navigation.login')}
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={clsx(
                'p-2 rounded-full transition-all duration-200',
                'text-white hover:bg-white hover:text-gray-900',
                'dark:hover:bg-gray-700 dark:hover:text-white',
                'focus:outline-none focus:ring-2 focus:ring-white'
              )}
              title={darkMode ? t('settings.theme.light') : t('settings.theme.dark')}
            >
              {darkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
