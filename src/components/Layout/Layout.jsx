import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import logo from '../../assets/promptbuilder_logo.png';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Navigation />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

function Navigation() {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={logo}
            alt="PromptBuilder" 
            className="h-10 w-auto transition-all duration-200 hover:opacity-90"
          />
        </Link>
        
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm text-sm font-medium"
          >
            {t('navigation.logout')}
          </button>

          <button
            onClick={toggleDarkMode}
            className={clsx(
              'p-2 rounded-full transition-all duration-200',
              'text-gray-600 dark:text-gray-300',
              'hover:bg-primary-50 hover:text-primary-600',
              'dark:hover:bg-gray-700 dark:hover:text-primary-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
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
    </header>
  );
} 