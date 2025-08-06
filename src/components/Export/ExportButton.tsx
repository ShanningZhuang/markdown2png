import { useState } from 'react'
import { ArrowDownTrayIcon, PhotoIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import { exportToImage, downloadImage, copyImageToClipboard } from '@/utils/imageExport'
import type { Theme } from '@/types'

interface ExportButtonProps {
  markdown: string
  theme: Theme
}

export function ExportButton({ markdown, theme }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleExport = async () => {
    if (isExporting) return

    const previewElement = document.getElementById('preview-content')
    if (!previewElement) {
      setExportStatus('error')
      setTimeout(() => setExportStatus('idle'), 3000)
      return
    }

    setIsExporting(true)
    setExportStatus('idle')

    try {
      const result = await exportToImage(previewElement, theme, {
        scale: 2,
        format: 'png',
      })

      if (result.success && result.dataUrl && result.fileName) {
        downloadImage(result.dataUrl, result.fileName)
        setExportStatus('success')
        
        // Try to copy to clipboard as well (if supported)
        try {
          await copyImageToClipboard(result.dataUrl)
        } catch {
          // Clipboard copy failed, but download succeeded
        }
      } else {
        throw new Error(result.error || 'Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('error')
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportStatus('idle'), 3000)
    }
  }

  const getButtonText = () => {
    if (isExporting) return 'Exporting...'
    if (exportStatus === 'success') return 'Exported!'
    if (exportStatus === 'error') return 'Export Failed'
    return 'Export PNG'
  }

  const getButtonIcon = () => {
    if (isExporting) {
      return (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="none"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )
    }
    
    if (exportStatus === 'success') {
      return <ClipboardIcon className="h-5 w-5" />
    }
    
    if (exportStatus === 'error') {
      return <PhotoIcon className="h-5 w-5" />
    }
    
    return <ArrowDownTrayIcon className="h-5 w-5" />
  }

  const getButtonStyle = () => {
    if (exportStatus === 'success') {
      return 'bg-green-600 hover:bg-green-700 text-white'
    }
    if (exportStatus === 'error') {
      return 'bg-red-600 hover:bg-red-700 text-white'
    }
    return 'bg-blue-600 hover:bg-blue-700 text-white'
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        disabled={isExporting || !markdown.trim()}
        className={`
          inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${getButtonStyle()}
        `}
      >
        {getButtonIcon()}
        <span className="ml-2">{getButtonText()}</span>
      </button>
      
      {/* Export info */}
      <div className="hidden sm:block text-xs text-gray-500">
        {exportStatus === 'success' && (
          <span className="text-green-600">Image downloaded & copied to clipboard</span>
        )}
        {exportStatus === 'error' && (
          <span className="text-red-600">Failed to export image</span>
        )}
        {exportStatus === 'idle' && !isExporting && (
          <span>High-quality PNG • {theme.name} theme</span>
        )}
      </div>
    </div>
  )
}
