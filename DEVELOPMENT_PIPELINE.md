# Markdown2PNG Development Pipeline

## Phase 1: Project Setup (Week 1)

### 1.1 Initialize Project
```bash
npx create-next-app@latest markdown2png --typescript --tailwind --eslint
cd markdown2png
```

### 1.2 Install Core Dependencies
```bash
# Markdown processing
npm install react-markdown remark-gfm rehype-highlight

# Image generation
npm install html2canvas dom-to-image

# Code highlighting
npm install prismjs react-syntax-highlighter

# UI components
npm install @headlessui/react @heroicons/react

# Utilities
npm install clsx tailwind-merge
```

### 1.3 Project Structure
```
src/
├── components/
│   ├── Editor/
│   │   ├── MarkdownEditor.tsx
│   │   └── PreviewPane.tsx
│   ├── Themes/
│   │   ├── ThemeSelector.tsx
│   │   └── ThemeProvider.tsx
│   ├── Export/
│   │   └── ExportButton.tsx
│   └── Layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── styles/
│   ├── themes/
│   │   ├── light.css
│   │   ├── dark.css
│   │   └── [other-themes].css
│   └── globals.css
├── utils/
│   ├── imageExport.ts
│   ├── markdownParser.ts
│   └── themes.ts
├── types/
│   └── index.ts
└── pages/
    ├── index.tsx
    └── api/
        └── export.ts
```

## Phase 2: Core Components (Week 2)

### 2.1 Markdown Editor Component
- Split-pane layout (editor + preview)
- Real-time preview updates
- Syntax highlighting in editor
- Responsive design

### 2.2 Theme System
- CSS custom properties for themes
- Theme switcher component
- 8 predefined themes matching md2image
- Theme persistence in localStorage

### 2.3 Preview Rendering
- Markdown to HTML conversion
- Code syntax highlighting
- Custom styling for each theme
- Responsive preview pane

## Phase 3: Advanced Features (Week 3)

### 3.1 Image Export Functionality
```typescript
// Core export logic
const exportToImage = async (element: HTMLElement, theme: string) => {
  const canvas = await html2canvas(element, {
    backgroundColor: getThemeBackground(theme),
    scale: 2, // High resolution
    useCORS: true
  });
  
  return canvas.toDataURL('image/png');
};
```

### 3.2 Theme Implementation
- Light theme (clean, professional)
- Dark theme (high contrast)
- Warm theme (amber colors)
- Elegant theme (modern styling)
- Nature theme (green palette)
- Sunset theme (orange gradients)
- Ocean theme (blue palette)
- Mint theme (mint green accents)

### 3.3 Code Highlighting
- Support for 180+ languages
- Custom theme-aware highlighting
- Line numbers (optional)
- Copy code functionality

## Phase 4: User Experience (Week 4)

### 4.1 Responsive Design
- Mobile-first approach
- Collapsible panels on mobile
- Touch-friendly controls
- Optimized for tablets

### 4.2 Performance Optimization
- Debounced preview updates
- Lazy loading of themes
- Image export optimization
- Bundle size optimization

### 4.3 Additional Features
- Download functionality
- Copy to clipboard
- Share functionality
- Example templates

## Phase 5: Polish & Deploy (Week 5)

### 5.1 Testing
- Unit tests for utilities
- Integration tests for components
- Cross-browser testing
- Mobile device testing

### 5.2 SEO & Performance
- Meta tags optimization
- Open Graph tags
- Performance monitoring
- Lighthouse optimization

### 5.3 Deployment
- Deploy to Vercel/Netlify
- Custom domain setup
- Analytics integration
- Error monitoring

## Technical Implementation Details

### Key Algorithms

1. **Real-time Preview**
```typescript
const useMarkdownPreview = (markdown: string, theme: string) => {
  const [html, setHtml] = useState('');
  
  useEffect(() => {
    const debounced = debounce(() => {
      const rendered = markdownToHtml(markdown);
      setHtml(rendered);
    }, 300);
    
    debounced();
  }, [markdown, theme]);
  
  return html;
};
```

2. **Theme System**
```typescript
const themes = {
  light: {
    background: '#ffffff',
    text: '#1a1a1a',
    accent: '#3b82f6',
    code: '#f3f4f6'
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    accent: '#60a5fa',
    code: '#374151'
  }
  // ... other themes
};
```

3. **Image Export**
```typescript
const exportImage = async (contentRef: RefObject<HTMLElement>) => {
  if (!contentRef.current) return;
  
  const canvas = await html2canvas(contentRef.current, {
    backgroundColor: null,
    scale: 2,
    logging: false,
    useCORS: true
  });
  
  const link = document.createElement('a');
  link.download = 'markdown-image.png';
  link.href = canvas.toDataURL();
  link.click();
};
```

## Development Milestones

- **Week 1**: Project setup, basic layout
- **Week 2**: Markdown editor and preview
- **Week 3**: Theme system and export
- **Week 4**: Responsive design and UX
- **Week 5**: Testing, optimization, deployment

## Success Metrics

- Real-time preview with <300ms latency
- Support for all major Markdown features
- 8 professional themes
- Mobile-responsive design
- High-quality image export (2x resolution)
- Cross-browser compatibility
- Lighthouse score >90
