import { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../hooks/useSearch';
import InfoTooltip from '../InfoTooltip/InfoTooltip';

export default function SearchableDropdown({
  options,
  value = '',
  onChange,
  label,
  placeholder = "Zoeken...",
  helpText,
  itemsPerPage = 5
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const searchConfig = {
    keys: ['Name', 'Effect'],
    transform: option => ({
      ...option,
      label: option.Name,
      value: option.id
    })
  };

  const { 
    searchTerm, 
    setSearchTerm, 
    results: filteredOptions,
    loading 
  } = useSearch(options, searchConfig);

  // Bereken weergegeven opties
  const displayedOptions = filteredOptions?.slice(0, page * itemsPerPage);

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
    setSearchTerm('');
    setPage(1);
  }, [setSearchTerm]);

  // Update weergegeven waarde
  useEffect(() => {
    if (value !== undefined) {
      const selectedOption = options?.find(opt => opt.Name === value);
      setSearchTerm(selectedOption ? selectedOption.Name : '');
    } else {
      setSearchTerm('');
    }
  }, [value, options, setSearchTerm]);

  const handleInputChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    setIsOpen(true);
    setPage(1);
  };

  const handleOptionClick = (option) => {
    onChange(option.Name);
    setSearchTerm(option.Name);
    setIsOpen(false);
  };

  return (
    <div className="relative max-w-md" ref={dropdownRef}>
      <div className="flex items-center mb-2">
        <label className="block text-sm font-medium">{label}</label>
        {helpText && <InfoTooltip text={helpText} />}
      </div>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-1.5 rounded-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg overflow-hidden">
          <ul className="max-h-60 overflow-auto">
            {displayedOptions?.map((option, index) => (
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
            ))}
          </ul>
          
          {filteredOptions?.length > displayedOptions.length && (
            <button
              onClick={() => setPage(prev => prev + 1)}
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