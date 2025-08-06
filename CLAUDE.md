# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Markdown2PNG is a Next.js web application that converts Markdown content into beautiful, shareable PNG images with multiple professional themes. It's a frontend-only application using html2canvas for image generation.

## Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Architecture Overview

### Theme System
- **Theme definitions**: Located in `src/components/Themes/ThemeProvider.tsx`
- **8 built-in themes**: light, dark, warm, elegant, nature, sunset, ocean, mint
- **Theme structure**: Each theme defines colors, typography, and styling via CSS variables in `src/styles/globals.css`
- **Theme application**: Uses CSS classes `.theme-{id}` applied to the preview container

### Core Components Structure
- **MarkdownEditor** (`src/components/Editor/MarkdownEditor.tsx`): Textarea-based editor with syntax highlighting
- **PreviewPane** (`src/components/Editor/PreviewPane.tsx`): Real-time markdown rendering with react-markdown
- **ExportButton** (`src/components/Export/ExportButton.tsx`): Handles PNG export and clipboard operations
- **ThemeSelector** (`src/components/Themes/ThemeSelector.tsx`): Theme switching interface

### Image Export Pipeline
The export system in `src/utils/imageExport.ts` uses a sophisticated process:

1. **Fixed-width approach**: Uses 896px width (56rem) with content-determined height
2. **Element cloning**: html2canvas creates a cloned DOM tree for rendering
3. **Style synchronization**: Copies computed styles from original to cloned elements to ensure identical rendering
4. **CSS variable resolution**: Replaces theme CSS variables with actual color values in the cloned document
5. **Element-by-element style copying**: Maps each original element to its clone and copies all layout properties (margins, padding, fonts)

### Key Technical Considerations

#### Export Alignment Issues
- **Problem**: html2canvas rendering can differ from browser preview due to font rendering, box model differences, and CSS variable handling
- **Solution**: The export process performs comprehensive style copying from original elements to cloned elements, including individual margin/padding properties to prevent CSS shorthand conflicts

#### Theme Implementation
- **CSS Variables**: Each theme is defined using CSS custom properties (e.g., `--theme-light-bg`, `--theme-dark-text`)
- **Global CSS**: All theme styles are defined in `src/styles/globals.css` with theme-specific selectors
- **Dynamic switching**: ThemeProvider manages theme state and applies appropriate CSS classes

#### Markdown Processing
- **react-markdown**: Primary markdown parser with remark-gfm for GitHub Flavored Markdown
- **Syntax highlighting**: Uses Prism.js via react-syntax-highlighter with theme-aware color schemes
- **Custom renderers**: PreviewPane includes custom renderers for consistent styling across all markdown elements

## File Structure Context

```
src/
├── components/
│   ├── Editor/          # Markdown editor and preview
│   ├── Export/          # Image export functionality  
│   ├── Themes/          # Theme system (provider, selector)
│   └── Layout/          # Header and layout components
├── styles/
│   ├── globals.css      # All theme definitions and markdown styling
│   └── themes/          # (Empty - all styles in globals.css)
├── utils/
│   └── imageExport.ts   # Complex html2canvas export logic
├── types/
│   └── index.ts         # TypeScript interfaces for Theme, ExportOptions, etc.
└── pages/               # Next.js pages (main app in index.tsx)
```

## Working with Exports

When modifying the export functionality:
- **Test with multiple themes**: Export behavior can vary significantly between themes
- **Check alignment**: Text, code blocks, lists, and tables must align consistently between preview and export
- **Window size independence**: Exports should produce identical results regardless of browser window size
- **Element positioning**: Use `getComputedStyle()` to copy exact positioning from original to cloned elements

## Important Constants

- **Fixed export width**: 896px (defined in `FIXED_WIDTH` in imageExport.ts)
- **Default export scale**: 2x for high DPI (defined in `defaultExportOptions`)
- **Theme count**: 8 themes (light, dark, warm, elegant, nature, sunset, ocean, mint)

## TypeScript Types

Key interfaces defined in `src/types/index.ts`:
- `Theme`: Complete theme definition with colors and typography
- `ExportOptions`: Configuration for image export (format, quality, scale, dimensions)
- `ThemeId`: Union type of all available theme IDs
- `EditorState`: Application state management