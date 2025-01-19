import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useTranslation } from 'react-i18next';

export default function Favorites() {
  const { t } = useTranslation();
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">{t('favorites.empty.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('favorites.empty.description')}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">{t('favorites.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((prompt) => (
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
                  className="text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors"
                  onClick={(e) => {
                    e.preventDefault(); // Voorkom navigatie bij klikken op de ster
                    removeFavorite(prompt);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {prompt.Prompt}
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {prompt.Category || prompt.Categorie}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 