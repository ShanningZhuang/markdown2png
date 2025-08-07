# Markdown2PNG

- [English Version](README_EN.md)

一款将 Markdown 内容转换为精美、可分享 PNG 图片的现代化网页应用，提供多种专业主题。

## 🎯 在线演示

**[立即试用！](https://www.markdown2png.com/)** - 无需安装，直接在浏览器中使用。

### 快速演示：
1. 访问在线演示链接
2. 在左侧编辑器中输入 Markdown  
3. 从 8 种精美主题中选择
4. 点击"复制"将 PNG 复制到剪贴板，或点击"导出 PNG"下载
5. 在任何地方分享您的精美图片！

## 🚀 功能特性

- **实时预览**：输入时即时查看更改效果
- **8 种专业主题**：选择浅色、深色、温暖、优雅、自然、夕阳、海洋和薄荷主题
- **代码语法高亮**：支持 180+ 种编程语言
- **高质量导出**：生成清晰的高分辨率 PNG 图片
- **纯前端应用**：无需后端 - 一切都在浏览器中运行
- **复制到剪贴板**：快速复制便于分享
- **响应式设计**：在桌面、平板和移动设备上完美运行
- **免费使用**：对创建图片数量无任何限制

## 🛠️ 技术栈

- **前端**：Next.js 14, React 18, TypeScript
- **样式**：Tailwind CSS
- **Markdown 处理**：react-markdown, remark-gfm
- **代码高亮**：Prism.js, react-syntax-highlighter
- **图片导出**：html2canvas
- **部署**：支持 Vercel/Netlify

## 📋 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/ShanningZhuang/markdown2png.git
cd markdown2png
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **打开浏览器**
访问 `http://localhost:3000`

### 生产环境构建

```bash
npm run build
npm start
```

## 📁 项目结构

```
src/
├── components/
│   ├── Editor/          # Markdown 编辑器组件
│   ├── Themes/          # 主题系统组件
│   ├── Export/          # 图片导出功能
│   └── Layout/          # 布局组件
├── styles/
│   ├── themes/          # 主题 CSS 文件
│   └── globals.css      # 全局样式
├── utils/               # 工具函数
├── types/               # TypeScript 类型定义
└── pages/               # Next.js 页面
```

## 🎨 可用主题

1. **浅色** - 干净专业，可读性佳
2. **深色** - 护眼设计，对比度强
3. **温暖** - 柔和舒适，完美呈现吸引人的内容
4. **优雅** - 现代时尚，呈现高端外观
5. **自然** - 清新有机，自然色调
6. **夕阳** - 温暖鲜艳，如美丽日落
7. **海洋** - 宁静舒缓，蓝色调色板
8. **薄荷** - 清凉清新，薄荷绿点缀

## 📝 使用方法

1. **编写或粘贴** Markdown 内容到编辑器中
2. **选择主题** 从主题选择器中选择
3. **预览** 实时查看内容效果
4. **导出** 为高质量 PNG 图片

## 🤝 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- 灵感来源于 [md2image.com](https://www.md2image.com)
- 用❤️为开发者社区构建
- 特别感谢所有贡献者

## 🔗 相关链接

- [在线演示](https://www.markdown2png.com/)
- [GitHub 仓库](https://github.com/ShanningZhuang/markdown2png)
- [报告问题](https://github.com/ShanningZhuang/markdown2png/issues)
- [功能请求](https://github.com/ShanningZhuang/markdown2png/issues)

---

由 🤖 [Shanning Zhuang](https://shanningzhuang.github.io/) 制作