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
const normalizePromptData = (prompts, isEnglish = true) => {
  if (!Array.isArray(prompts)) {
    console.error('Invalid prompts data:', prompts);
    return [];
  }

  return prompts.filter(prompt => {
    if (!prompt) return false;

    // Check for required fields based on language
    if (isEnglish) {
      return prompt.Title && prompt.Category && prompt.Prompt;
    } else {
      return prompt.Titel && prompt.Categorie && prompt.Prompt;
    }
  });
};

export const loadData = (language = 'nl') => {
  try {
    const isEnglish = language === 'en';
    
    // Load and normalize the data
    const prompts = normalizePromptData(isEnglish ? promptsEN : promptsNL, isEnglish);
    const styles = normalizeStyleData(isEnglish ? stylesEN : stylesNL, isEnglish);
    const tones = normalizeToneData(isEnglish ? tonesEN : tonesNL, isEnglish);

    // Get categories with the correct language
    const categories = getUniqueCategories(prompts, language);

    return { prompts, styles, tones, categories };
  } catch (error) {
    console.error('Error loading data:', error);
    return { prompts: [], styles: [], tones: [], categories: [] };
  }
};

// Helper function to filter prompts by category
export const filterPromptsByCategory = (prompts, category, language = 'nl') => {
  if (!category || !prompts.length) return prompts;
  const isEnglish = language === 'en';
  const categoryField = isEnglish ? 'Category' : 'Categorie';
  return prompts.filter(prompt => prompt[categoryField] === category);
};

// Helper function to get unique categories
export const getUniqueCategories = (prompts, language = 'nl') => {
  if (!prompts.length) return [];
  const isEnglish = language === 'en';
  const categoryField = isEnglish ? 'Category' : 'Categorie';

  // Get unique categories and sort them
  const categories = [...new Set(prompts.map(prompt => prompt[categoryField]))].filter(Boolean);

  // Map Dutch categories to English if needed
  if (isEnglish) {
    const categoryMap = {
      'Productivity': 'Productivity',
      'Writing': 'Writing',
      'Social': 'Social',
      'Health': 'Health',
      'Marketing': 'Marketing',
      'Entrepreneurship': 'Entrepreneurship',
      'Entertainment': 'Entertainment'
    };
    return categories.map(cat => categoryMap[cat] || cat).sort();
  }

  return categories.sort();
};

// Helper function to get favorites
export const getFavorites = (styles) => {
  const favoriteField = styles[0]?.Favorites ? 'Favorites' : 'Favorieten';
  return styles.filter(style => style[favoriteField] === 'Yes');
}; 