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
  scale: 4, // High DPI for crisp images
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
  const finalOptions = { ...defaultExportOptions, ...options }
  
  // Detect if debug mode is active
  const hasDebugMargins = element.classList.contains('debug-margins')
  const hasDebugPadding = element.classList.contains('debug-padding')
  const isDebugMode = hasDebugMargins || hasDebugPadding
  
  try {
    console.log('🔍 Export starting...', isDebugMode ? 'Debug mode' : 'Normal mode')
    
    // Ensure fonts are loaded before generating canvas
    if (document.fonts) {
      await document.fonts.ready
    }
    
    // Html2canvas options with text positioning fix
    const html2canvasOptions = {
      backgroundColor: finalOptions.backgroundColor || theme.colors.background,
      scale: finalOptions.scale, // Use scale 1 to prevent text positioning issues
      useCORS: true,
      allowTaint: false,
      logging: false,
      onclone: (clonedDoc: Document) => {
        console.log('🔧 Applying html2canvas text positioning fixes...')
        
        // Find the cloned preview content
        const clonedPreview = clonedDoc.getElementById('preview-content')
        if (!clonedPreview) return
        
        // Preserve debug styles if in debug mode
        if (isDebugMode) {
          const debugStyles = document.getElementById('debug-styles')
          if (debugStyles && !clonedDoc.getElementById('debug-styles')) {
            const clonedDebugStyles = debugStyles.cloneNode(true)
            clonedDoc.head.appendChild(clonedDebugStyles)
          }
        } else {
          // Clean debug classes in normal mode
          clonedPreview.classList.remove('debug-margins', 'debug-padding')
          clonedPreview.querySelectorAll('.debug-text-baseline').forEach(el => {
            el.classList.remove('debug-text-baseline')
            el.removeAttribute('data-debug-margin')
          })
        }
        
        // Apply critical html2canvas text positioning fix
        const textPositionFix = clonedDoc.createElement('style')
        textPositionFix.innerHTML = `
          /* Critical fix for html2canvas text baseline issues */
          .markdown-content h1,
          .markdown-content h2, 
          .markdown-content h3,
          .markdown-content h4,
          .markdown-content h5,
          .markdown-content h6,
          .markdown-content p {
            /* Move text up by half of its font height to fix html2canvas positioning */
            // transform: translateY(2em) !important;
            /* Force consistent baseline */
            vertical-align: baseline !important;
            /* Ensure proper box model */
            box-sizing: border-box !important;
          }
          
          .markdown-content li {
            /* Move text up by half of its font height to fix html2canvas positioning */
            // transform: translateY(-2em) !important;
            display: list-item !important;
            vertical-align: baseline !important;
          }
          
          /* Force consistent text rendering */
          .markdown-content * {
            text-rendering: geometricPrecision !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
          }
        `
        clonedDoc.head.appendChild(textPositionFix)
        console.log('✅ Text positioning fixes applied')
      }
    }
    
    // Generate canvas
    console.log('📷 Capturing with html2canvas...')
    const canvas = await html2canvas(element, html2canvasOptions)
    
    // Manual high-DPI scaling if needed
    let finalCanvas = canvas
    if (finalOptions.scale > 1) {
      finalCanvas = document.createElement('canvas')
      finalCanvas.width = canvas.width * finalOptions.scale
      finalCanvas.height = canvas.height * finalOptions.scale
      
      const ctx = finalCanvas.getContext('2d')!
      ctx.imageSmoothingEnabled = true
      ctx.scale(finalOptions.scale, finalOptions.scale)
      ctx.drawImage(canvas, 0, 0)
    }
    
    // Convert to data URL
    const dataUrl = finalOptions.format === 'jpg'
      ? finalCanvas.toDataURL('image/jpeg', finalOptions.quality)
      : finalCanvas.toDataURL('image/png')
    
    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const debugSuffix = isDebugMode ? '-debug' : ''
    const fileName = `markdown-${theme.id}${debugSuffix}-${timestamp}.${finalOptions.format}`
    
    console.log('✅ Export completed successfully')
    return {
      success: true,
      dataUrl,
      fileName,
    }
  } catch (error) {
    console.error('❌ Export failed:', error)
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