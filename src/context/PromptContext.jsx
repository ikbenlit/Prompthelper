import { createContext, useState, useContext, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { loadData, filterPromptsByCategory, getUniqueCategories } from '../services/dataService';

const PromptContext = createContext();

export function PromptProvider({ children }) {
  const { language } = useLanguage();
  const [prompts, setPrompts] = useState([]);
  const [styles, setStyles] = useState([]);
  const [tones, setTones] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data when language changes
  useEffect(() => {
    const loadAllData = () => {
      try {
        setLoading(true);
        const data = loadData(language);
        setPrompts(data.prompts);
        setStyles(data.styles);
        setTones(data.tones);
        setCategories(getUniqueCategories(data.prompts));
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadAllData();
  }, [language]);

  // Filter prompts based on selected category
  const filteredPrompts = filterPromptsByCategory(prompts, selectedCategory);

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