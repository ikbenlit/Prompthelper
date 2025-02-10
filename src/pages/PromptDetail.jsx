import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePrompts } from '../context/PromptContext';
import { useTranslation } from 'react-i18next';
import CopyButton from '../components/Button/CopyButton';
import PromptCustomizer from '../components/PromptCustomizer/PromptCustomizer';
import debounce from 'lodash/debounce';

export default function PromptDetail() {
  const { id } = useParams();
  const location = useLocation();
  const savedCustomization = location.state?.customization;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { allPrompts: prompts, styles, tones, targets, roles, loading } = usePrompts();
  const [copiedText, setCopiedText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [expandedExamples, setExpandedExamples] = useState(false);
  const [hoveredExample, setHoveredExample] = useState(null);
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExamples, setFilteredExamples] = useState([]);
  const [displayCount, setDisplayCount] = useState(5);
  const LOAD_MORE_INCREMENT = 5;

  const prompt = useMemo(() => {
    const numericId = Number(id);
    return prompts.find(p => p.prompt_id === numericId);
  }, [id, prompts]);

  console.log('Current prompt:', prompt);
  console.log('Looking for ID:', id, 'Type:', typeof id);
  console.log('Available prompts:', prompts.map(p => ({id: p.prompt_id, Titel: p.Titel})));

  const debouncedSearch = useCallback(
    debounce((term, examples) => {
      if (!examples) return;
      
      const filtered = examples
        .split(/\r\n\r\n/)
        .filter(example => 
          example.toLowerCase().includes(term.toLowerCase())
        );
      
      setFilteredExamples(filtered);
    }, 300),
    []
  );

  useEffect(() => {
    if (prompt?.more_examples) {
      setFilteredExamples(prompt.more_examples.split(/\r\n\r\n/));
    }
  }, [prompt]);

  useEffect(() => {
    if (prompt?.more_examples) {
      if (searchTerm) {
        debouncedSearch(searchTerm, prompt.more_examples);
      }
    }
  }, [searchTerm, prompt?.more_examples, debouncedSearch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleExampleSelect = (example) => {
    const customizer = document.querySelector('.prompt-customizer');
    if (customizer) {
      customizer.querySelector('textarea').value = example;
    }
  };

  console.log('Tones in PromptDetail:', tones);

  const applyExample = (example) => {
    const customizerTextarea = document.querySelector('.prompt-customizer textarea');
    if (customizerTextarea) {
      customizerTextarea.value = example;
      const event = new Event('input', { bubbles: true });
      customizerTextarea.dispatchEvent(event);
    }
  };

  console.log('Search term:', searchTerm);
  console.log('Filtered examples:', filteredExamples);
  console.log('Display count:', displayCount);
  console.log('Expanded examples:', expandedExamples);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {t('actions.back')}
      </button>

      <div className="grid grid-cols-12 gap-8">
        <div className={`${isRightPanelExpanded ? 'col-span-8' : 'col-span-11'} lg:sticky lg:top-8 z-10 space-y-6 transition-all duration-300`}>
          <PromptCustomizer 
            prompt={prompt}
            tones={tones}
            styles={styles}
            targets={targets}
            roles={roles}
            initialCustomization={savedCustomization}
          />
        </div>

        <div className={`${isRightPanelExpanded ? 'col-span-4' : 'col-span-1'} transition-all duration-300 relative`}>
          <button
            onClick={() => setIsRightPanelExpanded(!isRightPanelExpanded)}
            className="absolute -left-3 top-4 z-20 bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-l-lg rounded-r-none p-2 shadow-lg border border-gray-200 dark:border-gray-600 border-r-0 h-12 flex items-center transition-colors duration-200"
          >
            <div className="border-r border-gray-300 dark:border-gray-500 pr-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transform transition-transform text-blue-600 dark:text-blue-400 ${isRightPanelExpanded ? 'rotate-0' : 'rotate-180'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>

          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 overflow-hidden transition-all duration-300 ${
            isRightPanelExpanded ? 'opacity-100 w-full' : 'opacity-0 w-0 p-0'
          }`}>
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold">
                {prompt.Title || prompt.Titel}
              </h1>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Formule</h2>
              <div className="relative group bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-600 dark:text-gray-300 pr-12 cursor-pointer"
                   onClick={() => applyExample(prompt.formula)}>
                  {prompt.formula}
                </p>
                <div className="absolute top-4 right-4">
                  <CopyButton 
                    text={prompt.formula} 
                    variant="default"
                    className="opacity-0 group-hover:opacity-100" 
                  />
                </div>
              </div>

            </div>

            {prompt.more_examples && (
              <div className="mt-6">
                <button
                  onClick={() => setExpandedExamples(!expandedExamples)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="text-sm font-medium">
                    Meer Voorbeelden
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({filteredExamples.length} voorbeelden)
                  </span>
                  <svg 
                    className={`w-4 h-4 transform transition-transform ${expandedExamples ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedExamples && (
                  <div className="mt-4 space-y-4">
                    <div className="sticky top-0 bg-white dark:bg-gray-800 pb-4 z-10">
                      <input
                        type="text"
                        placeholder="Zoek in voorbeelden..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    {filteredExamples.slice(0, displayCount).map((example, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative group"
                      >
                        <p 
                          className="text-gray-600 dark:text-gray-300 pr-12 cursor-pointer"
                          onClick={() => applyExample(example.trim())}
                        >
                          {example.trim()}
                        </p>
                        <div className="absolute top-4 right-4 z-10">
                          <CopyButton 
                            text={example.trim()} 
                            variant="default"
                            className="opacity-0 group-hover:opacity-100" 
                          />
                        </div>
                      </div>
                    ))}

                    {filteredExamples.length > displayCount && (
                      <button
                        onClick={() => setDisplayCount(prev => prev + LOAD_MORE_INCREMENT)}
                        className="w-full py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        Laad meer voorbeelden...
                      </button>
                    )}

                    {filteredExamples.length === 0 && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        Geen voorbeelden gevonden voor "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 