import { useState, useRef, useEffect, useMemo } from 'react';
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
  const { allPrompts: prompts, styles, tones, loading } = usePrompts();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [copiedText, setCopiedText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  const [formulaPopover, setFormulaPopover] = useState({ show: false, x: 0, y: 0 });
  const formulaButtonRef = useRef(null);
  const [expandedExamples, setExpandedExamples] = useState(false);
  const [hoveredExample, setHoveredExample] = useState(null);
  const [showFormulaContent, setShowFormulaContent] = useState(false);
  const formulaPopoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        formulaButtonRef.current && 
        !formulaButtonRef.current.contains(event.target) &&
        formulaPopoverRef.current && 
        !formulaPopoverRef.current.contains(event.target)
      ) {
        setFormulaPopover(prev => ({ ...prev, show: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const prompt = useMemo(() => {
    const numericId = Number(id);
    return prompts.find(p => p.prompt_id === numericId);
  }, [id, prompts]);

  console.log('Current prompt:', prompt);
  console.log('Looking for ID:', id, 'Type:', typeof id);
  console.log('Available prompts:', prompts.map(p => ({id: p.prompt_id, Titel: p.Titel})));

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

  const handleFormulaClick = (e) => {
    setFormulaPopover(prev => ({ ...prev, show: !prev.show }));
  };

  const CopyButton = ({ text, className = '' }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCopy();
        }}
        className={`flex items-center gap-2 p-1.5 rounded bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all ${className}`}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-500">Gekopieerd</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Kopieer</span>
          </>
        )}
      </button>
    );
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

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {t('actions.back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:sticky lg:top-8 z-10 space-y-6">
          <PromptCustomizer 
            prompt={prompt}
            tones={tones}
            styles={styles}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">
              {prompt.Title || prompt.Titel}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  ref={formulaButtonRef}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormulaPopover(prev => ({ 
                      show: !prev.show,
                      x: 0,
                      y: 0
                    }));
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span>Prompt formule</span>
                </button>

                {formulaPopover.show && (
                  <div 
                    ref={formulaPopoverRef}
                    className="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[300px]"
                    style={{
                      left: 0,
                      top: '100%'
                    }}
                  >
                    <div className="relative group">
                      <p className="text-gray-600 dark:text-gray-300 font-mono text-sm whitespace-pre-wrap">
                        {prompt.formula}
                      </p>
                      <CopyButton
                        text={prompt.formula}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                )}
              </div>
              <button
                className={`${
                  isFavorite(prompt)
                    ? 'text-yellow-500 dark:text-yellow-400'
                    : 'text-gray-400 dark:text-gray-500'
                } hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors`}
                onClick={() => {
                  isFavorite(prompt) ? removeFavorite(prompt) : addFavorite(prompt);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Voorbeeld</h2>
            <div className="relative group bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-600 dark:text-gray-300 pr-12 cursor-pointer"
                 onClick={() => applyExample(prompt.prompt)}>
                {prompt.prompt}
              </p>
              <div className="absolute top-4 right-4">
                <CopyButton
                  text={prompt.prompt}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
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
                  ({prompt.more_examples.split(/\r\n\r\n/).length} voorbeelden)
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
                  {prompt.more_examples.split(/\r\n\r\n/).map((example, index) => (
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
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 