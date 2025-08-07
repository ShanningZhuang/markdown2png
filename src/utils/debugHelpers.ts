// Visual debugging helpers for layout inspection

export function addMarginPaddingVisualization(element: HTMLElement) {
  console.log('🎯 Adding visual margin/padding debugging...')
  
  // Add debug styles to document head if not already present
  if (!document.getElementById('debug-styles')) {
    const debugStyles = document.createElement('style')
    debugStyles.id = 'debug-styles'
    debugStyles.innerHTML = `
      .debug-margins * {
        outline: 1px dotted red !important;
        outline-offset: -1px !important;
      }
      
      .debug-margins li,
      .debug-margins p,
      .debug-margins h1,
      .debug-margins h2,
      .debug-margins h3 {
        position: relative !important;
      }
      
      .debug-margins li:after,
      .debug-margins p:after,
      .debug-margins h1:after,
      .debug-margins h2:after,
      .debug-margins h3:after {
        content: 'M: ' attr(data-debug-margin) !important;
        position: absolute !important;
        bottom: -12px !important;
        right: 0 !important;
        font-size: 9px !important;
        background: transparent !important;
        color: red !important;
        padding: 1px 2px !important;
        border-radius: 2px !important;
        z-index: 10000 !important;
        pointer-events: none !important;
      }
      
      .debug-padding * {
        box-shadow: inset 0 0 0 1px rgba(0, 255, 0, 0.6) !important;
      }
      
      .debug-text-baseline {
        position: relative;
      }
      
      .debug-text-baseline:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        background: blue;
        z-index: 10001;
      }
    `
    document.head.appendChild(debugStyles)
  }
  
  // Toggle debug classes
  element.classList.toggle('debug-margins')
  element.classList.toggle('debug-padding')
  
  // Add text baseline indicators and margin data to text elements
  const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')
  textElements.forEach(el => {
    el.classList.toggle('debug-text-baseline')
    
    // Add margin data for visualization
    if (el.classList.contains('debug-text-baseline')) {
      const styles = getComputedStyle(el as HTMLElement)
      ;(el as HTMLElement).setAttribute('data-debug-margin', styles.margin)
    } else {
      ;(el as HTMLElement).removeAttribute('data-debug-margin')
    }
  })
}

export function removeMarginPaddingVisualization(element: HTMLElement) {
  console.log('🎯 Removing visual debugging...')
  
  element.classList.remove('debug-margins', 'debug-padding')
  
  const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')
  textElements.forEach(el => {
    el.classList.remove('debug-text-baseline')
  })
  
  // Remove debug styles
  const debugStyles = document.getElementById('debug-styles')
  if (debugStyles) {
    debugStyles.remove()
  }
}

export function captureElementScreenshot(element: HTMLElement, label: string) {
  // This creates a visual representation by temporarily highlighting the element
  const originalOutline = element.style.outline
  const originalBackground = element.style.backgroundColor
  
  element.style.outline = '3px solid red'
  element.style.backgroundColor = 'rgba(255, 255, 0, 0.2)'
  
  console.log(`📸 Element highlighted for screenshot: ${label}`)
  console.log('Take screenshot now, then run removeHighlight() in console')
  
  // Store cleanup function on window for easy console access
  ;(window as Window & { removeHighlight?: () => void }).removeHighlight = () => {
    element.style.outline = originalOutline
    element.style.backgroundColor = originalBackground
    console.log('✅ Highlight removed')
    delete (window as Window & { removeHighlight?: () => void }).removeHighlight
  }
}

export function compareTextMetrics(original: HTMLElement, cloned: HTMLElement) {
  console.group('=== TEXT METRICS COMPARISON ===')
  
  // Find first text element in each
  const originalText = original.querySelector('p, h1, h2, h3') as HTMLElement
  const clonedText = cloned.querySelector('p, h1, h2, h3') as HTMLElement
  
  if (originalText && clonedText) {
    const origStyles = getComputedStyle(originalText)
    const clonedStyles = getComputedStyle(clonedText)
    
    console.table({
      Property: ['font-size', 'line-height', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom'],
      Original: [
        origStyles.fontSize,
        origStyles.lineHeight,
        origStyles.marginTop,
        origStyles.marginBottom,
        origStyles.paddingTop,
        origStyles.paddingBottom
      ],
      Cloned: [
        clonedStyles.fontSize,
        clonedStyles.lineHeight,
        clonedStyles.marginTop,
        clonedStyles.marginBottom,
        clonedStyles.paddingTop,
        clonedStyles.paddingBottom
      ],
      Match: [
        origStyles.fontSize === clonedStyles.fontSize ? '✅' : '❌',
        origStyles.lineHeight === clonedStyles.lineHeight ? '✅' : '❌',
        origStyles.marginTop === clonedStyles.marginTop ? '✅' : '❌',
        origStyles.marginBottom === clonedStyles.marginBottom ? '✅' : '❌',
        origStyles.paddingTop === clonedStyles.paddingTop ? '✅' : '❌',
        origStyles.paddingBottom === clonedStyles.paddingBottom ? '✅' : '❌'
      ]
    })
    
    // Calculate text baseline differences
    const originalRect = originalText.getBoundingClientRect()
    const clonedRect = clonedText.getBoundingClientRect()
    
    console.log('📏 Text positioning:')
    console.log('Original Y position:', originalRect.top)
    console.log('Cloned Y position:', clonedRect.top)
    console.log('Vertical offset:', clonedRect.top - originalRect.top)
    console.log('Offset in text height units:', (clonedRect.top - originalRect.top) / parseFloat(origStyles.fontSize))
  }
  
  console.groupEnd()
}