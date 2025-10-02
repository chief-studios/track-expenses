/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black and Smoke White Color Scheme
        primary: {
          50: '#f8fafc',   // Very light smoke white
          100: '#f1f5f9',  // Light smoke white
          200: '#e2e8f0',  // Smoke white
          300: '#cbd5e1',  // Medium smoke
          400: '#94a3b8',  // Dark smoke
          500: '#64748b',  // Slate gray
          600: '#475569',  // Dark slate
          700: '#334155',  // Very dark slate
          800: '#1e293b',  // Almost black
          900: '#0f172a',  // Deep black
          950: '#020617',  // Pure black
        },
        // Custom blacks and whites
        'smoke-white': {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
        },
        'pure-black': '#000000',
        'soft-black': '#0a0a0a',
        'charcoal': '#1a1a1a',
      },
      backgroundColor: {
        'app-bg': '#fafafa',        // Light smoke white background
        'card-bg': '#ffffff',       // Pure white for cards
        'dark-bg': '#0f172a',       // Dark background
        'sidebar-bg': '#ffffff',    // White sidebar
        'header-bg': '#ffffff',     // White header
      },
      textColor: {
        'primary-text': '#0f172a',  // Deep black for primary text
        'secondary-text': '#64748b', // Slate gray for secondary text
        'muted-text': '#94a3b8',    // Light slate for muted text
      },
      borderColor: {
        'app-border': '#e2e8f0',    // Light smoke border
        'dark-border': '#334155',   // Dark border
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
