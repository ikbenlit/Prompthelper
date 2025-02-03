import { useEffect, useState, useMemo } from 'react';
import { usePrompts } from '../context/PromptContext';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';
import { Link } from 'react-router-dom';
import { filterPromptsByCategory } from '../services/dataService';
import usePromptFilter from '../hooks/usePromptFilter';
import Modal from '../components/Modal/Modal';
import clsx from 'clsx';

export default function Home() {
  const { t } = useTranslation();
  const { prompts, categories, selectedCategory, setSelectedCategory, loading } = usePrompts();
  const { 
    searchQuery,
    setSearchQuery,
    selectedCategory: filteredSelectedCategory,
    setSelectedCategory: setFilteredSelectedCategory,
    filteredPrompts 
  } = usePromptFilter();
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(prompts, {
      keys: ['Title', 'Titel', 'Prompt', 'Category', 'Categorie'],
      threshold: 0.4,
      ignoreLocation: true
    });
  }, [prompts]);

  const categoryColorMap = {
    'Productiviteit': 'blue',
    'Schrijven': 'purple',
    'Sociaal': 'green',
    'Gezondheid': 'yellow',
    'Marketing': 'orange',
    'Ondernemerschap': 'red',
    'Amusement': 'pink',
    'Entertainment': 'cyan'
  };

  const getCategoryColor = (category) => {
    console.log('Getting color for:', category);
    return categoryColorMap[category] || 'gray';
  };

  console.log('Available categories:', categories);
  console.log('Categories:', categories);
  console.log('Category colors:', categoryColorMap);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Help Button */}
      <div className="flex items-center justify-between gap-4">
        <button
          className={clsx(
            'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
            'bg-primary-600 text-white shadow-sm',
            'hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800'
          )}
          onClick={() => setShowHelpModal(true)}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          Wat kan ik hier doen?
        </button>
        <div className="flex-1" />
      </div>

      {/* Help Modal */}
      <Modal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)}>
        <div className="space-y-4 md:space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {t('tooltips:help.welcome')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('tooltips:help.intro')}
          </p>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {t('tooltips:help.features.title')}
            </h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-sm md:text-base">
              <li>{t('tooltips:help.features.search')}</li>
              <li>{t('tooltips:help.features.filter')}</li>
              <li>{t('tooltips:help.features.customize')}</li>
              <li>{t('tooltips:help.features.generate')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {t('tooltips:help.tips.title')}
            </h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-sm md:text-base">
              <li>{t('tooltips:help.tips.categories')}</li>
              <li>{t('tooltips:help.tips.keywords')}</li>
              <li>{t('tooltips:help.tips.customize')}</li>
              <li>{t('tooltips:help.tips.iterate')}</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Search input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4 md:mb-8">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          <button
            onClick={() => setFilteredSelectedCategory(null)}
            className={`w-full sm:w-auto px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg md:rounded-xl transition-all ${
              !filteredSelectedCategory 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t('categories.all')}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setFilteredSelectedCategory(prev => prev === category ? null : category);
                setSearchQuery('');
              }}
              className={`w-full sm:w-auto px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg md:rounded-xl transition-all ${
                filteredSelectedCategory === category
                  ? `bg-${getCategoryColor(category)}-600 text-white shadow-md`
                  : `bg-${getCategoryColor(category)}-50 dark:bg-${getCategoryColor(category)}-900/10 
                     text-${getCategoryColor(category)}-700 dark:text-${getCategoryColor(category)}-300 
                     hover:bg-${getCategoryColor(category)}-100 dark:hover:bg-${getCategoryColor(category)}-900/20`
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {filteredPrompts.map((prompt) => (
          <Link
            key={`prompt-${prompt.prompt_id}`}
            to={`/prompts/${prompt.prompt_id}`}
            className="group block"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md sm:hover:shadow-xl p-4 sm:p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {prompt.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {prompt.prompt}
              </p>
              <div className="flex items-center gap-2">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    bg-${getCategoryColor(prompt.category)}-100 
                    dark:bg-${getCategoryColor(prompt.category)}-900/20
                    text-${getCategoryColor(prompt.category)}-700
                    dark:text-${getCategoryColor(prompt.category)}-300`}
                >
                  {prompt.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No results message */}
      {filteredPrompts.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          {t('search.noResults')}
        </div>
      )}
    </div>
  );
} 