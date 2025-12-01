/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-black': '#0B0E11',
        'soft-lavender': '#C7B8FF',
        'blueprint-purple': '#6D5AE0',
        'graphite-gray': '#8B8F9A',
        'border-gray': '#2F333A',
        'surface-gray': '#1A1D21',
        'off-white': '#F5F5F7',
      },
      fontFamily: {
        'sora': ['Sora', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '18px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};
