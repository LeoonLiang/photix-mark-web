# Photix Mark Web

<div align="center">
  <a href="https://mark.photix.cc" target="_blank">
    <img src="./public/og-image.jpg" alt="Photix Mark Web" width="400">
  </a>
  <br>
  <p><strong>批量为您的照片添加专业水印</strong></p>
  <p><strong>Batch process and add professional watermarks to your photos.</strong></p>
  <p>
    <a href="https://mark.photix.cc"><strong>在线体验 (Live Demo)</strong></a>
  </p>
</div>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/dsleoon/photix-mark-web?style=flat-square" alt="License"></a>
  <img src="https://img.shields.io/github/stars/dsleoon/photix-mark-web?style=flat-square" alt="Stars">
  <img src="https://img.shields.io/github/forks/dsleoon/photix-mark-web?style=flat-square" alt="Forks">
</p>

## 功能特性

✅ **纯前端架构** - 无需服务器，保护隐私
✅ **批量处理** - 支持多张图片同时处理
✅ **EXIF 读取** - 自动提取相机、镜头、拍摄参数
✅ **双预览模式** - 网格批量预览 + 单张轮播预览
✅ **实时配置** - 自定义水印内容、Logo、颜色
✅ **智能下载** - 单张直接下载，多张自动打包 ZIP

## 技术栈

- **框架**: Nuxt 3 + TypeScript
- **UI**: Tailwind CSS
- **图像处理**: Canvas API
- **EXIF**: exifr
- **打包下载**: JSZip + file-saver

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm run preview
```

## 使用说明

1. **上传图片** - 拖拽或点击上传区域，支持 JPG/PNG/HEIC
2. **选择模板** - 选择预设的水印模板
3. **配置参数** - 自定义 EXIF 字段显示、Logo 位置、颜色
4. **预览效果** - 使用网格或轮播模式查看预览
5. **开始处理** - 点击按钮批量处理并下载

## License

MIT

