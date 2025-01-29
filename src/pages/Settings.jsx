import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t('settings.title')}
      </h1>
      <div className="space-y-4">
        <div>
          <button 
            onClick={toggleDarkMode}
            className="btn btn-primary"
          >
            {darkMode ? t('settings.theme.light') : t('settings.theme.dark')}
          </button>
        </div>
      </div>
    </div>
  );
} 