import type { TemplateConfig } from './types'

/**
 * 居中水印模板
 * 上：Logo 居中
 * 中：原图
 * 下：品牌型号 + 参数居中
 */
export const centeredWatermark: TemplateConfig = {
  id: 'centeredWatermark',
  name: '居中样式',
  description: '上方Logo居中，下方信息居中排列，简洁优雅',
  preview: '/templates/centered.jpg',

  processors: [
    {
      processor_name: 'flex_layout',
      direction: 'vertical',
      padding: 0.03,  // ✨ 白色边距（统一居中处理）
      padding_color: 'white',
      sections: [
        // 顶部 Logo 条
        {
          type: 'logo_bar',
          height: 0.08,
          background: 'white',
          logo_size: 0.7,  // Logo 大小（基于条高的比例，默认 0.7）
        },

        // 原图
        {
          type: 'source_image'
        },

        // 底部信息条
        {
          type: 'info_bar',
          height: 0.12,
          background: 'white',
          text_color: '#000000',
          show_camera: true,
          show_params: true,

          // ✨ 字体大小配置（可选）
          // font_size: 0.16,                // 基础字体大小（基于条高的比例，默认 0.16）
          // brand_font_multiplier: 1.2,     // 品牌型号字体倍数（默认 1.2）
          // params_font_multiplier: 1.0,    // 参数字体倍数（默认 1.0）

          // ✨ 颜色配置（可选）
          // brand_color: '#000000',         // 品牌型号颜色（默认使用 text_color）
          params_color: '#666666',        // 参数颜色（默认使用 text_color）
          params_vertical_align: 0.6,  // ✨

          // ✨ 参数间距配置（可选）
          params_spacing: 2,              // 参数之间的空格数量（默认 1）
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
    },
    logo: {
      enabled: true,
      position: 'top-center'
    }
  }
}
