# Photix Mark Web

> 纯前端图片水印批量处理工具 - Nuxt 3 版本

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

