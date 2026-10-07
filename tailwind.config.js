/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#121215',
        'surface-elevated': '#18181c',
        'surface-border': '#27272a',
        bronze: {
          50: '#fdfbf7',
          100: '#f9f5eb',
          200: '#f2e7cc',
          300: '#e8d4a6',
          400: '#dcbc7a',
          500: '#cda252',
          600: '#b8893e',
          700: '#956b32',
          800: '#79552d',
          900: '#644627',
        }
      },
    },
  },
  plugins: [],
};
