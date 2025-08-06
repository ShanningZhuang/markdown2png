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
    
    // Use fixed width and auto height based on content
    const FIXED_WIDTH = 896 // 56rem in pixels (4xl max-width from CSS)
    
    // Get actual content height by temporarily setting fixed width
    const originalStyle = {
      width: element.style.width,
      height: element.style.height,
      maxWidth: element.style.maxWidth
    }
    
    element.style.width = FIXED_WIDTH + 'px'
    element.style.maxWidth = FIXED_WIDTH + 'px'
    element.style.height = 'auto'
    
    // Force reflow and get actual content height
    element.offsetHeight // trigger reflow
    const contentHeight = element.scrollHeight
    
    // Restore original styles
    element.style.width = originalStyle.width
    element.style.height = originalStyle.height
    element.style.maxWidth = originalStyle.maxWidth
    
    console.log('Export dimensions:', { fixedWidth: FIXED_WIDTH, contentHeight, windowWidth: window.innerWidth, windowHeight: window.innerHeight })
    
    // Configure html2canvas options - simplified for better compatibility
    const html2canvasOptions = {
      backgroundColor: finalOptions.backgroundColor || theme.colors.background,
      scale: finalOptions.scale,
      useCORS: true,
      allowTaint: false,
      logging: true, // Enable logging to debug capture issues
      // Let html2canvas determine dimensions naturally
      // Don't override width/height/windowWidth/windowHeight - these can cause capture issues
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
          // Make sure element is visible and positioned correctly
          previewContent.style.visibility = 'visible'
          previewContent.style.opacity = '1'
          previewContent.style.display = 'block'
          
          // Force the cloned document body to have proper dimensions
          clonedDoc.body.style.margin = '0'
          clonedDoc.body.style.padding = '0'
          clonedDoc.body.style.width = FIXED_WIDTH + 'px'
          clonedDoc.body.style.height = 'auto'
          // Copy computed styles from the original element
          const originalElement = document.getElementById('preview-content')
          if (originalElement) {
            const computedStyles = getComputedStyle(originalElement)
            
            // Log key styles for debugging if needed
            console.log('Export: Applying styles from preview element')
            
            // Apply essential styles for proper rendering
            previewContent.style.backgroundColor = computedStyles.backgroundColor
            previewContent.style.color = computedStyles.color
            previewContent.style.fontFamily = computedStyles.fontFamily
            previewContent.style.fontSize = computedStyles.fontSize
            previewContent.style.lineHeight = computedStyles.lineHeight
            previewContent.style.padding = computedStyles.padding
            previewContent.style.margin = '0' // Remove margins to prevent positioning issues
            previewContent.style.boxSizing = 'border-box'
            
            // Set fixed width and let height be determined by content
            previewContent.style.width = FIXED_WIDTH + 'px'
            previewContent.style.maxWidth = FIXED_WIDTH + 'px'
            previewContent.style.height = 'auto'
            previewContent.style.overflow = 'visible'
            previewContent.style.position = 'static' // Use static positioning for better capture
            
            // Ensure text alignment is preserved
            previewContent.style.textAlign = computedStyles.textAlign
            
            // Fix text rendering and alignment issues
            previewContent.style.textRendering = 'optimizeLegibility'
            ;(previewContent.style as any).fontSmooth = 'antialiased'
            ;(previewContent.style as any).webkitFontSmoothing = 'antialiased'
            ;(previewContent.style as any).mozOsxFontSmoothing = 'grayscale'
            
            // Ensure proper element alignment by copying styles from original
            const originalPreview = document.getElementById('preview-content')
            if (originalPreview) {
              const allOriginalElements = originalPreview.querySelectorAll('*')
              const allClonedElements = previewContent.querySelectorAll('*')
              
              // Copy styles from original elements to cloned elements
              allOriginalElements.forEach((originalEl, index) => {
                const clonedEl = allClonedElements[index] as HTMLElement
                if (clonedEl && originalEl) {
                  const origStyles = getComputedStyle(originalEl)
                  
                  // Copy essential layout properties for alignment
                  clonedEl.style.margin = origStyles.margin
                  clonedEl.style.padding = origStyles.padding
                  clonedEl.style.marginTop = origStyles.marginTop
                  clonedEl.style.marginBottom = origStyles.marginBottom
                  clonedEl.style.marginLeft = origStyles.marginLeft
                  clonedEl.style.marginRight = origStyles.marginRight
                  clonedEl.style.paddingTop = origStyles.paddingTop
                  clonedEl.style.paddingBottom = origStyles.paddingBottom
                  clonedEl.style.paddingLeft = origStyles.paddingLeft
                  clonedEl.style.paddingRight = origStyles.paddingRight
                  
                  // Copy text and font properties
                  clonedEl.style.fontSize = origStyles.fontSize
                  clonedEl.style.lineHeight = origStyles.lineHeight
                  clonedEl.style.fontWeight = origStyles.fontWeight
                  clonedEl.style.fontFamily = origStyles.fontFamily
                  clonedEl.style.textAlign = origStyles.textAlign
                  
                  // Copy display and positioning
                  clonedEl.style.display = origStyles.display
                  clonedEl.style.boxSizing = origStyles.boxSizing
                  
                  // Copy border properties for all elements
                  clonedEl.style.border = origStyles.border
                  clonedEl.style.borderTop = origStyles.borderTop
                  clonedEl.style.borderRight = origStyles.borderRight
                  clonedEl.style.borderBottom = origStyles.borderBottom
                  clonedEl.style.borderLeft = origStyles.borderLeft
                  clonedEl.style.borderColor = origStyles.borderColor
                  clonedEl.style.borderWidth = origStyles.borderWidth
                  clonedEl.style.borderStyle = origStyles.borderStyle
                  clonedEl.style.borderRadius = origStyles.borderRadius
                  
                  // Special handling for specific elements
                  const tagName = clonedEl.tagName
                  if (tagName === 'PRE') {
                    clonedEl.style.whiteSpace = 'pre'
                    clonedEl.style.overflow = 'visible'
                  } else if (tagName === 'UL' || tagName === 'OL') {
                    clonedEl.style.listStylePosition = origStyles.listStylePosition
                  } else if (tagName === 'TABLE') {
                    clonedEl.style.borderCollapse = origStyles.borderCollapse
                    clonedEl.style.width = origStyles.width
                  }
                }
              })
            }
            
            console.log('Export: Element styling and alignment fixes applied')
          }
          
          // Force font loading and ensure fonts are ready before rendering
          if (clonedDoc.fonts) {
            // Wait for fonts to be ready in the cloned document
            clonedDoc.fonts.ready.then(() => {
              console.log('Fonts loaded in cloned document')
            })
            
            // Also check if original document fonts are ready and copy font-face rules
            if (document.fonts) {
              document.fonts.forEach((fontFace) => {
                try {
                  clonedDoc.fonts.add(fontFace)
                } catch (e) {
                  console.warn('Could not add font face:', e)
                }
              })
            }
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

    // Ensure fonts are loaded before generating canvas
    if (document.fonts) {
      await document.fonts.ready
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
