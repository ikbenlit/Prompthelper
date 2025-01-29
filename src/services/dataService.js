import promptsEN from '../data/prompts_en.json';
import promptsNL from '../data/prompts_nl.json';
import stylesEN from '../data/prompt_styles_en.json';
import stylesNL from '../data/prompt_styles_nl.json';
import tonesEN from '../data/prompt_tones_en.json';
import tonesNL from '../data/prompt_tones_nl.json';

// Helper function to normalize tone data
const normalizeToneData = (tones, isEnglish = true) => {
  if (!Array.isArray(tones)) {
    console.error('Invalid tones data:', tones);
    return [];
  }

  return tones.map(tone => ({
    Name: tone.Name || tone.Tone,
    Effect: tone.Effect || tone.Description
  }));
};

// Helper function to normalize style data
const normalizeStyleData = (styles, isEnglish = true) => {
  if (!Array.isArray(styles)) {
    console.error('Invalid styles data:', styles);
    return [];
  }

  return styles.map(style => ({
    Name: style.Name || style.Naam,
    Effect: style.Effect,
    Select: style.Select || style.Selecteren
  }));
};

// Helper function to normalize prompt data
const normalizePromptData = (prompts) => {
  const idSet = new Set();
  const duplicates = new Set();
  
  const filtered = prompts.filter(prompt => {
    // Controleer of prompt_id een nummer is
    if (typeof prompt.prompt_id !== 'number') {
      console.error('Ongeldig prompt_id type:', prompt);
      return false;
    }
    if (!prompt.category || !Number.isInteger(prompt.prompt_id)) {
      console.error('Invalid prompt:', prompt);
      return false;
    }
    if (idSet.has(prompt.prompt_id)) {
      duplicates.add(prompt.prompt_id);
      return false;
    }
    idSet.add(prompt.prompt_id);
    return true;
  });

  if (duplicates.size > 0) {
    console.error('Dubbele IDs gevonden:', Array.from(duplicates));
  }
  
  return filtered;
};

export const loadData = () => {
  try {
    const rawPrompts = promptsNL;
    
    // Load raw data
    const rawStyles = stylesNL;
    const rawTones = tonesNL;

    // Normalize data
    const prompts = normalizePromptData(rawPrompts);
    const styles = normalizeStyleData(rawStyles);
    const tones = normalizeToneData(rawTones);

    // Get categories
    const categories = getUniqueCategories(prompts);
    
    // Voeg deze tijdelijke log toe
    console.log('Laatste 5 prompts:', 
      promptsNL.slice(-5).map(p => p.prompt_id)
    );

    // Controleer of alle IDs uniek en sequentieel zijn
    const allIds = promptsNL.map(p => p.prompt_id);
    const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);
    const isSequential = allIds.every((id, index) => 
      index === 0 || id === allIds[index - 1] + 1
    );

    console.log('ID Check:', {
      total: allIds.length,
      unique: new Set(allIds).size,
      duplicates,
      isSequential
    });

    return { prompts, styles, tones, categories };
  } catch (error) {
    console.error('Error loading data:', error);
    return { prompts: [], styles: [], tones: [], categories: [] };
  }
};

// Helper function to filter prompts by category
export const filterPromptsByCategory = (prompts, category) => {
  return prompts.filter(prompt => prompt.category === category);
};

// Helper function to get unique categories
export const getUniqueCategories = (prompts) => {
  return [...new Set(prompts.map(prompt => prompt.category))];
};

// Helper function to get favorites
export const getFavorites = (styles) => {
  const favoriteField = styles[0]?.Favorites ? 'Favorites' : 'Favorieten';
  return styles.filter(style => style[favoriteField] === 'Yes');
}; 