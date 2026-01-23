# 项目使用指南

## 项目位置
```
/Users/leoon/Documents/what/photix-mark-web/
```

## 快速启动

### 1. 启动开发服务器
```bash
cd /Users/leoon/Documents/what/photix-mark-web
npm run dev
```

### 2. 访问应用
打开浏览器访问：**http://localhost:3000**

### 3. 使用流程
1. **上传图片** - 拖拽或点击上传区域
2. **选择模板** - 选择"标准水印"模板
3. **配置参数** - 调整 EXIF 字段、Logo、颜色
4. **预览效果** - 使用网格或轮播模式查看
5. **开始处理** - 点击按钮，自动下载结果

## 关于启动警告

启动时可能会看到以下警告：
```
WARN Create a Vue component in the pages/ directory to enable <NuxtPage>
```

**这是正常的！** 这只是 Nuxt 4 的启动信息，不影响应用运行。页面文件已经存在于 `pages/index.vue`，应用可以正常访问。

## 已实现功能

### 核心功能
- ✅ 图片上传（拖拽/点击）
- ✅ EXIF 自动读取
- ✅ 水印模板系统
- ✅ 实时配置面板
- ✅ 批量处理
- ✅ 智能下载（单张/ZIP）

### 处理器
- ✅ WatermarkProcessor - 四角水印 + Logo
- ✅ BlurProcessor - 高斯模糊
- ✅ ShadowProcessor - 阴影效果
- ✅ RoundedCornerProcessor - 圆角裁剪

### 资源文件
- ✅ 字体：阿里巴巴普惠体、Roboto
- ✅ Logo：17 个相机品牌（Canon, Nikon, Sony, etc.）

## 项目结构

```
photix-mark-web/
├── components/          # UI 组件
│   ├── ImageUploader.vue
│   ├── ImagePreview.vue
│   ├── TemplateSelector.vue
│   ├── TemplateConfig.vue
│   └── ProcessingProgress.vue
├── composables/         # 业务逻辑
│   ├── useExif.ts
│   ├── useImageProcessor.ts
│   ├── useTemplates.ts
│   └── useBatchProcessor.ts
├── lib/
│   ├── processors/     # 图像处理器
│   └── templates/      # 水印模板
├── pages/
│   └── index.vue       # 主页面
├── public/
│   ├── fonts/         # 字体文件
│   └── logos/         # Logo 文件
└── utils/
    ├── canvas.ts      # Canvas 工具
    └── download.ts    # 下载工具
```

## 后续开发

### 待添加功能
- [ ] 更多水印模板（standard2, blur, nikonBlur 等）
- [ ] 实时水印预览（当前只有原图预览）
- [ ] 更多处理器（resize, crop, concat）
- [ ] 移动端适配
- [ ] 键盘快捷键支持

### 优化方向
- [ ] 使用 Web Workers 提升性能
- [ ] 添加图片缓存机制
- [ ] 支持自定义字体上传
- [ ] 保存配置到 localStorage

## 故障排除

### 如果页面无法访问
1. 确认开发服务器正在运行
2. 检查端口 3000 是否被占用
3. 尝试清除缓存：`rm -rf .nuxt && npm run dev`

### 如果处理失败
1. 检查浏览器控制台错误
2. 确认图片格式支持（JPG/PNG/HEIC）
3. 检查字体和 Logo 文件是否存在

## 技术栈

- **框架**: Nuxt 4.3.0 + Vue 3.5.27
- **构建**: Vite 7.3.1
- **CSS**: Tailwind CSS 3.x
- **图像**: Canvas API
- **EXIF**: exifr 7.x
- **下载**: JSZip 3.x + file-saver 2.x

## License

MIT
