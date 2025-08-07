import { useState } from 'react'
import Head from 'next/head'
import { Header } from '@/components/Layout/Header'
import { MarkdownEditor } from '@/components/Editor/MarkdownEditor'
import { PreviewPane } from '@/components/Editor/PreviewPane'
import { ThemeSelector } from '@/components/Themes/ThemeSelector'
import { ExportButton } from '@/components/Export/ExportButton'
import { useTheme } from '@/components/Themes/ThemeProvider'
import type { ThemeId } from '@/types'

const DEFAULT_MARKDOWN = `# Welcome to Markdown2PNG

Transform your **Markdown** content into beautiful images!

## Features

- 🎨 **8 Professional Themes**
- ⚡ **Real-time Preview** 
- 💻 **Code Highlighting**
- 📱 **Mobile Responsive**
- 🖼️ **High-Quality Export**

### Theme Comparison Table

| Feature | Light | Dark | Warm | Elegant |
|---------|-------|------|------|---------|
| Background | White | Dark Gray | Warm Beige | Clean Gray |
| Text Color | Dark | Light | Brown | Charcoal |
| Code Blocks | Gray BG | Dark Blue | Warm Tan | Light Blue |
| Tables | Clean | High Contrast | Warm Tones | Minimal |
| Best For | Documentation | Night Reading | Blogs | Professional |

### Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to Markdown2PNG\`;
}

greet("Developer");
\`\`\`

### How to Use

1. **Write your markdown** in the left editor
2. **Choose a theme** from the dropdown  
3. **Copy** to clipboard or **Download** as PNG
4. **Share** anywhere!

You can also use inline code like \`npm install\`, \`git commit -m "message"\`, or \`docker run\` in your markdown content.

> **Tip**: Try different themes to see how your content looks! The table above shows the differences between themes.

---

*Made by 🤖 [Shanning Zhuang](https://shanningzhuang.github.io/)*
Code open-sourced on [GitHub](https://github.com/ShanningZhuang/markdown2png)
`

export default function Home() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [isPreviewVisible, setIsPreviewVisible] = useState(true)
  const { currentTheme, setTheme } = useTheme()

  const handleThemeChange = (themeId: ThemeId) => {
    setTheme(themeId)
  }

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible)
  }

  return (
    <>
      <Head>
        <title>Markdown2PNG - Convert Markdown to Beautiful Images</title>
        <meta name="description" content="Transform your Markdown content into beautiful, shareable PNG images with multiple professional themes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#3B82F6" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        {/* Controls */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <ThemeSelector 
                currentTheme={currentTheme.id as ThemeId}
                onThemeChange={handleThemeChange}
              />
              
              <button
                onClick={togglePreview}
                className="md:hidden px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {isPreviewVisible ? 'Show Editor' : 'Show Preview'}
              </button>
            </div>
            
            <ExportButton markdown={markdown} theme={currentTheme} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className={`${isPreviewVisible ? 'hidden md:block md:w-1/2' : 'w-full'} border-r border-gray-200`}>
            <MarkdownEditor 
              value={markdown}
              onChange={setMarkdown}
            />
          </div>

          {/* Preview */}
          <div className={`${isPreviewVisible ? 'w-full md:w-1/2' : 'hidden'} bg-white`}>
            <PreviewPane 
              markdown={markdown}
              theme={currentTheme}
            />
          </div>
        </div>
      </div>
    </>
  )
}
