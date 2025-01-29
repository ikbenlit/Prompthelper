import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { getCategoryColor } from '../../utils/categoryColors';

const PromptCard = ({ prompt, onRemoveFavorite }) => {
  const navigate = useNavigate();
  const { isFavorite } = useFavorites();
  
  const categoryColor = getCategoryColor(prompt.category);

  const handleClick = () => {
    console.log('Navigating to prompt ID:', prompt.prompt_id);
    navigate(`/prompts/${prompt.prompt_id}`);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer group relative"
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {prompt.title}
          </h2>
          {onRemoveFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(e);
              }}
              className="text-yellow-500 hover:text-yellow-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {prompt.prompt}
        </p>
        
        {prompt.category && (
          <div 
            className={`mt-4 inline-block px-3 py-1 rounded-full text-sm ${categoryColor}`}
          >
            {prompt.category}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptCard;
