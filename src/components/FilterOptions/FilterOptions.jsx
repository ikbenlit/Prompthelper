import React from 'react';
import { usePrompts } from '../../context/PromptContext';
import { useTranslation } from 'react-i18next';

function FilterOptions() {
  const { prompts } = usePrompts();
  const { t } = useTranslation();
  
  // Haal unieke categorieën op uit de prompts
  const categories = [...new Set(prompts.map(prompt => prompt.Categorie))];

  return (
    <div className="flex flex-wrap gap-4 my-6">
      <select 
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">{t('filters.allCategories')}</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterOptions; 