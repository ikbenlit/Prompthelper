import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SearchBar({ searchQuery, setSearchQuery, setSelectedCategory }) {
  const { t } = useTranslation();

  return (
    <div className="relative mb-4 md:mb-8 max-w-2xl mx-auto px-2 sm:px-4 md:px-0">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        placeholder={t('search.placeholder')}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setSelectedCategory(null);
        }}
        className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow"
      />
    </div>
  );
}
