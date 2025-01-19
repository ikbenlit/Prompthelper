import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { language, toggleLanguage } = useLanguage();
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
            onClick={toggleLanguage}
            className="btn btn-primary mr-4"
          >
            {t('settings.language.switch')}
          </button>
        </div>
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