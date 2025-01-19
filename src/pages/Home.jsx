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

  // Voeg deze console.log toe in de Home component om te zien welke categorieën we hebben
  console.log('Available categories:', categories);

  const getCategoryColor = (category) => {
    const colors = {
      'Productiviteit': 'blue',         // Blauw
      'Schrijven': 'purple',            // Paars
      'Sociaal': 'green',               // Groen
      'Gezondheid': 'yellow',           // Geel
      'Marketing': 'orange',            // Oranje
      'Ondernemerschap': 'red',         // Rood
      'Entertainment': 'cyan',          // Turquoise
      'Amusement': 'pink',              // Roze
      'Vermaak': 'indigo'              // Indigo
    };
    
    // Log wanneer een categorie geen kleur krijgt
    if (!colors[category]) {
      console.warn(`No color defined for category: ${category}`);
    }
    
    return colors[category] || 'gray';
  };

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
      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex flex-nowrap gap-2 pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              !selectedCategory 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t('categories.all')}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === category
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => (
          <Link
            key={prompt.Title || prompt.Titel}
            to={`/prompt/${encodeURIComponent(prompt.Title || prompt.Titel)}`}
            className="group block"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {prompt.Title || prompt.Titel}
                </h3>
                <button
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isFavorite(prompt)
                      ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } transition-all`}
                  onClick={(e) => {
                    e.preventDefault();
                    isFavorite(prompt) ? removeFavorite(prompt) : addFavorite(prompt);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {prompt.Prompt}
              </p>
              <div className="flex items-center gap-2">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    bg-${getCategoryColor(prompt.Category || prompt.Categorie)}-100 
                    dark:bg-${getCategoryColor(prompt.Category || prompt.Categorie)}-900/20
                    text-${getCategoryColor(prompt.Category || prompt.Categorie)}-700
                    dark:text-${getCategoryColor(prompt.Category || prompt.Categorie)}-300`}
                >
                  {prompt.Category || prompt.Categorie}
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