import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrompts } from '../context/PromptContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PromptCustomizer from '../components/PromptCustomizer/PromptCustomizer';

export default function PromptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { prompts, styles, tones } = usePrompts();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [copiedText, setCopiedText] = useState('');

  const prompt = prompts.find(p => (p.Title || p.Titel) === decodeURIComponent(id));

  if (!prompt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">{t('prompt.notFound')}</h2>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {t('actions.backToHome')}
        </button>
      </div>
    );
  }

  const handleCopy = (text) => {
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000); // Reset na 2 seconden
  };

  const CopyButton = ({ text }) => (
    <CopyToClipboard text={text} onCopy={() => handleCopy(text)}>
      <button
        className={`p-2 rounded-lg transition-colors ${
          copiedText === text
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        {copiedText === text ? (
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t('actions.copied')}
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            {t('actions.copy')}
          </span>
        )}
      </button>
    </CopyToClipboard>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {t('actions.back')}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">
            {prompt.Title || prompt.Titel}
          </h1>
          <button
            className={`flex items-center gap-2 ${
              isFavorite(prompt)
                ? 'text-yellow-500 dark:text-yellow-400'
                : 'text-gray-400 dark:text-gray-500'
            } hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors`}
            onClick={() => {
              isFavorite(prompt) ? removeFavorite(prompt) : addFavorite(prompt);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t('prompt.formula')}</h2>
            <CopyButton text={prompt.Formula || prompt.Formule} />
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <p className="font-mono">{prompt.Formula || prompt.Formule}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t('prompt.example')}</h2>
            <CopyButton text={prompt.Prompt} />
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-base leading-relaxed">{prompt.Prompt}</p>
          </div>
        </div>

        {(prompt['More Examples'] || prompt['Meer voorbeelden']) && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('prompt.moreExamples')}</h2>
            <div className="space-y-4">
              {(prompt['More Examples'] || prompt['Meer voorbeelden'])
                .split(/\n\n|\n/)
                .filter(Boolean)
                .map((example, index) => (
                  <div key={index} className="group relative bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-base leading-relaxed pr-20">{example.trim()}</p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CopyButton text={example.trim()} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">{t('prompt.customize')}</h2>
          <PromptCustomizer 
            prompt={prompt}
            tones={tones}
            styles={styles}
            onCustomize={(customizedPrompt) => {
              // Hier later de LLM integratie
              console.log('Customized prompt:', customizedPrompt);
            }}
          />
        </div>
      </div>
    </div>
  );
} 