import html2canvas from 'html2canvas'
import type { Theme, ExportOptions } from '@/types'

export interface ExportResult {
  success: boolean
  dataUrl?: string
  error?: string
  fileName?: string
}

export const defaultExportOptions: ExportOptions = {
  format: 'png',
  quality: 1.0,
  scale: 2, // High DPI for crisp images
  backgroundColor: undefined, // Will use theme background
}

/**
 * Export DOM element to image using html2canvas (frontend-only)
 */
export async function exportToImage(
  element: HTMLElement,
  theme: Theme,
  options: Partial<ExportOptions> = {}
): Promise<ExportResult> {
  try {
    const finalOptions = { ...defaultExportOptions, ...options }
    
    console.log('Export: Starting direct HTML copy approach')
    
    // Ensure fonts are loaded before generating canvas
    if (document.fonts) {
      await document.fonts.ready
    }
    
    // Simple html2canvas options - let it handle everything naturally
    const html2canvasOptions = {
      backgroundColor: finalOptions.backgroundColor || theme.colors.background,
      scale: finalOptions.scale,
      useCORS: true,
      allowTaint: false,
      logging: false
    }
    
    // Generate canvas directly from the preview element
    const canvas = await html2canvas(element, html2canvasOptions)
    
    // Convert to data URL
    let dataUrl: string
    if (finalOptions.format === 'jpg') {
      dataUrl = canvas.toDataURL('image/jpeg', finalOptions.quality)
    } else {
      dataUrl = canvas.toDataURL('image/png')
    }
    
    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const fileName = `markdown-${theme.id}-${timestamp}.${finalOptions.format}`
    
    return {
      success: true,
      dataUrl,
      fileName,
    }
  } catch (error) {
    console.error('Export failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown export error',
    }
  }
}

/**
 * Download image data URL
 */
export function downloadImage(dataUrl: string, fileName: string): void {
  const link = document.createElement('a')
  link.download = fileName
  link.href = dataUrl
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Copy image to clipboard (if supported)
 */
export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    // Check if clipboard API is available
    if (!navigator.clipboard?.write) {
      console.warn('Clipboard API not available')
      return false
    }

    // Convert data URL to blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    
    // Ensure we have a valid blob
    if (!blob || blob.size === 0) {
      console.error('Invalid blob for clipboard')
      return false
    }
    
    // Copy to clipboard
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])
    
    console.log('Image copied to clipboard successfully')
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    
    // Fallback: try to copy the data URL as text (not ideal but something)
    try {
      await navigator.clipboard.writeText(dataUrl)
      console.log('Data URL copied to clipboard as fallback')
      return true
    } catch (fallbackError) {
      console.error('Clipboard fallback also failed:', fallbackError)
      return false
    }
  }
}

// Removed prepareElementForExport and restoreElementStyles functions
// All styling is now handled in the onclone callback to avoid modifying the original element
