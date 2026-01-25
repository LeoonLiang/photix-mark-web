import type { TemplateConfig } from './types'

/**
 * 标准水印模板
 * 四角文字 + 右侧 Logo
 */
export const standard1: TemplateConfig = {
  id: 'standard1',
  name: '标准样式1',
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
      delimiter_color: '#D8D8D6',
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
