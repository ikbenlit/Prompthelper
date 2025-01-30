import { useState, useRef } from 'react';

export default function InfoTooltip({ text }) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);

  return (
    <div className="relative inline-block">
      <button
        className="ml-2 p-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Meer informatie"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          className="fill-current"
          viewBox="0 0 256 256"
        >
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
        </svg>
      </button>

      {isVisible && (
        <div 
          ref={tooltipRef}
          className="absolute z-50 w-80 p-3 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in"
          style={{
            bottom: 'calc(100% + 0.5rem)',
            right: '-0.5rem',
            transform: 'translateX(50%)',
            maxWidth: 'calc(100vw - 4rem)',
            maxHeight: 'calc(100vh - 4rem)',
            overflowY: 'auto'
          }}
        >
          {text}
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate(45deg) translate(-50%, 50%)" />
        </div>
      )}
    </div>
  );
} 