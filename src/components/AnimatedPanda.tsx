import React from 'react';

const AnimatedPanda: React.FC = () => {
  return (
    <div className="relative w-[500px] h-[500px]">
      <object
        data="/src/assets/img/panda-animated.svg"
        type="image/svg+xml"
        className="w-full h-full"
        id="panda-svg"
        onLoad={() => {
          // Je kunt hier de SVG elementen selecteren en animeren
          const svg = document.getElementById('panda-svg');
          const svgDoc = (svg as any)?.contentDocument;
          
          if (svgDoc) {
            // Bijvoorbeeld de ogen laten knipperen
            const leftEye = svgDoc.getElementById('left-eye');
            const rightEye = svgDoc.getElementById('right-eye');
            
            // Voeg animatie classes toe
            leftEye?.classList.add('animate-blink');
            rightEye?.classList.add('animate-blink');
          }
        }}
      />
    </div>
  );
};

export default AnimatedPanda; 