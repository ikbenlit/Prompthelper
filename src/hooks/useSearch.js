import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';

export const useSearch = (items, config = {}) => {
  const {
    keys = ['Name', 'Effect'],
    debounceMs = 300,              // Default debounce time
    minLength = 0,                 // Minimum search term length
    transform,                     // Optional transform function for results
    sortBy,                        // Optional sort function
    filterFn,                      // Optional custom filter function
  } = config;

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(items);
  const [loading, setLoading] = useState(false);

  // Default filter function
  const defaultFilterFn = useCallback((item, term) => {
    if (!term || term.length < minLength) return true;
    
    return keys.some(key => {
      const value = item[key];
      if (!value) return false;
      return value.toString().toLowerCase().includes(term.toLowerCase());
    });
  }, [keys, minLength]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term, items) => {
      setLoading(true);
      
      try {
        let filtered = items;

        if (term) {
          filtered = items.filter(item => 
            (filterFn || defaultFilterFn)(item, term)
          );
        }

        if (sortBy) {
          filtered = [...filtered].sort(sortBy);
        }

        if (transform) {
          filtered = filtered.map(transform);
        }

        setResults(filtered);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs),
    [defaultFilterFn, filterFn, sortBy, transform]
  );

  // Update results when items or search term changes
  useEffect(() => {
    debouncedSearch(searchTerm, items);
  }, [items, searchTerm, debouncedSearch]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    reset: () => setSearchTerm('')
  };
}; 