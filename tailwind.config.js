/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#fafafa',
        surface: {
          DEFAULT: '#ffffff',
          raised: '#f4f4f5',
          inset: '#f4f4f5',
          border: '#e4e4e7',
          borderDark: '#18181b',
        },
        transit: {
          yellow: '#facc15',
          yellowHover: '#eab308',
        }
      },
    },
  },
  plugins: [],
};
