import { useNavigate } from 'react-router-dom';
import { getCategoryColor } from '../../utils/categoryColors';

const PromptCard = ({ prompt, onClick }) => {
  const navigate = useNavigate();
  
  const categoryColor = getCategoryColor(prompt.category);

  const handleClick = () => {
    console.log('Navigating to prompt ID:', prompt.prompt_id);
    navigate(`/prompts/${prompt.prompt_id}`);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer group relative"
      onClick={onClick || handleClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {prompt.Title || prompt.title}
          </h2>
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
