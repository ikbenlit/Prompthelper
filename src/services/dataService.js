import promptsEN from '../data/prompts_en.json';
import promptsNL from '../data/prompts_nl.json';
import stylesEN from '../data/prompt_styles_en.json';
import stylesNL from '../data/prompt_styles_nl.json';
import tonesEN from '../data/prompt_tones_en.json';
import tonesNL from '../data/prompt_tones_nl.json';

// Helper function to normalize tone data
const normalizeToneData = (tones, isEnglish = true) => {
  if (isEnglish) {
    const uniqueTones = Object.entries(tones).map(([tone, description]) => ({
      Tone: tone,
      Description: description
    }));
    return [...new Map(uniqueTones.map(item => [
      item.Tone,
      item
    ])).values()];
  }
  return tones; // Dutch data is already in correct format
};

// Helper function to normalize style data
const normalizeStyleData = (styles, isEnglish = true) => {
  // Filter out null entries and ensure unique entries
  const uniqueStyles = styles.filter(style => style.Name || style.Naam);
  return [...new Map(uniqueStyles.map(item => [
    item.Name || item.Naam, 
    item
  ])).values()];
};

// Helper function to normalize prompt data
const normalizePromptData = (prompts) => {
  return prompts.filter(prompt => prompt.Title || prompt.Titel); // Filter out null entries
};

export const loadData = (language = 'nl') => {
  try {
    const isEnglish = language === 'en';
    
    // Load and normalize the data
    const prompts = normalizePromptData(isEnglish ? promptsEN : promptsNL);
    const styles = normalizeStyleData(isEnglish ? stylesEN : stylesNL);
    const tones = normalizeToneData(isEnglish ? tonesEN : tonesNL, isEnglish);

    return { prompts, styles, tones };
  } catch (error) {
    console.error('Error loading data:', error);
    return { prompts: [], styles: [], tones: [] };
  }
};

// Helper function to filter prompts by category
export const filterPromptsByCategory = (prompts, category) => {
  if (!category) return prompts;
  const categoryField = prompts[0]?.Category ? 'Category' : 'Categorie';
  return prompts.filter(prompt => prompt[categoryField] === category);
};

// Helper function to get unique categories
export const getUniqueCategories = (prompts) => {
  const categoryField = prompts[0]?.Category ? 'Category' : 'Categorie';
  return [...new Set(prompts.map(prompt => prompt[categoryField]))].filter(Boolean);
};

// Helper function to get favorites
export const getFavorites = (styles) => {
  const favoriteField = styles[0]?.Favorites ? 'Favorites' : 'Favorieten';
  return styles.filter(style => style[favoriteField] === 'Yes');
}; 