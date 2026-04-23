# Photix Mark Web - AI Agent 上下文文件

## 项目概述

**Photix Mark Web** 是一个纯前端的照片水印生成器，专为摄影师设计。它能够批量为照片添加包含相机型号、镜头、拍摄参数等信息的专业水印。

**核心特点：**
- 纯前端处理，无需上传图片，100% 保护隐私
- 支持批量处理多张图片
- 自动读取并展示 EXIF 信息
- 灵活的模板系统，支持横竖屏自适应
- 智能下载（单张直接下载，多张打包为 ZIP）

**在线地址：** https://mark.photix.cc

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Nuxt 3 + Vue 3 + TypeScript |
| UI | Tailwind CSS + shadcn/ui 风格组件 |
| 图像处理 | HTML5 Canvas API |
| EXIF 解析 | exifr |
| 文件打包 | JSZip + file-saver |
| 状态管理 | Vue Composables |

---

## 目录结构

```
photix-mark-web/
├── app/                    # 应用主目录（Nuxt 3 结构）
│   ├── app.vue             # 根组件
│   ├── pages/index.vue     # 主页面（HomePage / EditorPage）
│   ├── components/         # UI 组件
│   │   ├── HomePage.vue    # 未上传时的欢迎页
│   │   ├── EditorPage.vue  # 编辑器主页面
│   │   ├── ImageUploader.vue
│   │   ├── ImagePreview.vue
│   │   ├── TemplateSelector.vue
│   │   ├── TemplateConfig.vue
│   │   ├── ProcessingProgress.vue
│   │   ├── ExifViewer.vue
│   │   └── ui/             # 基础 UI 组件（Button, Card, Badge 等）
│   ├── composables/        # Vue Composables（业务逻辑）
│   │   ├── useExif.ts      # EXIF 读取
│   │   ├── useImageProcessor.ts  # 图像处理管道
│   │   ├── useTemplates.ts      # 模板管理
│   │   ├── useBatchProcessor.ts # 批量处理
│   │   ├── useWatermarkPreview.ts
│   │   ├── useToast.ts
│   │   └── useConfirm.ts
│   ├── lib/
│   │   ├── processors/     # 图像处理器（核心）
│   │   │   ├── index.ts    # 处理器入口 + 注册
│   │   │   ├── registry.ts # 处理器注册表
│   │   │   ├── types.ts    # 处理器类型定义
│   │   │   ├── watermark.ts    # 水印处理器
│   │   │   ├── blur.ts         # 模糊处理器
│   │   │   ├── shadow.ts       # 阴影处理器
│   │   │   ├── margin.ts       # 边距处理器
│   │   │   ├── roundedCorner.ts # 圆角处理器
│   │   │   ├── resize.ts       # 缩放处理器
│   │   │   ├── crop.ts         #裁剪处理器
│   │   │   ├── concat.ts       # 拼接处理器
│   │   │   ├── flexLayout.ts   # 弹性布局处理器
│   │   │   ├── richText.ts     # 富文本处理器
│   │   │   ├── multiRichText.ts # 多富文本处理器
│   │   │   ├── alignment.ts    # 对齐处理器
│   │   │   └── templateRenderer.ts
│   │   └── templates/      # 水印模板配置
│   │   │   ├── index.ts    # 模板导出
│   │   │   ├── types.ts    # 模板类型定义
│   │   │   ├── standard1.ts    # 经典四角水印
│   │   │   ├── standard2.ts    # 标准水印2
│   │   │   ├── centeredWatermark.ts  # 居中样式
│   │   │   ├── centeredWatermark2.ts
│   │   │   ├── sidebarWatermark.ts   # 侧边栏样式
│   │   │   ├── logoCentered.ts
│   │   │   ├── blurBackground.ts     # 模糊背景
│   │   │   ├── nikonBlur.ts          # 尼康专用模糊
│   │   │   ├── folderNameParams.ts
│   │   │   └── noProcess.ts          # 无处理
│   │   └── assets/css/main.css
│   └── utils/
│       ├── canvas.ts       # Canvas 工具函数
│       ├── download.ts     # 下载工具
│       ├── cn.ts           # 类名合并工具
│       └── logoMapper.ts   # Logo 路径映射
├── public/
│   ├── fonts/              # 字体文件（阿里巴巴普惠体、Roboto）
│   ├── logos/              # 相机品牌 Logo（17个品牌）
│   └── demo/               # 演示图片
├── nuxt.config.ts          # Nuxt 配置
├── tailwind.config.js      # Tailwind 配置
├── package.json
└── tsconfig.json
```

---

## 核心架构

### 1. 处理器管道系统

图像处理采用**管道模式**，每张图片经过一系列处理器处理：

```typescript
// 处理器上下文
interface ProcessorContext {
  buffer: HTMLCanvasElement[]  // 图像缓冲区（支持多图层）
  exif: Record<string, any>    // EXIF 数据
  config: Record<string, any>  // 处理器配置
}

// 处理器抽象类
abstract class ImageProcessor {
  name: string
  category: 'generator' | 'filter' | 'merger'
  process(ctx: ProcessorContext): ProcessorContext
}
```

**已注册处理器（12个）：**
- `watermark` - 底部水印条（四角文字 + Logo）
- `blur` - 高斯模糊效果
- `shadow` - 阴影效果
- `margin` - 添加边距
- `rounded_corner` - 圆角裁剪
- `resize` - 缩放图片
- `crop` -裁剪图片
- `concat` - 拼接图片
- `flex_layout` - 弹性布局（最灵活）
- `rich_text` - 富文本渲染
- `multi_rich_text` - 多行富文本
- `alignment` - 对齐处理

### 2. 模板系统

模板定义了一组处理器配置，支持**响应式布局**（横竖屏自适应）：

```typescript
interface TemplateConfig {
  id: string
  name: string
  description: string
  preview?: string
  processors: ProcessorStep[] | ResponsiveProcessors  // 固定配置或响应式
  userOptions: TemplateUserOptions
}

// 响应式配置
interface ResponsiveProcessors {
  landscape: ProcessorStep[]  // 横屏（宽 > 高）
  portrait: ProcessorStep[]   // 竖屏（高 > 宽）
  square?: ProcessorStep[]    // 正方形
}
```

**判断逻辑：**
- `aspectRatio > 1.1` → landscape
- `aspectRatio < 0.9` → portrait
- `0.9 ≤ aspectRatio ≤ 1.1` → square（默认使用 portrait）

### 3. 模板语法

支持类似 Jinja2 的模板语法：

```typescript
// 变量
'{{Make}}'        // SONY
'{{Model}}'       // α7 IV
'{{FocalLength}}' // 35

// 过滤器
'{{Make|logo}}'                   // 返回 logo 路径
'{{DateTimeOriginal|datetime}}'   // 2026-01-23 14:30
'{{ExposureTime|shutter}}'        // 1/125s
'{{LensModel|default("未知")}}'   // 默认值
```

---

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 静态生成（SSG）
npm run generate

# 预览构建结果
npm run preview
```

---

## 开发约定

### 代码风格

- TypeScript 严格模式
- Vue 3 Composition API（setup语法）
- 组件使用 PascalCase 命名
- 文件使用 camelCase 命名
- 使用 `~/` 路径别名引用 `app/` 目录

### 组件开发

- 组件放在 `app/components/`
- 使用 `defineProps` / `defineEmits` 定义接口
- UI 组件放在 `app/components/ui/`（shadcn/ui风格）

### Composables 开发

- Composables 放在 `app/composables/`
- 返回对象而非数组，便于 TypeScript 推断
- 命名以 `use` 开头

### 处理器开发

1. 在 `app/lib/processors/` 创建新处理器文件
2. 继承 `ImageProcessor` 抽象类
3. 在 `index.ts` 的 `initProcessors()` 中注册

### 模板开发

1. 在 `app/lib/templates/` 创建新模板文件
2. 导出 `TemplateConfig` 对象
3. 在 `index.ts` 中导出
4. 在 `useTemplates.ts` 中注册到模板列表

详见 `TEMPLATE_GUIDE.md`

---

## 关键文件速查

| 文件 | 说明 |
|------|------|
| `app/pages/index.vue` | 主页面入口，管理全局状态 |
| `app/components/EditorPage.vue` | 编辑器主界面 |
| `app/lib/processors/index.ts` | 处理器注册入口 |
| `app/lib/processors/types.ts` | 处理器类型定义 |
| `app/lib/templates/types.ts` | 模板类型定义 |
| `app/composables/useImageProcessor.ts` | 图像处理管道逻辑 |
| `app/composables/useExif.ts` | EXIF 读取逻辑 |
| `app/utils/canvas.ts` | Canvas 工具函数 |
| `nuxt.config.ts` | Nuxt 配置（SEO、Analytics） |

---

## 常见任务

### 添加新水印模板

1. 参考 `TEMPLATE_GUIDE.md`
2. 创建模板文件（如 `app/lib/templates/myTemplate.ts`）
3. 在 `index.ts` 导出，在 `useTemplates.ts` 注册

### 添加新处理器

1. 创建处理器文件（继承 `ImageProcessor`）
2. 在 `registry.ts` 注册
3. 在 `index.ts` 的 `initProcessors()` 调用 `registerProcessor`

### 修改水印样式

主要修改 `app/lib/processors/watermark.ts`：
- 水印条高度、背景色
- 文字字体、颜色、位置
- Logo 尺寸、位置

### 添加新相机品牌 Logo

1. 将Logo 放入 `public/logos/`
2. 更新 `app/utils/logoMapper.ts` 添加映射

---

## 注意事项

1. **SSR 已禁用**：页面使用 `definePageMeta({ ssr: false })`，因为 Canvas API 仅在客户端可用

2. **处理器初始化**：必须在 `onMounted` 中调用 `initProcessors()`

3. **字体加载**：使用阿里巴巴普惠体和Roboto，确保字体文件存在于 `public/fonts/`

4. **EXIF 字段**：主要字段包括 Make、Model、LensModel、FocalLength、FNumber、ExposureTime、ISO、DateTimeOriginal

5. **图片格式**：支持 JPG、PNG、HEIC

---

## 相关文档

- `README.md` - 项目介绍
- `GUIDE.md` - 使用指南
- `TEMPLATE_GUIDE.md` - 模板开发详细教程