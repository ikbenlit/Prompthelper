import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useTranslation } from 'react-i18next';
import PromptCard from '../components/PromptCard/PromptCard';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">{t('favorites.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((prompt) => (
          <PromptCard 
            key={prompt.prompt_id}
            prompt={prompt}
            onRemoveFavorite={(e) => {
              e.stopPropagation();
              removeFavorite(prompt);
            }}
          />
        ))}
      </div>
    </div>
  );
} 