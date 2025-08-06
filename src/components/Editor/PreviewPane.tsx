import { useRef, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
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

  const customRenderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : 'text'
      
      return !inline && match ? (
        <SyntaxHighlighter
          style={syntaxTheme}
          language={language}
          PreTag="div"
          customStyle={{
            margin: '0rem 0',
            padding: '0rem',
            borderRadius: '0rem',
            backgroundColor: theme.colors.code,
            border: `1px solid ${theme.colors.border}`,
          }}
          codeTagProps={{
            style: {
              fontFamily: '"Fira Code", "Monaco", "Cascadia Code", "Segoe UI Mono", "Roboto Mono", monospace',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code 
          className={className} 
          style={{
            backgroundColor: theme.colors.code,
            color: theme.colors.text,
            padding: '0.125rem 0.25rem',
            borderRadius: '0.25rem',
            fontFamily: '"Fira Code", "Monaco", "Cascadia Code", "Segoe UI Mono", "Roboto Mono", monospace',
            fontSize: '0.875em',
          }}
          {...props}
        >
          {children}
        </code>
      )
    },
    h1: ({ children, ...props }: any) => (
      <h1 
        style={{ 
          color: theme.colors.heading,
          fontSize: '2.25rem',
          fontWeight: '600',
          marginTop: '2rem',
          marginBottom: '1rem',
          borderBottom: `2px solid ${theme.colors.border}`,
          paddingBottom: '0.5rem',
          lineHeight: '1.25',
        }}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 
        style={{ 
          color: theme.colors.heading,
          fontSize: '1.875rem',
          fontWeight: '600',
          marginTop: '2rem',
          marginBottom: '1rem',
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingBottom: '0.25rem',
          lineHeight: '1.25',
        }}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 
        style={{ 
          color: theme.colors.heading,
          fontSize: '1.5rem',
          fontWeight: '600',
          marginTop: '2rem',
          marginBottom: '1rem',
          lineHeight: '1.25',
        }}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 
        style={{ 
          color: theme.colors.heading,
          fontSize: '1.25rem',
          fontWeight: '600',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          lineHeight: '1.25',
        }}
        {...props}
      >
        {children}
      </h4>
    ),
    a: ({ children, href, ...props }: any) => (
      <a 
        href={href}
        style={{ 
          color: theme.colors.link,
          textDecoration: 'underline',
        }}
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote 
        style={{ 
          margin: '1.5rem 0',
          padding: '1rem 1.5rem',
          borderLeft: `4px solid ${theme.colors.accent}`,
          backgroundColor: theme.colors.code,
          fontStyle: 'italic',
          opacity: 0.9,
        }}
        {...props}
      >
        {children}
      </blockquote>
    ),
    hr: ({ ...props }: any) => (
      <hr 
        style={{ 
          margin: '2rem 0',
          border: 'none',
          borderTop: `1px solid ${theme.colors.border}`,
          opacity: 0.6,
        }}
        {...props}
      />
    ),
    table: ({ children, ...props }: any) => (
      <table 
        style={{ 
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: `1px solid ${theme.colors.border}`,
        }}
        {...props}
      >
        {children}
      </table>
    ),
    th: ({ children, ...props }: any) => (
      <th 
        style={{ 
          padding: '0.75rem',
          textAlign: 'left',
          border: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.code,
          fontWeight: '600',
          color: theme.colors.heading,
        }}
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td 
        style={{ 
          padding: '0.75rem',
          textAlign: 'left',
          border: `1px solid ${theme.colors.border}`,
        }}
        {...props}
      >
        {children}
      </td>
    ),
    ul: ({ children, ...props }: any) => (
      <ul 
        style={{ 
          marginBottom: '1rem',
          paddingLeft: '1.5rem',
          listStyleType: 'disc',
          listStylePosition: 'outside',
        }}
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol 
        style={{ 
          marginBottom: '1rem',
          paddingLeft: '1.5rem',
          listStyleType: 'decimal',
          listStylePosition: 'outside',
        }}
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li 
        style={{ 
          marginBottom: '0.25rem',
          display: 'list-item',
        }}
        {...props}
      >
        {children}
      </li>
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
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            minHeight: '100%',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.fontSize,
            lineHeight: theme.typography.lineHeight,
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={customRenderers}
          >
            {markdown || '# Welcome to Markdown2PNG\n\nStart typing in the editor to see your content here!'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
