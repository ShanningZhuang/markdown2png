import { useState } from 'react'
import { ArrowDownTrayIcon, PhotoIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import { exportToImage, downloadImage, copyImageToClipboard } from '@/utils/imageExport'
import { addMarginPaddingVisualization, removeMarginPaddingVisualization, captureElementScreenshot } from '@/utils/debugHelpers'
import type { Theme } from '@/types'

interface ExportButtonProps {
  markdown: string
  theme: Theme
}

export function ExportButton({ markdown, theme }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleExport = async (downloadFile: boolean = true) => {
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
        // Download file if requested
        if (downloadFile) {
          downloadImage(result.dataUrl, result.fileName)
        }
        
        // Always try to copy to clipboard
        const clipboardSuccess = await copyImageToClipboard(result.dataUrl)
        
        if (!downloadFile && !clipboardSuccess) {
          throw new Error('Failed to copy to clipboard')
        }
        
        setExportStatus('success')
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

  // Debug helpers
  const handleDebugVisualization = () => {
    const previewElement = document.getElementById('preview-content')
    if (previewElement) {
      addMarginPaddingVisualization(previewElement)
      console.log('🎯 Added visual debugging. Check the preview pane for colored overlays.')
      console.log('🎯 Run removeMarginPaddingVisualization() in console to remove.')
      // Store cleanup function on window for easy console access
      ;(window as Window & { removeDebug?: () => void }).removeDebug = () => {
        removeMarginPaddingVisualization(previewElement)
        console.log('✅ Visual debugging removed')
        delete (window as Window & { removeDebug?: () => void }).removeDebug
      }
    }
  }

  const handleCaptureScreenshot = () => {
    const previewElement = document.getElementById('preview-content')
    if (previewElement) {
      captureElementScreenshot(previewElement, 'Preview Element')
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Copy Only Button */}
      <button
        onClick={() => handleExport(false)}
        disabled={isExporting || !markdown.trim()}
        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        title="Copy to clipboard only"
      >
        <ClipboardIcon className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Copy</span>
      </button>

      {/* Download Button */}
      <button
        onClick={() => handleExport(true)}
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
      <div className="hidden lg:block text-xs text-gray-500">
        {exportStatus === 'success' && (
          <span className="text-green-600">Image ready!</span>
        )}
        {exportStatus === 'error' && (
          <span className="text-red-600">Export failed</span>
        )}
        {exportStatus === 'idle' && !isExporting && (
          <span>High-quality PNG • {theme.name} theme</span>
        )}
      </div>
      
      {/* Debug buttons - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="ml-4 pl-4 border-l border-gray-300">
          <div className="text-xs text-gray-500 mb-1">Debug Tools</div>
          <div className="flex gap-1">
            <button
              onClick={handleDebugVisualization}
              className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded"
              title="Show margin/padding visualization"
            >
              🎯 Debug
            </button>
            <button
              onClick={handleCaptureScreenshot}
              className="px-2 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded"
              title="Highlight element for screenshot"
            >
              📸 Highlight
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
