/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Throttle function to limit function calls to at most once per interval
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastCall >= interval) {
      lastCall = now
      func(...args)
    }
  }
}
