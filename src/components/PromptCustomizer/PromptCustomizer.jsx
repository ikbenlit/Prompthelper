import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generateContent } from '../../services/openAIService';
import Modal from '../Modal/Modal';

export default function PromptCustomizer({ prompt, tones, styles }) {
  const { t } = useTranslation();
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [customizedPrompt, setCustomizedPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [selectedFormula, setSelectedFormula] = useState('');
  const [examples, setExamples] = useState('');

  console.log('Tones received:', JSON.stringify(tones, null, 2));

  useEffect(() => {
    if (prompt) {
      setOriginalPrompt(prompt.prompt);
      setCustomizedPrompt(prompt.prompt);
      setSelectedFormula(prompt.formula || '');
      setExamples(prompt.more_examples || '');
    }
  }, [prompt]);

  const updatePrompt = (tone, style) => {
    let newPrompt = '';
    
    if (tone) {
      const selectedTone = tones.find(t => t.Name === tone);
      if (selectedTone) {
        newPrompt += `Toon: ${selectedTone.Name} - ${selectedTone.Effect}\n\n`;
      }
    }
    
    if (style) {
      const selectedStyle = styles.find(s => s.Name === style);
      if (selectedStyle) {
        newPrompt += `Stijl: ${selectedStyle.Name} - ${selectedStyle.Effect}\n\n`;
      }
    }

    newPrompt += `Prompt:\n${originalPrompt}`;

    setCustomizedPrompt(newPrompt);
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
      <div className="space-y-6 relative">
        {/* Formule icoon rechtsboven */}
        {prompt.formula && (
          <div className="absolute top-0 right-0 p-2">
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={t('prompt.showFormula')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          </div>
        )}

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
            {tones?.map((tone) => (
              <option key={tone.Name} value={tone.Name}>
                {tone.Name} - {tone.Effect}
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
            {styles?.map((style) => (
              <option key={style.Name} value={style.Name}>
                {style.Name} - {style.Effect}
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
            className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 min-h-[200px] resize-y text-sm leading-relaxed"
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

      {/* Generated Content Modal */}
      <div className="relative z-[200]">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col h-full max-h-[80vh]">
            <h2 className="text-2xl font-bold mb-4">{t('generate.result')}</h2>
            
            <div className="flex-1 overflow-y-auto mb-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{generatedContent}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
              >
                {t('actions.close')}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t('actions.copy')}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
} 