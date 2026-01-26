# 水印模板开发指南

本文档将教你如何快速创建自定义水印模板。

## 快速开始

### 1. 创建模板文件

在 `app/lib/templates/` 目录下创建新的模板文件，例如 `myTemplate.ts`：

```typescript
import type { TemplateConfig } from './types'

export const myTemplate: TemplateConfig = {
  id: 'my-template',           // 唯一ID
  name: '我的模板',            // 显示名称
  description: '模板描述',      // 简短描述
  preview: '/templates/my.jpg', // 预览图（可选）

  processors: [
    // 处理器配置（见下文）
  ],

  userOptions: {
    // 用户可调整的选项
    exifFields: {
      showBrand: true,
      showModel: true,
      // ...
    }
  }
}
```

### 2. 注册模板

在 `app/lib/templates/index.ts` 中导出：

```typescript
export { myTemplate } from './myTemplate'
```

在 `app/composables/useTemplates.ts` 中注册：

```typescript
import { myTemplate } from '~/lib/templates'

const templates = ref<TemplateConfig[]>([
  // ...其他模板
  myTemplate  // 添加到这里
])
```

---

## FlexLayout 处理器详解

`flex_layout` 是最灵活的布局处理器，支持任意组合。

### 基础配置

```typescript
{
  processor_name: 'flex_layout',
  direction: 'vertical',  // 'vertical' | 'horizontal'
  sections: [
    // 区块配置
  ]
}
```

### 预设区块类型

#### 1. `source_image` - 原图

```typescript
{
  type: 'source_image'
}
```

#### 2. `logo_bar` - Logo 条（顶部居中 Logo）

```typescript
{
  type: 'logo_bar',
  height: 0.08,              // 高度（0-1 为百分比，>1 为像素）
  background: 'white',       // 背景色
  logo_size: 0.7,           // Logo 尺寸比例（相对于高度）
  logo_path: '{{Make|logo}}' // Logo 路径（可选，默认根据品牌）
}
```

#### 3. `info_bar` - 信息条（品牌型号 + 参数）

```typescript
{
  type: 'info_bar',
  height: 0.12,
  background: 'white',
  text_color: '#000000',
  show_camera: true,   // 显示相机型号
  show_params: true    // 显示拍摄参数
}
```

#### 4. `sidebar` - 侧边栏（参数垂直排列）

```typescript
{
  type: 'sidebar',
  width: 0.18,         // 宽度（基于原图高度）
  background: '#FFFFFF',
  text_color: '#000000',
  show_camera: true,   // 显示相机型号
  show_logo: true      // 显示 Logo
}
```

#### 5. 自定义区块

```typescript
{
  height: 0.1,         // 区块高度
  background: 'white',
  items: [
    // 元素列表（见下文）
  ]
}
```

### 自定义元素

在自定义区块中，可以使用以下元素：

#### Logo 元素

```typescript
{
  type: 'logo',
  logo_path: '{{Make|logo}}',  // Logo 路径
  x: 0.5,                      // X 位置（0-1 为百分比）
  y: 0.5,                      // Y 位置
  size: 0.2                    // 尺寸
}
```

#### 文字元素

```typescript
{
  type: 'text',
  content: '{{Make}} {{Model}}',  // 文字内容（支持模板语法）
  x: 0.5,
  y: 0.5,
  fontSize: 0.2,
  align: 'center',  // 'left' | 'center' | 'right'
  color: '#000000',
  is_bold: true
}
```

#### 参数元素

```typescript
{
  type: 'params',  // 自动构建 "35mm f/1.8 1/125s ISO200"
  x: 0.5,
  y: 0.5,
  fontSize: 0.15,
  align: 'center',
  color: '#000000'
}
```

---

## 响应式模板（横竖屏适配）

如果需要横竖屏使用不同布局，使用响应式配置：

```typescript
export const responsiveTemplate: TemplateConfig = {
  id: 'responsive',
  name: '响应式模板',

  processors: {
    // 横屏图（宽 > 高）
    landscape: [
      {
        processor_name: 'flex_layout',
        direction: 'horizontal',  // 左右布局
        sections: [
          { type: 'source_image', flex: 3 },
          { type: 'sidebar', width: 0.18 }
        ]
      }
    ],

    // 竖屏图（高 > 宽）
    portrait: [
      {
        processor_name: 'flex_layout',
        direction: 'vertical',  // 上下布局
        sections: [
          { type: 'logo_bar', height: 0.08 },
          { type: 'source_image' },
          { type: 'info_bar', height: 0.12 }
        ]
      }
    ],

    // 正方形图（可选，默认使用 portrait）
    square: [
      // ...
    ]
  }
}
```

**判断逻辑：**
- `aspectRatio > 1.1` → landscape
- `aspectRatio < 0.9` → portrait
- `0.9 ≤ aspectRatio ≤ 1.1` → square（或 portrait）

---

## 模板语法

在文字内容中可以使用模板语法：

### 变量

```typescript
'{{Make}}'           // SONY
'{{Model}}'          // α7 IV
'{{LensModel}}'      // FE 35mm F1.8
'{{FocalLength}}'    // 35
'{{FNumber}}'        // 1.8
'{{ExposureTime}}'   // 0.008
'{{ISO}}'            // 200
```

### 过滤器

```typescript
'{{Make|logo}}'                      // 根据品牌返回 logo 路径
'{{DateTimeOriginal|datetime}}'      // 2026-01-23 14:30
'{{ExposureTime|shutter}}'          // 1/125s
'{{LensModel|default("未知镜头")}}'   // 如果无值则使用默认值
'{{Make|replace("CORPORATION", "")}}' // 替换文字
```

---

## 完整示例

### 示例1：居中样式（第一张图）

```typescript
export const centeredWatermark: TemplateConfig = {
  id: 'centered',
  name: '居中样式',
  description: '上方Logo居中，下方信息居中排列',

  processors: [
    {
      processor_name: 'flex_layout',
      direction: 'vertical',
      sections: [
        {
          type: 'logo_bar',
          height: 0.08,
          background: 'white',
          logo_size: 0.7
        },
        {
          type: 'source_image'
        },
        {
          type: 'info_bar',
          height: 0.12,
          background: 'white',
          text_color: '#000000'
        }
      ]
    }
  ],

  userOptions: {
    exifFields: {
      showBrand: true,
      showModel: true,
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true
    }
  }
}
```

### 示例2：侧边栏样式（第二张图）

```typescript
export const sidebarWatermark: TemplateConfig = {
  id: 'sidebar',
  name: '侧边栏样式',
  description: '左侧原图，右侧参数垂直排列',

  processors: {
    // 横屏图：左右布局
    landscape: [
      {
        processor_name: 'flex_layout',
        direction: 'horizontal',
        sections: [
          {
            type: 'source_image',
            flex: 4  // 占 80%
          },
          {
            type: 'sidebar',
            width: 0.18,
            background: '#FFFFFF',
            text_color: '#000000',
            show_camera: true,
            show_logo: true
          }
        ]
      }
    ],

    // 竖屏图：降级为上下布局
    portrait: [
      {
        processor_name: 'flex_layout',
        direction: 'vertical',
        sections: [
          { type: 'logo_bar', height: 0.08 },
          { type: 'source_image' },
          { type: 'info_bar', height: 0.12 }
        ]
      }
    ]
  }
}
```

### 示例3：完全自定义

```typescript
export const customTemplate: TemplateConfig = {
  id: 'custom',
  name: '自定义样式',

  processors: [
    {
      processor_name: 'flex_layout',
      direction: 'vertical',
      sections: [
        // 自定义顶部区域
        {
          height: 0.1,
          background: '#F0F0F0',
          items: [
            {
              type: 'text',
              content: '{{Make}} {{Model}}',
              x: 0.5,
              y: 0.5,
              fontSize: 0.3,
              align: 'center',
              is_bold: true
            }
          ]
        },

        // 原图
        {
          type: 'source_image'
        },

        // 自定义底部区域
        {
          height: 0.08,
          background: 'black',
          items: [
            {
              type: 'logo',
              x: 0.1,
              y: 0.5,
              size: 0.6
            },
            {
              type: 'params',
              x: 0.9,
              y: 0.5,
              fontSize: 0.2,
              align: 'right',
              color: 'white'
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 其他处理器

除了 `flex_layout`，还可以使用其他处理器组合：

### margin - 添加边距

```typescript
{
  processor_name: 'margin',
  size: 0.05,        // 边距大小（百分比或像素）
  color: 'white'     // 边距颜色
}
```

### rounded_corner - 圆角

```typescript
{
  processor_name: 'rounded_corner',
  radius: 0.02  // 圆角半径
}
```

### shadow - 阴影

```typescript
{
  processor_name: 'shadow',
  blur: 20,
  offsetX: 0,
  offsetY: 10,
  color: 'rgba(0,0,0,0.3)'
}
```

### 组合使用

```typescript
processors: [
  { processor_name: 'flex_layout', ... },
  { processor_name: 'margin', size: 0.03, color: 'white' },
  { processor_name: 'rounded_corner', radius: 0.02 },
  { processor_name: 'shadow', blur: 20 }
]
```

---

## 尺寸计算规则

所有尺寸参数都支持两种格式：

- **百分比**（0-1）：相对于参考尺寸
  - `height: 0.1` → 参考高度的 10%
  - `width: 0.2` → 参考宽度的 20%

- **固定像素**（>1）：
  - `height: 100` → 固定 100px
  - `fontSize: 48` → 固定 48px

**参考尺寸：**
- 垂直布局：参考原图高度
- 水平布局：侧边栏 width 参考原图高度
- 字体大小：参考当前区块高度

---

## 调试技巧

1. **查看控制台日志**：
   ```
   [ImageProcessor] Using landscape layout (aspect ratio: 1.33)
   [FlexLayoutProcessor] Rendering section: logo_bar
   ```

2. **逐步构建**：先实现基础布局，再添加细节

3. **使用固定配置测试**：先不用响应式，确保横屏或竖屏能正常工作

4. **参考现有模板**：查看 `centeredWatermark.ts` 和 `sidebarWatermark.ts`

---

## 常见问题

**Q: 如何让文字右对齐？**

A: 在自定义元素中设置 `align: 'right'`

**Q: 如何修改参数顺序？**

A: 侧边栏的参数顺序是固定的（焦距、光圈、快门、ISO）。如需自定义，使用自定义区块 + 多个 `text` 元素。

**Q: 如何支持多行文字？**

A: 使用多个 `text` 元素，设置不同的 `y` 坐标。

**Q: 横屏模板在竖屏图上显示异常？**

A: 使用响应式配置，为竖屏图提供降级方案。

---

## 进阶：扩展处理器

如果预设组件无法满足需求，可以创建新的处理器。参考 `app/lib/processors/flexLayout.ts` 的 `createSidebar` 方法。

**基本步骤：**

1. 在 `flexLayout.ts` 中添加新的预设方法
2. 在 `renderSection` 中注册类型
3. 在模板中使用新类型

---

更多帮助请查看源码或提交 Issue。
