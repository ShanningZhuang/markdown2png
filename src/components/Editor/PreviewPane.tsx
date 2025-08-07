import { useRef, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import type { Components } from 'react-markdown'
import type { Theme } from '@/types'

interface PreviewPaneProps {
  markdown: string
  theme: Theme
}

export function PreviewPane({ markdown, theme }: PreviewPaneProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  // Choose syntax highlighter theme based on current theme
  const syntaxTheme = useMemo(() => {
    const isDark = ['dark', 'sunset', 'nature'].includes(theme.id)
    return isDark ? oneDark : oneLight
  }, [theme.id])

  const customRenderers: Components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code(props: any) {
      const { inline, className, children, ...otherProps } = props
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : 'text'
      
      return !inline && match ? (
        <SyntaxHighlighter
          style={syntaxTheme}
          language={language}
          PreTag="div"
          {...otherProps}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code 
          className={className}
          {...otherProps}
        >
          {children}
        </code>
      )
    },
    h1: ({ children, ...props }) => (
      <h1 {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 {...props}>
        {children}
      </h4>
    ),
    a: ({ children, href, ...props }) => (
      <a 
        href={href}
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote {...props}>
        {children}
      </blockquote>
    ),
    hr: ({ ...props }) => (
      <hr {...props} />
    ),
    table: ({ children, ...props }) => (
      <table {...props}>
        {children}
      </table>
    ),
    th: ({ children, ...props }) => (
      <th {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td {...props}>
        {children}
      </td>
    ),
    ul: ({ children, ...props }) => (
      <ul {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li {...props}>
        {children}
      </li>
    ),
    p: ({ children, ...props }) => (
      <p {...props}>
        {children}
      </p>
    ),
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Preview</h2>
        <p className="text-xs text-gray-500 mt-1">
          Live preview with {theme.name} theme
        </p>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div 
          ref={previewRef}
          id="preview-content"
          className={`markdown-content theme-${theme.id}`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={customRenderers}
          >
            {markdown || '# Welcome to Markdown2PNG\n\nStart typing in the editor to see your content here!\n\nYou can use inline code like `npm install` or `git commit` in your markdown.'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
