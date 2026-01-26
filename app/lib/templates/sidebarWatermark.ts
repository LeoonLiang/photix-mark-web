import type { TemplateConfig } from './types'

/**
 * 侧边栏水印模板（响应式）
 * 横屏：左图 + 右侧参数栏（垂直排列参数）
 * 竖屏：上下布局（降级为居中样式）
 */
export const sidebarWatermark: TemplateConfig = {
  id: 'sidebar',
  name: '侧边栏样式',
  description: '左侧原图，右侧参数垂直排列，适合横屏图片',
  preview: '/templates/sidebar.jpg',

  // 响应式配置
  processors: {
    // 横屏图：左右布局
    landscape: [
      {
        processor_name: 'flex_layout',
        direction: 'horizontal',
        padding: 0.03,  // ✨ 白色边距（统一居中处理）
        padding_color: 'white',
        sections: [
          // 左侧原图（占 80%）
          {
            type: 'source_image',
            flex: 4
          },

          // 右侧参数栏（占 20%）
          {
            type: 'sidebar',
            width: 0.15,  // 基于原图高度的 15%
            background: '#FFFFFF',
            text_color: '#000000',
            show_camera: true,
            show_logo: true,
            show_border: true,  // ✨ 显示参数数字的白色框（可改为 false 关闭）

            // ✨ 字体大小配置（可选）
            // font_size: 0.14,              // 基础字体大小（基于侧边栏宽度的比例，默认 0.14）
            // value_font_multiplier: 1.1,   // 参数数值字体倍数（默认 1.1）
            // unit_font_multiplier: 0.55,   // 参数单位字体倍数（默认 0.55）
            // model_font_multiplier: 0.75,  // 型号字体倍数（默认 0.75）
          }
        ]
      }
    ],

    // 竖屏图：也用左右布局，但侧边栏更窄
    portrait: [
      {
        processor_name: 'flex_layout',
        direction: 'horizontal',
        padding: 0.03,
        padding_color: 'white',
        sections: [
          {
            type: 'source_image',
            flex: 5  // 竖屏时原图占更多空间
          },
          {
            type: 'sidebar',
            width: 0.12,  // 更窄的侧边栏（12%）
            background: '#FFFFFF',
            text_color: '#000000',
            show_camera: true,
            show_logo: true,
            show_border: true,

            // ✨ 字体大小配置（可选）
            // font_size: 0.14,              // 基础字体大小（基于侧边栏宽度的比例，默认 0.14）
            // value_font_multiplier: 1.1,   // 参数数值字体倍数（默认 1.1）
            // unit_font_multiplier: 0.55,   // 参数单位字体倍数（默认 0.55）
            // model_font_multiplier: 0.75,  // 型号字体倍数（默认 0.75）
          }
        ]
      }
    ]
  },

  userOptions: {
    exifFields: {
      showModel: true,
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true
    },
    logo: {
      enabled: true,
      position: 'right-bottom'
    }
  }
}
