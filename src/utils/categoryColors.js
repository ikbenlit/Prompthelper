export const getCategoryColor = (category) => {
  const colors = {
    'Productiviteit': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    'Schrijven': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    'Marketing': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    'Ondernemerschap': 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    'Amusement': 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
    'Sociaal': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    // Voeg meer categorieën toe indien nodig
  };

  return colors[category] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
}; 