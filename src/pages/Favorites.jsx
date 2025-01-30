import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useTranslation } from 'react-i18next';
import PromptCard from '../components/PromptCard/PromptCard';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handlePromptClick = (prompt) => {
    if (prompt.customized) {
      navigate(`/prompt/${prompt.original_id}`, {
        state: {
          customization: {
            tone: prompt.tone,
            style: prompt.style,
            target: prompt.target,
            role: prompt.role,
            customizedPrompt: prompt.prompt
          }
        }
      });
    } else {
      navigate(`/prompt/${prompt.prompt_id}`);
    }
  };

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
          <div key={prompt.prompt_id} className="relative">
            <PromptCard 
              prompt={prompt}
              onClick={() => handlePromptClick(prompt)}
              onRemoveFavorite={(e) => {
                e.stopPropagation();
                removeFavorite(prompt);
              }}
            />
            {prompt.customized && (
              <div className="absolute top-2 right-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                {t('favorites.customized')}
              </div>
            )}
            {prompt.customized && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {prompt.tone && <span className="mr-2">🎭 {prompt.tone}</span>}
                {prompt.style && <span className="mr-2">✍️ {prompt.style}</span>}
                {prompt.target && <span className="mr-2">👥 {prompt.target}</span>}
                {prompt.role && <span>👤 {prompt.role}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 