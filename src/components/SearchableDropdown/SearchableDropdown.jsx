import { useState, useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

export default function SearchableDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Zoeken...",
  itemsPerPage = 5
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(itemsPerPage);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Voeg deze console.log toe aan het begin van de component
  console.log('SearchableDropdown props:', {
    options,
    value,
    filteredOptions
  });

  // Sluit dropdown wanneer er buiten wordt geklikt
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset filtered options wanneer options veranderen
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  // Update weergegeven waarde
  useEffect(() => {
    if (value) {
      const selectedOption = options.find(opt => opt.Name === value);
      setSearchTerm(selectedOption ? selectedOption.Name : '');
    } else {
      setSearchTerm('');
    }
  }, [value, options]);

  // Debounced zoekfunctie
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (!options || !Array.isArray(options)) return;
      
      const filtered = options.filter(option => {
        if (!option || !option.Name || !option.Effect) return false;
        return (
          option.Name.toLowerCase().includes(term.toLowerCase()) ||
          option.Effect.toLowerCase().includes(term.toLowerCase())
        );
      });
      setFilteredOptions(filtered);
      setDisplayCount(itemsPerPage);
    }, 300),
    [options, itemsPerPage]
  );

  const handleInputChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    setIsOpen(true);
    debouncedSearch(newTerm);
  };

  const handleOptionClick = (option) => {
    onChange(option.Name);
    setSearchTerm(option.Name);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      />

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg">
          <ul className="max-h-60 overflow-auto">
            {filteredOptions?.map((option, index) => {
              console.log('Rendering option:', option);
              return (
                <li
                  key={`${option.id}-${index}`}
                  onClick={() => handleOptionClick(option)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group relative"
                >
                  <div className="font-medium">{option.Name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:block">
                    {option.Effect}
                  </div>
                </li>
              );
            })}
          </ul>
          
          {filteredOptions?.length > displayCount && (
            <button
              onClick={() => setDisplayCount(prev => prev + itemsPerPage)}
              className="w-full p-2 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-600"
            >
              Meer laden...
            </button>
          )}
          
          {(!filteredOptions || filteredOptions.length === 0) && (
            <div className="p-2 text-gray-500 dark:text-gray-400 text-center">
              Geen resultaten gevonden
            </div>
          )}
        </div>
      )}
    </div>
  );
} 