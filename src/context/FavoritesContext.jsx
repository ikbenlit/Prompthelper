import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (prompt) => {
    setFavorites(prev => [...prev, prompt]);
  };

  const removeFavorite = (prompt) => {
    setFavorites(prev => 
      prev.filter(fav => 
        (fav.Title || fav.Titel) !== (prompt.Title || prompt.Titel)
      )
    );
  };

  const isFavorite = (prompt) => {
    return favorites.some(fav => 
      (fav.Title || fav.Titel) === (prompt.Title || prompt.Titel)
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
} 