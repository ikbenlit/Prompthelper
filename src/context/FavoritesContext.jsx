import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const addFavorite = (prompt) => {
    if (!prompt) return;
    setFavorites(prev => [...prev, prompt]);
  };

  const removeFavorite = (prompt) => {
    if (!prompt?.prompt_id) return;
    setFavorites(prev => prev.filter(fav => fav.prompt_id !== prompt.prompt_id));
  };

  const isFavorite = (prompt) => {
    if (!prompt?.prompt_id) return false;
    return favorites.some(fav => fav.prompt_id === prompt.prompt_id);
  };

  const getFavoriteById = (promptId) => {
    return favorites.find(fav => fav.prompt_id === promptId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addFavorite, 
      removeFavorite, 
      isFavorite,
      getFavoriteById
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
} 