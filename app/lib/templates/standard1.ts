import type { TemplateConfig } from './types'

/**
 * 标准水印模板
 * 四角文字 + 右侧 Logo
 */
export const standard1: TemplateConfig = {
  id: 'standard1',
  name: '经典版式',
  description: '经典四角水印，包含相机、镜头、拍摄参数和时间',
  preview: '/templates/standard1.jpg',

  processors: [
    {
      processor_name: 'watermark',
      // 使用动态配置，支持用户自定义显示字段
      showBrand: true,
      showModel: true,
      left_top: {
        color: '#000000',
        is_bold: true
      },
      showLens: true,
      left_bottom: {
        text: '{{LensModel|default("Unknown Lens")}}',
        color: '#242424'
      },
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true,
      right_top: {
        color: '#242424',
        is_bold: true
      },
      showDateTime: true,
      right_bottom: {
        text: '{{DateTimeOriginal|datetime}}',
        color: '#242424'
      },
      logoEnabled: true,
      right_logo: '{{Make|logo}}',
      right_alignment: 'left',  // 右侧文字左对齐，保持 Logo 位置固定
      logo_right_margin: 0.04,  // Logo 右侧边距 4%（默认 3%，增加到 4% 给长 logo 更多空间）
      delimiter_color: 'transparent',
      color: 'white',
      textColor: '#242424'
    }
  ],

  userOptions: {
    exifFields: {
      showBrand: true,
      showModel: true,
      showLens: true,
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true,
      showDateTime: true
    },
    logo: {
      enabled: true,
      position: 'right-bottom'
    }
  }
}
