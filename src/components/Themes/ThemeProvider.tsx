import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Theme, ThemeId } from '@/types'

const themes: Record<ThemeId, Theme> = {
  light: {
    id: 'light',
    name: 'Light',
    description: 'Clean and professional with excellent readability',
    colors: {
      background: '#ffffff',
      text: '#1a1a1a',
      accent: '#3b82f6',
      code: '#f3f4f6',
      border: '#e5e7eb',
      heading: '#111827',
      link: '#2563eb',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.7',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes with striking contrast',
    colors: {
      background: '#1a1a1a',
      text: '#ffffff',
      accent: '#60a5fa',
      code: '#374151',
      border: '#374151',
      heading: '#f9fafb',
      link: '#93c5fd',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.7',
    },
  },
  warm: {
    id: 'warm',
    name: 'Warm',
    description: 'Soft, inviting colors perfect for engaging content',
    colors: {
      background: '#fefdf9',
      text: '#1c1917',
      accent: '#f59e0b',
      code: '#fef3c7',
      border: '#fed7aa',
      heading: '#78350f',
      link: '#d97706',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.7',
    },
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Modern and stylish for a premium look',
    colors: {
      background: '#fafaf9',
      text: '#0c0a09',
      accent: '#6366f1',
      code: '#f5f5f4',
      border: '#e7e5e4',
      heading: '#1c1917',
      link: '#4f46e5',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.7',
    },
  },
  nature: {
    id: 'nature',
    name: 'Nature',
    description: 'Fresh and organic with natural color tones',
    colors: {
      background: '#fefffe',
      text: '#14532d',
      accent: '#22c55e',
      code: '#f0fdf4',
      border: '#bbf7d0',
      heading: '#052e16',
      link: '#16a34a',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.7',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm and vibrant like a beautiful sunset',
    colors: {
      background: '#fffbeb',
      text: '#9a3412',
      accent: '#ea580c',
      code: '#fed7aa',
      border: '#fdba74',
      heading: '#7c2d12',
      link: '#dc2626',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.7',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calm and serene with blue color palette',
    colors: {
      background: '#f8fafc',
      text: '#0f172a',
      accent: '#0ea5e9',
      code: '#e0f2fe',
      border: '#7dd3fc',
      heading: '#0c4a6e',
      link: '#0284c7',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.7',
    },
  },
  mint: {
    id: 'mint',
    name: 'Mint',
    description: 'Cool and refreshing with mint green accents',
    colors: {
      background: '#fdfffe',
      text: '#064e3b',
      accent: '#10b981',
      code: '#ecfdf5',
      border: '#a7f3d0',
      heading: '#022c22',
      link: '#059669',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.7',
    },
  },
}

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (themeId: ThemeId) => void
  themes: Record<ThemeId, Theme>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('light')

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('markdown2png-theme') as ThemeId
    if (savedTheme && themes[savedTheme]) {
      setCurrentThemeId(savedTheme)
    }
  }, [])

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('markdown2png-theme', currentThemeId)
  }, [currentThemeId])

  const setTheme = (themeId: ThemeId) => {
    setCurrentThemeId(themeId)
  }

  const value = {
    currentTheme: themes[currentThemeId],
    setTheme,
    themes,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
