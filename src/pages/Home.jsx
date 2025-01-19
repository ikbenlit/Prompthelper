import { useEffect, useState, useMemo } from 'react';
import { usePrompts } from '../context/PromptContext';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();
  const { prompts, categories, selectedCategory, setSelectedCategory, loading } = usePrompts();
  const [searchQuery, setSearchQuery] = useState('');
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(prompts, {
      keys: ['Title', 'Titel', 'Prompt', 'Category', 'Categorie'],
      threshold: 0.4,
      ignoreLocation: true
    });
  }, [prompts]);

  // Filter prompts based on search and category
  const filteredPrompts = useMemo(() => {
    let results = prompts;
    
    // Apply search filter if query exists
    if (searchQuery) {
      results = fuse.search(searchQuery).map(result => result.item);
    }
    
    // Apply category filter if selected
    if (selectedCategory) {
      const categoryField = results[0]?.Category ? 'Category' : 'Categorie';
      results = results.filter(prompt => prompt[categoryField] === selectedCategory);
    }
    
    return results;
  }, [searchQuery, selectedCategory, prompts, fuse]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full ${
              !selectedCategory 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {t('categories.all')}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => (
          <Link
            key={prompt.Title || prompt.Titel}
            to={`/prompt/${encodeURIComponent(prompt.Title || prompt.Titel)}`}
            className="block"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">
                {prompt.Title || prompt.Titel}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {prompt.Prompt}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {prompt.Category || prompt.Categorie}
                </span>
                <button
                  className={`flex items-center gap-2 ${
                    isFavorite(prompt)
                      ? 'text-yellow-500 dark:text-yellow-400'
                      : 'text-gray-400 dark:text-gray-500'
                  } hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors`}
                  onClick={(e) => {
                    e.preventDefault();
                    isFavorite(prompt) ? removeFavorite(prompt) : addFavorite(prompt);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
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