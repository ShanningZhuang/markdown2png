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
    
    // Configure html2canvas options
    // Note: We don't modify the original element, all styling is handled in onclone
    const html2canvasOptions = {
      backgroundColor: finalOptions.backgroundColor || theme.colors.background,
      scale: finalOptions.scale,
      useCORS: true,
      allowTaint: false,
      foreignObjectRendering: false,
      logging: true, // Enable logging to debug issues
      width: finalOptions.width,
      height: finalOptions.height,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      // Use natural dimensions
      windowWidth: element.offsetWidth,
      windowHeight: element.offsetHeight,
      // Improve rendering
      removeContainer: true,
      imageTimeout: 15000,
      // Handle fonts and styling
      onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
        // Copy all stylesheets to the cloned document and replace CSS variables
        const originalStylesheets = document.querySelectorAll('style, link[rel="stylesheet"]')
        originalStylesheets.forEach((stylesheet) => {
          if (stylesheet.tagName === 'STYLE') {
            // For style tags, replace CSS variables with actual values
            const clonedStyle = clonedDoc.createElement('style')
            let cssText = (stylesheet as HTMLStyleElement).innerHTML
            
            // Replace theme-specific CSS variables with actual values
            const cssVarMapping: Record<string, string> = {
              [`var(--theme-${theme.id}-bg)`]: theme.colors.background,
              [`var(--theme-${theme.id}-text)`]: theme.colors.text,
              [`var(--theme-${theme.id}-accent)`]: theme.colors.accent,
              [`var(--theme-${theme.id}-code)`]: theme.colors.code,
              [`var(--theme-${theme.id}-border)`]: theme.colors.border || theme.colors.text,
              [`var(--theme-${theme.id}-heading)`]: theme.colors.heading || theme.colors.text,
              [`var(--theme-${theme.id}-link)`]: theme.colors.link || theme.colors.accent,
            }
            
            Object.entries(cssVarMapping).forEach(([varName, value]) => {
              cssText = cssText.replace(new RegExp(varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value)
            })
            
            clonedStyle.innerHTML = cssText
            clonedDoc.head.appendChild(clonedStyle)
          } else {
            // For link tags, clone as-is
            const clonedStylesheet = stylesheet.cloneNode(true)
            clonedDoc.head.appendChild(clonedStylesheet)
          }
        })
        
        // Ensure the cloned element has proper styling
        const previewContent = clonedDoc.getElementById('preview-content')
        if (previewContent) {
          // Copy computed styles from the original element
          const originalElement = document.getElementById('preview-content')
          if (originalElement) {
            const computedStyles = getComputedStyle(originalElement)
            
            // Apply key computed styles to ensure exact match
            previewContent.style.backgroundColor = computedStyles.backgroundColor
            previewContent.style.color = computedStyles.color
            previewContent.style.fontFamily = computedStyles.fontFamily
            previewContent.style.fontSize = computedStyles.fontSize
            previewContent.style.lineHeight = computedStyles.lineHeight
            previewContent.style.padding = computedStyles.padding
            previewContent.style.margin = computedStyles.margin
            previewContent.style.maxWidth = computedStyles.maxWidth
            previewContent.style.width = computedStyles.width
            previewContent.style.height = 'auto'
            previewContent.style.display = computedStyles.display
            previewContent.style.boxSizing = computedStyles.boxSizing
          }
          
          // Force font loading
          if (clonedDoc.fonts) {
            clonedDoc.fonts.ready.then(() => {
              console.log('Fonts loaded in cloned document')
            })
          }
        }
        
        // Wait for any images to load
        const images = clonedDoc.querySelectorAll('img')
        images.forEach((img) => {
          if (img.complete) return
          img.onload = () => console.log('Image loaded:', img.src)
        })
      }
    }

    // Generate canvas (original element is not modified)
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
