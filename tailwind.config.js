const colors = [
  'blue',    // Productiviteit
  'purple',  // Schrijven
  'green',   // Sociaal
  'yellow',  // Gezondheid
  'orange',  // Marketing
  'red',     // Ondernemerschap
  'cyan',    // Entertainment
  'pink',    // Amusement
  'indigo',  // Vermaak
  'gray'     // Fallback
];
const colorVariants = ['50', '100', '600', '700', '900'];

const customColors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  accent: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  }
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    ...colors.flatMap(color => 
      colorVariants.flatMap(variant => [
        `bg-${color}-${variant}`,
        `text-${color}-${variant}`,
        `hover:bg-${color}-${variant}`,
        `dark:bg-${color}-${variant}`,
        `dark:text-${color}-${variant}`,
        `dark:hover:bg-${color}-${variant}`,
        `bg-${color}-900/10`,
        `bg-${color}-900/20`,
        `dark:bg-${color}-900/10`,
        `dark:bg-${color}-900/20`,
        'bg-gradient-to-r',
        'from-blue-600',
        'via-purple-600',
        'to-pink-600',
      ])
    ),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: customColors,
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'moveGrid': 'moveGrid 20s linear infinite',
        'wavePulse': 'wavePulse 8s ease-in-out infinite',
        'beamRise': 'beamRise 4s ease-in-out infinite',
        'lightBeam': 'lightBeam 6s linear infinite',
        'bearWatch': 'bearWatch 0.3s ease-in-out',
        'bearHide': 'bearHide 0.3s ease-in-out'
      },
      keyframes: {
        moveGrid: {
          '0%': { transform: 'perspective(1000px) rotateX(60deg) translateY(0)' },
          '100%': { transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)' },
        },
        
    moveGrid: {
          '0%': { transform: 'perspective(1000px) rotateX(60deg) translateY(0)' },
          '100%': { transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)' }
        },
        lightBeam: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '50%': { opacity: 0.5 },
          '100%': { transform: 'translateY(-100%)', opacity: 0 },
      },
        bearWatch: {
          '0%': { transform: 'translateY(2px)' },
          '100%': { transform: 'translateY(0)' }
        },
        bearHide: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(2px)' }
        }
    },
  },
  plugins: [],
}
}
