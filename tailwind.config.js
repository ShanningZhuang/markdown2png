/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Theme-specific colors
        theme: {
          light: {
            bg: '#ffffff',
            text: '#1a1a1a',
            accent: '#3b82f6',
            code: '#f3f4f6',
          },
          dark: {
            bg: '#1a1a1a',
            text: '#ffffff',
            accent: '#60a5fa',
            code: '#374151',
          },
          warm: {
            bg: '#fefdf9',
            text: '#1c1917',
            accent: '#f59e0b',
            code: '#fef3c7',
          },
          elegant: {
            bg: '#fafaf9',
            text: '#0c0a09',
            accent: '#6366f1',
            code: '#f5f5f4',
          },
          nature: {
            bg: '#fefffe',
            text: '#14532d',
            accent: '#22c55e',
            code: '#f0fdf4',
          },
          sunset: {
            bg: '#fffbeb',
            text: '#9a3412',
            accent: '#ea580c',
            code: '#fed7aa',
          },
          ocean: {
            bg: '#f8fafc',
            text: '#0f172a',
            accent: '#0ea5e9',
            code: '#e0f2fe',
          },
          mint: {
            bg: '#fdfffe',
            text: '#064e3b',
            accent: '#10b981',
            code: '#ecfdf5',
          },
        },
      },
      fontFamily: {
        'mono': ['Fira Code', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            pre: {
              backgroundColor: 'transparent',
              color: 'inherit',
            },
            code: {
              backgroundColor: 'transparent',
              color: 'inherit',
              fontWeight: '500',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
