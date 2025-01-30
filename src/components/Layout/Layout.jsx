import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/promptbuilder_logo.png"
              alt="PromptBuilder" 
              className="h-8"
            />
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/settings"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {t('navigation.settings')}
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      <main className="py-6">
        {children}
      </main>
    </div>
  );
} 