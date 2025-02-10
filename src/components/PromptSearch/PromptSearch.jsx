import { useSearch } from '../../hooks/useSearch';
import PromptCard from '../PromptCard/PromptCard';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import InfoModal from '../InfoModal/InfoModal';

export default function PromptSearch({ prompts, onSelect }) {
  const { t } = useTranslation();
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hidePromptSearchInfo');
    console.log('PromptSearch - localStorage value:', hasSeenModal);
    if (!hasSeenModal) {
      console.log('PromptSearch - Opening modal');
      setShowInfoModal(true);
    }
  }, []);

  const searchConfig = {
    keys: ['Title', 'prompt', 'category'],
    debounceMs: 500,
    minLength: 2,
    sortBy: (a, b) => a.Title.localeCompare(b.Title)
  };

  const {
    searchTerm,
    setSearchTerm,
    results: filteredPrompts,
    loading
  } = useSearch(prompts, searchConfig);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <button
          className="whitespace-nowrap px-4 py-2 text-sm bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
          onClick={() => setShowInfoModal(true)}
          title={t('tooltips:customize.search')}
        >
          Wat kan ik hier doen?
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Zoek prompts..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <InfoModal 
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        content={{
          features: {
            title: t('tooltips:help.features.title'),
            items: [
              t('tooltips:help.features.search'),
              t('tooltips:help.features.filter'),
              t('tooltips:help.features.customize'),
              t('tooltips:help.features.generate')
            ]
          },
          tips: {
            title: t('tooltips:help.tips.title'),
            items: [
              t('tooltips:help.tips.categories'),
              t('tooltips:help.tips.keywords'),
              t('tooltips:help.tips.customize'),
              t('tooltips:help.tips.iterate')
            ]
          }
        }}
      />

      {loading ? (
        <div>Laden...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map(prompt => (
            <PromptCard 
              key={prompt.prompt_id} 
              prompt={prompt}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
} 