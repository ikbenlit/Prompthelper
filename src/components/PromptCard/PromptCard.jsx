import { useNavigate } from 'react-router-dom';
import { getCategoryColor } from '../../utils/categoryColors';
import clsx from 'clsx';

const PromptCard = ({ prompt, onClick }) => {
  const navigate = useNavigate();
  
  const categoryColor = getCategoryColor(prompt.category);

  const handleClick = () => {
    console.log('Navigating to prompt ID:', prompt.prompt_id);
    navigate(`/prompts/${prompt.prompt_id}`);
  };

  return (
    <div 
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer group relative',
        'border border-gray-200 dark:border-gray-700',
        'shadow-sm hover:shadow-md transition-all duration-200',
        'hover:border-primary-500 dark:hover:border-primary-500',
        'transform hover:-translate-y-0.5'
      )}
      onClick={onClick || handleClick}
    >
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start mb-4">
          <h2 
            className={clsx(
              'text-xl font-semibold text-gray-900 dark:text-white',
              'group-hover:text-primary-600 dark:group-hover:text-primary-400',
              'transition-colors duration-200'
            )}
          >
            {prompt.Title || prompt.title}
          </h2>
        </div>
        
        <p 
          className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm leading-relaxed"
        >
          {prompt.prompt}
        </p>
        
        {prompt.category && (
          <div 
            className={clsx(
              'mt-4 inline-flex items-center',
              'px-3 py-1 rounded-full text-xs font-medium',
              'bg-primary-50 text-primary-700 dark:bg-primary-900/10 dark:text-primary-300',
              'ring-1 ring-inset ring-primary-600/20 dark:ring-primary-300/20'
            )}
          >
            {prompt.category}
          </div>
        )}
        
        {/* Hover Indicator */}
        <div className={clsx(
          'absolute inset-x-0 bottom-0 h-0.5',
          'bg-primary-500 dark:bg-primary-400',
          'transform scale-x-0 group-hover:scale-x-100',
          'transition-transform duration-200 origin-left'
        )} />
      </div>
    </div>
  );
};

export default PromptCard;
