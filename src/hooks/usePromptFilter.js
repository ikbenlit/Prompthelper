import { useState, useMemo } from 'react';
import { usePrompts } from '../context/PromptContext';
import Fuse from 'fuse.js';
import { useTranslation } from 'react-i18next';
import { filterPromptsByCategory } from '../services/dataService';

export default function usePromptFilter() {
  const { i18n } = useTranslation();
  const { allPrompts: prompts, loading } = usePrompts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const currentLanguage = i18n.language;

  const fuse = useMemo(() => new Fuse(prompts, {
    keys: ['title', 'prompt', 'category'],
    threshold: 0.4,
    ignoreLocation: true
  }), [prompts]);

  console.log('Prompts in filter hook:', prompts);

  const filteredPrompts = useMemo(() => {
    console.log('Current language:', currentLanguage);
    console.log('Selected category:', selectedCategory);
    let results = [...prompts];
    
    if (searchQuery) {
      results = fuse.search(searchQuery).map(result => result.item);
    }
    
    if (selectedCategory) {
      results = results.filter(prompt => prompt.category === selectedCategory);
    }
    
    return results;
  }, [searchQuery, selectedCategory, prompts, fuse]);

  if (loading) return { filteredPrompts: [] };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredPrompts
  };
} 