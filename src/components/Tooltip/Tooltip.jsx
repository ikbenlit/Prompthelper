import { useState, useRef, useEffect } from 'react';

export default function Tooltip({ children, description }) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      setPosition({
        x: rect.left + (rect.width * 0.75),
        y: rect.top - 5
      });
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        ref={tooltipRef}
      >
        {children}
      </div>
      
      {isVisible && description && (
        <div 
          className="absolute z-50 p-2 text-sm bg-gray-900 text-white rounded-md shadow-lg max-w-xs animate-fade-in -translate-y-full"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {description}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
} 