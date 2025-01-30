import promptsEN from '../data/prompts_en.json';
import promptsNL from '../data/prompts_nl.json';
import stylesEN from '../data/prompt_styles_en.json';
import stylesNL from '../data/prompt_styles_nl.json';
import tonesEN from '../data/prompt_tones_en.json';
import tonesNL from '../data/prompt_tones_nl.json';
import targetsNL from '../data/prompt_target_nl.json';
import rolesNL from '../data/prompt_role_nl.json';

// Helper function to normalize tone data
const normalizeToneData = (tones) => {
  if (!Array.isArray(tones)) {
    console.error('Invalid tones data:', tones);
    return [];
  }

  return tones.map(tone => ({
    id: tone.tone_id,
    name: tone.tone_name,
    description: tone.tone_description
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

// Helper function to normalize target data
const normalizeTargetData = (targets) => {
  if (!Array.isArray(targets)) {
    console.error('Invalid targets data:', targets);
    return [];
  }

  return targets.map(target => ({
    id: target.target_id,
    name: target.target_name,
    description: target.target_description,
    category: target.target_category
  }));
};

// Helper function to normalize role data
const normalizeRoleData = (roles) => {
  if (!Array.isArray(roles)) {
    console.error('Invalid roles data:', roles);
    return [];
  }

  return roles.map(role => ({
    id: role.role_id,
    name: role.role_name,
    description: role.role_description,
    category: role.role_category
  }));
};

export const loadData = () => {
  try {
    const rawPrompts = promptsNL;
    const rawStyles = stylesNL;
    const rawTones = tonesNL;
    const rawTargets = targetsNL;
    const rawRoles = rolesNL;

    // Normalize data
    const prompts = normalizePromptData(rawPrompts);
    const styles = normalizeStyleData(rawStyles);
    const tones = normalizeToneData(rawTones);
    const targets = normalizeTargetData(rawTargets);
    const roles = normalizeRoleData(rawRoles);

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

    return { prompts, styles, tones, categories, targets, roles };
  } catch (error) {
    console.error('Error loading data:', error);
    return { 
      prompts: [], 
      styles: [], 
      tones: [], 
      categories: [],
      targets: [],
      roles: []
    };
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