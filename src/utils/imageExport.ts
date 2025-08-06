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
    
    // Prepare the element for export
    const originalStyles = prepareElementForExport(element, theme)
    
    // Configure html2canvas options
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
      // Force proper dimensions
      windowWidth: Math.max(element.scrollWidth, element.offsetWidth),
      windowHeight: Math.max(element.scrollHeight, element.offsetHeight),
      // Improve rendering
      removeContainer: true,
      imageTimeout: 15000,
      // Handle fonts and styling
      onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
        // Ensure the cloned element has proper styling
        const previewContent = clonedDoc.getElementById('preview-content')
        if (previewContent) {
          // Apply theme styles directly to cloned element
          previewContent.style.backgroundColor = theme.colors.background
          previewContent.style.color = theme.colors.text
          previewContent.style.fontFamily = theme.typography.fontFamily
          previewContent.style.fontSize = theme.typography.fontSize
          previewContent.style.lineHeight = theme.typography.lineHeight
          previewContent.style.padding = '2rem'
          previewContent.style.minWidth = '600px'
          previewContent.style.maxWidth = '1000px'
          
          // Apply list styles
          const lists = previewContent.querySelectorAll('ul, ol')
          lists.forEach((list) => {
            const listEl = list as HTMLElement
            listEl.style.marginBottom = '1rem'
            listEl.style.paddingLeft = '1.5rem'
            listEl.style.listStylePosition = 'outside'
            if (list.tagName === 'UL') {
              listEl.style.listStyleType = 'disc'
            } else {
              listEl.style.listStyleType = 'decimal'
            }
          })
          
          // Apply list item styles
          const listItems = previewContent.querySelectorAll('li')
          listItems.forEach((li) => {
            const liEl = li as HTMLElement
            liEl.style.marginBottom = '0.25rem'
            liEl.style.display = 'list-item'
          })
          
          // Apply horizontal rule styles
          const hrs = previewContent.querySelectorAll('hr')
          hrs.forEach((hr) => {
            const hrEl = hr as HTMLElement
            hrEl.style.margin = '2rem 0'
            hrEl.style.border = 'none'
            hrEl.style.borderTop = `1px solid ${theme.colors.border || theme.colors.text}`
            hrEl.style.opacity = '0.3'
          })
          
          // Apply code block styles
          const preBlocks = previewContent.querySelectorAll('pre')
          preBlocks.forEach((pre) => {
            const preEl = pre as HTMLElement
            preEl.style.margin = '0rem 0'
            preEl.style.padding = '0rem'
            preEl.style.borderRadius = '0rem'
            preEl.style.backgroundColor = theme.colors.code
            preEl.style.overflowX = 'auto'
            preEl.style.fontFamily = '"Fira Code", "Monaco", "Cascadia Code", "Segoe UI Mono", "Roboto Mono", monospace'
            preEl.style.lineHeight = '1.5'
          })
          
          // Apply inline code styles
          const inlineCodes = previewContent.querySelectorAll('code:not(pre code)')
          inlineCodes.forEach((code) => {
            const codeEl = code as HTMLElement
            codeEl.style.padding = '0.125rem 0.25rem'
            codeEl.style.borderRadius = '0.25rem'
            codeEl.style.backgroundColor = theme.colors.code
            codeEl.style.color = theme.colors.text
            codeEl.style.fontFamily = '"Fira Code", "Monaco", "Cascadia Code", "Segoe UI Mono", "Roboto Mono", monospace'
            codeEl.style.fontSize = '0.875em'
          })
          
          // Apply paragraph styles
          const paragraphs = previewContent.querySelectorAll('p')
          paragraphs.forEach((p) => {
            const pEl = p as HTMLElement
            pEl.style.marginBottom = '0rem'
          })
          
          // Apply heading styles
          const headings = previewContent.querySelectorAll('h1, h2, h3, h4, h5, h6')
          headings.forEach((heading) => {
            const hEl = heading as HTMLElement
            hEl.style.color = theme.colors.heading || theme.colors.text
            hEl.style.fontWeight = '600'
            hEl.style.marginTop = '2rem'
            hEl.style.marginBottom = '1rem'
            hEl.style.lineHeight = '1.25'
            
            if (heading.tagName === 'H1') {
              hEl.style.fontSize = '2.25rem'
              hEl.style.borderBottom = `2px solid ${theme.colors.border || theme.colors.text}`
              hEl.style.paddingBottom = '0.5rem'
            } else if (heading.tagName === 'H2') {
              hEl.style.fontSize = '1.875rem'
              hEl.style.borderBottom = `1px solid ${theme.colors.border || theme.colors.text}`
              hEl.style.paddingBottom = '0.25rem'
            } else if (heading.tagName === 'H3') {
              hEl.style.fontSize = '1.5rem'
            } else if (heading.tagName === 'H4') {
              hEl.style.fontSize = '1.25rem'
            }
          })
          
          // Apply blockquote styles
          const blockquotes = previewContent.querySelectorAll('blockquote')
          blockquotes.forEach((bq) => {
            const bqEl = bq as HTMLElement
            bqEl.style.margin = '1.5rem 0'
            bqEl.style.padding = '1rem 1.5rem'
            bqEl.style.borderLeft = `4px solid ${theme.colors.accent}`
            bqEl.style.backgroundColor = theme.colors.code
            bqEl.style.fontStyle = 'italic'
            bqEl.style.opacity = '0.9'
          })
          
          // Apply link styles
          const links = previewContent.querySelectorAll('a')
          links.forEach((link) => {
            const linkEl = link as HTMLElement
            linkEl.style.color = theme.colors.link || theme.colors.accent
            linkEl.style.textDecoration = 'underline'
          })
          
          // Apply table styles
          const tables = previewContent.querySelectorAll('table')
          tables.forEach((table) => {
            const tableEl = table as HTMLElement
            tableEl.style.width = '100%'
            tableEl.style.borderCollapse = 'collapse'
            tableEl.style.margin = '1.5rem 0'
            tableEl.style.border = `1px solid ${theme.colors.border || theme.colors.text}`
          })
          
          const tableCells = previewContent.querySelectorAll('th, td')
          tableCells.forEach((cell) => {
            const cellEl = cell as HTMLElement
            cellEl.style.padding = '0.75rem'
            cellEl.style.textAlign = 'left'
            cellEl.style.border = `1px solid ${theme.colors.border || theme.colors.text}`
            
            if (cell.tagName === 'TH') {
              cellEl.style.backgroundColor = theme.colors.code
              cellEl.style.fontWeight = '600'
              cellEl.style.color = theme.colors.heading || theme.colors.text
            }
          })
          
          // Ensure all styles are computed
          const computedStyle = getComputedStyle(element)
          previewContent.style.width = computedStyle.width
          previewContent.style.height = 'auto'
          
          // Force font loading
          clonedDoc.fonts?.ready?.then(() => {
            console.log('Fonts loaded in cloned document')
          })
        }
        
        // Wait for any images to load
        const images = clonedDoc.querySelectorAll('img')
        images.forEach((img) => {
          if (img.complete) return
          img.onload = () => console.log('Image loaded:', img.src)
        })
      }
    }

    // Generate canvas
    const canvas = await html2canvas(element, html2canvasOptions)
    
    // Restore original styles
    restoreElementStyles(element, originalStyles)
    
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

/**
 * Prepare element for export by optimizing styles
 */
function prepareElementForExport(element: HTMLElement, theme: Theme): Record<string, string> {
  const originalStyles: Record<string, string> = {}
  
  // Store original styles
  originalStyles.width = element.style.width
  originalStyles.height = element.style.height
  originalStyles.transform = element.style.transform
  originalStyles.position = element.style.position
  
  // Set optimal styles for export
  element.style.width = 'auto'
  element.style.height = 'auto'
  element.style.transform = 'none'
  element.style.position = 'static'
  
  // Ensure fonts are loaded
  if (document.fonts) {
    document.fonts.ready.then(() => {
      // Font loading complete
    })
  }
  
  return originalStyles
}

/**
 * Restore original element styles
 */
function restoreElementStyles(element: HTMLElement, originalStyles: Record<string, string>): void {
  Object.entries(originalStyles).forEach(([property, value]) => {
    if (value) {
      element.style.setProperty(property, value)
    } else {
      element.style.removeProperty(property)
    }
  })
}

/**
 * Get optimal export dimensions based on content
 */
export function getOptimalDimensions(element: HTMLElement): { width: number; height: number } {
  const rect = element.getBoundingClientRect()
  const computedStyle = getComputedStyle(element)
  
  const padding = {
    top: parseInt(computedStyle.paddingTop, 10) || 0,
    right: parseInt(computedStyle.paddingRight, 10) || 0,
    bottom: parseInt(computedStyle.paddingBottom, 10) || 0,
    left: parseInt(computedStyle.paddingLeft, 10) || 0,
  }
  
  return {
    width: Math.ceil(rect.width + padding.left + padding.right),
    height: Math.ceil(rect.height + padding.top + padding.bottom),
  }
}

/**
 * Validate export options
 */
export function validateExportOptions(options: Partial<ExportOptions>): ExportOptions {
  return {
    format: options.format && ['png', 'jpg', 'svg'].includes(options.format) ? options.format : 'png',
    quality: Math.max(0.1, Math.min(1.0, options.quality || 1.0)),
    scale: Math.max(1, Math.min(4, options.scale || 2)),
    width: options.width && options.width > 0 ? options.width : undefined,
    height: options.height && options.height > 0 ? options.height : undefined,
    backgroundColor: options.backgroundColor,
  }
}
