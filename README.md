# Markdown2PNG

A modern web application that converts Markdown content into beautiful, shareable PNG images with multiple professional themes.

## 🚀 Features

- **Real-time Preview**: See your changes instantly as you type
- **8 Professional Themes**: Choose from Light, Dark, Warm, Elegant, Nature, Sunset, Ocean, and Mint themes
- **Code Syntax Highlighting**: Support for 180+ programming languages
- **High-Quality Export**: Generate crisp, high-resolution PNG images
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Free to Use**: No limitations on the number of images you can create

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Markdown Processing**: react-markdown, remark-gfm
- **Code Highlighting**: Prism.js, react-syntax-highlighter
- **Image Export**: html2canvas
- **Deployment**: Vercel/Netlify ready

## 📋 Quick Start

### Prerequisites
- Node.js 18.0 or later
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd markdown2png
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Editor/          # Markdown editor components
│   ├── Themes/          # Theme system components
│   ├── Export/          # Image export functionality
│   └── Layout/          # Layout components
├── styles/
│   ├── themes/          # Theme CSS files
│   └── globals.css      # Global styles
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
└── pages/               # Next.js pages
```

## 🎨 Available Themes

1. **Light** - Clean and professional with excellent readability
2. **Dark** - Easy on the eyes with striking contrast
3. **Warm** - Soft, inviting colors perfect for engaging content
4. **Elegant** - Modern and stylish for a premium look
5. **Nature** - Fresh and organic with natural color tones
6. **Sunset** - Warm and vibrant like a beautiful sunset
7. **Ocean** - Calm and serene with blue color palette
8. **Mint** - Cool and refreshing with mint green accents

## 📝 Usage

1. **Write or paste** your Markdown content in the editor
2. **Choose a theme** from the theme selector
3. **Preview** your content in real-time
4. **Export** as a high-quality PNG image

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [md2image.com](https://www.md2image.com)
- Built with love for the developer community
- Special thanks to all contributors

## 🔗 Links

- [Live Demo](your-demo-url)
- [Documentation](your-docs-url)
- [Report Bug](your-issues-url)
- [Request Feature](your-issues-url)

---

Made with ❤️ by [Your Name]
