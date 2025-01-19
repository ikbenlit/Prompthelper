import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateContent } from '../../services/openAIService';

export default function PromptCustomizer({ prompt, tones, styles, onCustomize }) {
  const { t } = useTranslation();
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [customizedPrompt, setCustomizedPrompt] = useState(prompt.Prompt || prompt.Formula);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCustomize = () => {
    let newPrompt = prompt.Prompt || prompt.Formula;
    
    // Maak een array van prompt onderdelen
    const promptParts = [];
    
    if (selectedTone) {
      const tone = tones.find(t => t.Tone === selectedTone);
      promptParts.push(`Tone of voice: ${tone.Description}`);
    }
    
    if (selectedStyle) {
      const style = styles.find(s => (s.Name || s.Naam) === selectedStyle);
      promptParts.push(`Schrijfstijl: ${style.Effect}`);
    }

    // Voeg de basis prompt toe
    promptParts.push(`Prompt: ${newPrompt}`);

    // Combineer alles met line breaks
    const formattedPrompt = promptParts.join('\n\n');

    setCustomizedPrompt(formattedPrompt);
    if (onCustomize) onCustomize(formattedPrompt);
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const content = await generateContent(customizedPrompt);
      setGeneratedContent(content);
    } catch (err) {
      setError(t('errors.generation'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tone Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('customize.selectTone')}
        </label>
        <select
          value={selectedTone}
          onChange={(e) => setSelectedTone(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <option value="">{t('customize.noTone')}</option>
          {tones.map((tone, index) => (
            <option 
              key={`${tone.Tone}-${index}`} 
              value={tone.Tone}
              className="py-2"
            >
              {tone.Tone} - {tone.Description}
            </option>
          ))}
        </select>
      </div>

      {/* Style Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('customize.selectStyle')}
        </label>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <option value="">{t('customize.noStyle')}</option>
          {styles.map((style, index) => (
            <option 
              key={`${style.Name || style.Naam}-${index}`} 
              value={style.Name || style.Naam}
              className="py-2"
            >
              {style.Name || style.Naam} - {style.Effect}
            </option>
          ))}
        </select>
      </div>

      {/* Customize Button */}
      <button
        onClick={handleCustomize}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('customize.apply')}
      </button>

      {/* Customized Prompt */}
      {customizedPrompt && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            {t('customize.result')}
          </label>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-4">
            {customizedPrompt.split('\n\n').map((part, index) => {
              const [label, content] = part.split(': ');
              return (
                <div key={index} className="space-y-1">
                  <div className="font-medium text-sm text-gray-600 dark:text-gray-400">
                    {label}:
                  </div>
                  <div className="text-base">
                    {content}
                  </div>
                </div>
              );
            })}
          </div>
          <textarea
            value={customizedPrompt}
            onChange={(e) => setCustomizedPrompt(e.target.value)}
            className="w-full mt-4 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 min-h-[200px]"
          />
        </div>
      )}

      {/* Generate Button */}
      {customizedPrompt && (
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t('actions.generating')}
            </span>
          ) : (
            t('actions.generate')
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{t('generate.result')}</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4">
            <p className="whitespace-pre-wrap">{generatedContent}</p>
          </div>
        </div>
      )}
    </div>
  );
} 