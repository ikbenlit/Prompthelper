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
      ])
    ),
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}

