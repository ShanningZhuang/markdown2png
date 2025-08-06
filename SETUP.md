# Markdown2PNG Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Overview

This is a **100% frontend application** that converts Markdown to PNG images entirely in the browser. No backend required!

### Key Features Implemented:
- ✅ **Real-time Markdown Preview** with React Markdown
- ✅ **8 Professional Themes** (Light, Dark, Warm, Elegant, Nature, Sunset, Ocean, Mint)
- ✅ **Syntax Highlighting** for 180+ languages using Prism.js
- ✅ **Frontend Image Export** using html2canvas
- ✅ **Responsive Design** for mobile and desktop
- ✅ **Theme Persistence** using localStorage
- ✅ **High-Quality Export** (2x scale for crisp images)
- ✅ **Copy to Clipboard** support

### Technology Stack:
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **Markdown**: react-markdown + remark-gfm
- **Code Highlighting**: react-syntax-highlighter + Prism.js
- **Image Export**: html2canvas (browser-based)
- **UI Components**: Headless UI

## How It Works

### Frontend-Only Image Generation:
1. **User types Markdown** in the editor (left pane)
2. **Live preview** renders in real-time (right pane) 
3. **Theme system** applies CSS variables for styling
4. **html2canvas** converts the DOM to a high-quality PNG
5. **Browser downloads** the image + copies to clipboard

### No Backend Needed:
- All processing happens in the browser
- No server costs or infrastructure required
- Works offline after initial load
- User data never leaves their browser
- Unlimited usage for free

## Development Scripts

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run export       # Export as static site

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set up automatic deployments from GitHub
vercel --prod
```

### Option 2: Netlify
```bash
# Build the project
npm run build

# Deploy the 'out' folder to Netlify
# Or connect your GitHub repo for automatic deployments
```

### Option 3: Static Hosting
```bash
# Export as static files
npm run build
npm run export

# Upload the 'out' folder to any static hosting service
# (GitHub Pages, S3, Firebase Hosting, etc.)
```

## File Structure

```
src/
├── components/
│   ├── Editor/
│   │   ├── MarkdownEditor.tsx     # Textarea with syntax
│   │   └── PreviewPane.tsx        # Live markdown preview
│   ├── Export/
│   │   └── ExportButton.tsx       # PNG export functionality
│   ├── Layout/
│   │   └── Header.tsx             # App header
│   └── Themes/
│       ├── ThemeProvider.tsx      # Theme context & data
│       └── ThemeSelector.tsx      # Theme dropdown
├── hooks/
│   └── useDebounce.ts             # Performance optimization
├── styles/
│   └── globals.css                # Theme CSS variables
├── types/
│   └── index.ts                   # TypeScript definitions
├── utils/
│   ├── debounce.ts                # Utility functions
│   └── imageExport.ts             # Core export logic
└── pages/
    ├── _app.tsx                   # App wrapper
    └── index.tsx                  # Main page
```

## Customization

### Adding New Themes:
1. Add theme colors to `src/components/Themes/ThemeProvider.tsx`
2. Add CSS variables to `src/styles/globals.css`
3. Update the `ThemeId` type in `src/types/index.ts`

### Modifying Export Options:
- Edit `src/utils/imageExport.ts` for different formats
- Adjust `defaultExportOptions` for quality/scale changes
- Modify `html2canvas` options for different rendering

### Customizing UI:
- All styling uses Tailwind CSS
- Theme colors are CSS variables
- Components are fully customizable

## Performance Notes

- **Debounced preview updates** (300ms delay)
- **Optimized re-renders** with React.memo and useMemo
- **Lazy loading** of syntax highlighter themes
- **Font preloading** for better export quality
- **2x scale exports** for high-DPI displays

## Browser Support

- ✅ Chrome 76+
- ✅ Firefox 69+
- ✅ Safari 14+
- ✅ Edge 79+

Required APIs:
- Canvas API (for image generation)
- Clipboard API (for copy functionality)
- CSS Custom Properties (for themes)

## Troubleshooting

### Export Issues:
- Ensure no CORS errors in console
- Check that fonts are loaded before export
- Try refreshing if export fails

### Performance Issues:
- Reduce markdown content size
- Disable live preview for very large documents
- Use simpler themes for better performance

### Mobile Issues:
- Use the preview toggle button
- Rotate device for better editing experience
- Export works on mobile but may be slower
