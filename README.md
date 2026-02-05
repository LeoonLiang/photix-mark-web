# Photix Mark Web

<div align="center">
  <a href="https://mark.photix.cc" target="_blank">
    <img src="./public/og-image.jpg" alt="Photix Mark Web" width="400">
  </a>
  <br>
  <p><strong>批量为您的照片添加专业水印</strong></p>
  <p>
    <a href="https://mark.photix.cc"><strong>在线使用</strong></a>
  </p>
</div>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/LeoonLiang/photix-mark-web?style=flat-square" alt="License"></a>
  <a href="https://github.com/LeoonLiang/photix-mark-web/stargazers"><img src="https://img.shields.io/github/stars/LeoonLiang/photix-mark-web?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/LeoonLiang/photix-mark-web/network/members"><img src="https://img.shields.io/github/forks/LeoonLiang/photix-mark-web?style=flat-square" alt="Forks"></a>
  <img src="https://img.shields.io/badge/开源-MIT-blue?style=flat-square" alt="Open Source">
</p>

---

[English](README.en.md) | [中文](#中文)

---
## 中文

### ✨ 功能特性

- **纯前端处理**: 所有操作都在您的浏览器中完成，无需上传数据，100% 保护您的隐私安全。
- **批量处理**: 一次性为多张图片添加水印，极大节省您的时间。
- **EXIF 读取**: 自动读取并展示照片的 EXIF 信息，如相机型号、镜头、快门速度等。
- **实时预览**: 支持网格和轮播两种预览模式，方便在处理前检查效果。
- **高度自定义**: 强大的模板系统，让您可以自由定制水印内容、Logo、颜色和布局。
- **智能下载**: 单张图片直接下载，多张图片自动打包成 ZIP 压缩文件，方便快捷。

### 🚀 技术栈

- **框架**: Nuxt 3 + Vue 3 + TypeScript
- **UI**: Tailwind CSS
- **图像处理**: HTML5 Canvas API
- **EXIF 解析**: `exifr`
- **打包与下载**: `JSZip` + `file-saver`

### 🛠️ 本地开发

#### 1. 克隆项目
```bash
git clone https://github.com/LeoonLiang/photix-mark-web.git
cd photix-mark-web
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 启动开发服务器
```bash
npm run dev
```
应用将在 `http://localhost:3000` 上运行。

### 📖 使用说明

1.  **上传图片**: 拖拽或点击上传区域，支持 JPG, PNG, HEIC 格式。
2.  **选择模板**: 从预设的模板中选择一个您喜欢的样式。
3.  **配置参数**: 调整 EXIF 字段、Logo、颜色、位置等参数。
4.  **预览效果**: 使用网格或轮播视图检查最终效果。
5.  **开始处理**: 点击“开始处理”按钮，生成并下载带水印的照片。

### ⭐ 支持项目

如果这个项目对您有帮助，请给我们一个 Star ⭐️！这将是对我们最大的鼓励。

<a href="https://github.com/LeoonLiang/photix-mark-web/stargazers" target="_blank">
  <img src="https://img.shields.io/github/stars/LeoonLiang/photix-mark-web?style=social" alt="GitHub Stars">
</a>

### 🤝 如何贡献

我们欢迎任何形式的贡献！无论是修复 Bug、增加新功能还是改进文档，都非常感谢。

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

请随时提交 Issue 或 Pull Request。让我们一起完善它！

### 💬 问题反馈

遇到问题或有建议？欢迎通过以下方式反馈：

- 🐛 **Bug 报告**：[提交 Issue](https://github.com/LeoonLiang/photix-mark-web/issues/new)
- 💡 **功能建议**：[功能请求](https://github.com/LeoonLiang/photix-mark-web/issues/new)
- 📖 **查看已知问题**：[Issues 列表](https://github.com/LeoonLiang/photix-mark-web/issues)

### 📧 联系方式

- **作者**: Leoonliang
- **邮箱**: dsleoon@gmail.com
- **网站**: [mark.photix.cc](https://mark.photix.cc)

### 📄 开源协议

本项目基于 **MIT License** 开源。详情请见 [LICENSE](./LICENSE) 文件。