import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useLanguage } from './LanguageContext';
import { loadData, filterPromptsByCategory } from '../services/dataService';

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
        
        // Get unique categories directly
        const uniqueCategories = new Set();
        data.prompts.forEach(prompt => {
          const category = prompt.Category || prompt.Categorie;
          if (category) {
            uniqueCategories.add(category);
          }
        });
        setCategories(Array.from(uniqueCategories).sort());
        
        console.log('Loaded tones:', data.tones);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadAllData();
  }, [language]);

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