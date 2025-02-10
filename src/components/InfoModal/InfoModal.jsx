import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function InfoModal({ isOpen, onClose, content }) {
  const { t } = useTranslation();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    console.log('InfoModal - Closing with dontShowAgain:', dontShowAgain);
    if (dontShowAgain) {
      localStorage.setItem('hidePromptSearchInfo', 'true');
      console.log('InfoModal - Setting localStorage');
    } else {
      localStorage.removeItem('hidePromptSearchInfo');
      console.log('InfoModal - Removing localStorage');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={handleClose} />

        {/* Modal */}
        <div className="relative bg-blue-50 dark:bg-blue-900 rounded-lg shadow-xl max-w-xl w-full p-6 z-10 border-2 border-blue-500">
          {/* Debug indicator */}
          <div 
            title="New InfoModal Implementation">
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('tooltips:help.welcome')}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('tooltips:help.intro')}
            </p>
          </div>

          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            {/* Features Section */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {content.features.title}
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                {content.features.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Tips Section */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {content.tips.title}
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                {content.tips.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('promptSearch.info.dontShowAgain')}
              </span>
            </label>

            <button
              onClick={handleClose}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 