import Link from 'next/link'
import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <PhotoIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Markdown2PNG
              </h1>
              <p className="text-xs text-gray-500">
                Convert Markdown to Beautiful Images
              </p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="https://github.com/yourusername/markdown2png" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
