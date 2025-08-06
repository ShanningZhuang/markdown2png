import { useCallback, useRef, useEffect } from 'react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      // Insert tab character
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)

      // Move cursor to after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }, [value, onChange])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.max(textarea.scrollHeight, 200)}px`
    }
  }, [value])

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Markdown Editor</h2>
        <p className="text-xs text-gray-500 mt-1">
          Type your markdown content here. Use Tab for indentation.
        </p>
      </div>
      
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full h-full resize-none border-0 focus:ring-0 p-4 font-mono text-sm leading-relaxed"
          placeholder="# Start writing your markdown here...

## Features
- Real-time preview
- Multiple themes
- Code highlighting
- Export to PNG

```javascript
console.log('Hello, Markdown2PNG!');
```

> Start typing to see the live preview!"
          style={{
            minHeight: '100%',
            fontFamily: '"Fira Code", "Monaco", "Cascadia Code", "Segoe UI Mono", "Roboto Mono", monospace',
          }}
          spellCheck={false}
        />
        
        {/* Line numbers overlay could go here */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow-sm">
          {value.split('\n').length} lines, {value.length} chars
        </div>
      </div>
    </div>
  )
}
