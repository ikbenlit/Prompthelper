import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export default function CopyButton({ text, className = '', variant = 'default' }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const variants = {
    default: clsx(
      'flex items-center gap-2 p-1.5 rounded',
      'bg-white dark:bg-gray-800 shadow-sm',
      'hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700',
      'border border-gray-200 dark:border-gray-700',
      'transition-all duration-200'
    ),
    inline: clsx(
      'flex items-center gap-2',
      'text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400',
      'transition-colors duration-200'
    ),
    primary: clsx(
      'flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm text-sm font-medium transition-all duration-200',
      'transform active:scale-95',
      copied 
        ? 'bg-accent-500 hover:bg-accent-600 dark:bg-accent-600 dark:hover:bg-accent-700' 
        : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
      'ring-offset-2 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
    )
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleCopy();
      }}
      className={clsx(
        variants[variant],
        className,
        'transition-all duration-200',
        'whitespace-nowrap'
      )}
    >
      {copied ? (
        <>
          <svg 
            className={clsx(
              'w-4 h-4',
              variant === 'primary' ? 'text-white' : 'text-green-500',
              'transition-transform duration-200 transform scale-110'
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span 
            className={clsx(
              'text-sm',
              variant === 'primary' ? 'text-white' : 'text-green-500',
              'transition-all duration-200'
            )}
          >
            {t('actions.copied')}
          </span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm">{t('actions.copy')}</span>
        </>
      )}
    </button>
  );
} 