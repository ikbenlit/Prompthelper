import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateContent } from '../../services/openAIService';
import Modal from '../Modal/Modal';

export default function PromptCustomizer({ prompt, tones, styles, onCustomize }) {
  const { t } = useTranslation();
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [customizedPrompt, setCustomizedPrompt] = useState(prompt.Prompt || prompt.Formula);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updatePrompt = (newTone, newStyle) => {
    let newPrompt = prompt.Prompt || prompt.Formula;
    const promptParts = [];
    
    if (newTone) {
      const tone = tones.find(t => t.Tone === newTone);
      promptParts.push(`Tone of voice: ${tone.Description}`);
    }
    
    if (newStyle) {
      const style = styles.find(s => (s.Name || s.Naam) === newStyle);
      promptParts.push(`Schrijfstijl: ${style.Effect}`);
    }

    promptParts.push(`Prompt: ${newPrompt}`);
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
      setIsModalOpen(true);
    } catch (err) {
      setError(t('errors.generation'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('customize.selectTone')}
          </label>
          <select
            value={selectedTone}
            onChange={(e) => {
              setSelectedTone(e.target.value);
              updatePrompt(e.target.value, selectedStyle);
            }}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="">{t('customize.noTone')}</option>
            {tones.map((tone, index) => (
              <option key={`${tone.Tone}-${index}`} value={tone.Tone}>
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
            onChange={(e) => {
              setSelectedStyle(e.target.value);
              updatePrompt(selectedTone, e.target.value);
            }}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="">{t('customize.noStyle')}</option>
            {styles.map((style, index) => (
              <option key={`${style.Name || style.Naam}-${index}`} value={style.Name || style.Naam}>
                {style.Name || style.Naam} - {style.Effect}
              </option>
            ))}
          </select>
        </div>

        {/* Prompt Editor */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              {t('customize.promptText')}
            </label>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
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
                t('actions.makeContent')
              )}
            </button>
          </div>
          <textarea
            value={customizedPrompt}
            onChange={(e) => setCustomizedPrompt(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 min-h-[200px] resize-y"
            placeholder={t('customize.editPrompt')}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Modal voor gegenereerde content */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('generate.result')}</h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{generatedContent}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {t('actions.close')}
            </button>
            <button
              onClick={() => {/* Copy logic */}}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('actions.copy')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
} 