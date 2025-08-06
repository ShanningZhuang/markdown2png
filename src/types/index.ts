export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    code: string;
    border?: string;
    heading?: string;
    link?: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    headingFont?: string;
  };
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'svg';
  quality: number;
  scale: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export interface MarkdownContent {
  raw: string;
  html: string;
  frontmatter?: Record<string, any>;
}

export interface PreviewState {
  content: MarkdownContent;
  theme: Theme;
  isExporting: boolean;
  lastExported?: Date;
}

export type ThemeId = 
  | 'light' 
  | 'dark' 
  | 'warm' 
  | 'elegant' 
  | 'nature' 
  | 'sunset' 
  | 'ocean' 
  | 'mint';

export interface EditorState {
  markdown: string;
  selectedTheme: ThemeId;
  isPreviewVisible: boolean;
  isMobileView: boolean;
}
