import { createContext, useState, useContext, useEffect, useMemo, useReducer } from 'react';
import { useLanguage } from './LanguageContext';
import { loadData, filterPromptsByCategory } from '../services/dataService';
import { useTranslation } from 'react-i18next';

const PromptContext = createContext();

export function PromptProvider({ children }) {
  const { language } = useLanguage();
  const [prompts, setPrompts] = useState([]);
  const [styles, setStyles] = useState([]);
  const [tones, setTones] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // Load data when language changes
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const data = loadData('nl');
        console.log('Raw data from service:', data);
        
        if (!data.prompts?.length) {
          console.error('No prompts loaded! Check data source');
        }

        setPrompts(data.prompts || []);
        setStyles(data.styles || []);
        setTones(data.tones || []);
        
        const uniqueCategories = [...new Set(data.prompts?.map(prompt => 
          prompt.category
        ))].filter(Boolean);
        
        setCategories(uniqueCategories.sort());
        console.log('First loaded prompt:', data.prompts?.[0]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setPrompts([]);
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Filter prompts based on selected category
  const filteredPrompts = filterPromptsByCategory(prompts, selectedCategory, language);

  const value = {
    prompts: filteredPrompts,
    allPrompts: prompts,
    styles,
    tones,
    categories,
    selectedCategory,
    setSelectedCategory,
    loading,
  };

  return (
    <PromptContext.Provider value={value}>
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompts() {
  return useContext(PromptContext);
} 