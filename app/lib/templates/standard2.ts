import type { TemplateConfig } from './types'

/**
 * 标准水印2模板
 * 带圆角和阴影的水印
 */
export const standard2: TemplateConfig = {
  id: 'standard2',
  name: '标准水印2',
  description: '带圆角和阴影效果的标准水印',
  preview: '/templates/standard2.jpg',

  processors: [
    {
      processor_name: 'rounded_corner',
      border_radius: 0.01  // vh(1) = 图片高度的 1%
    },
    {
      processor_name: 'shadow',
      shadow_color: 'rgba(0,0,0,0.15)',  // 更淡的阴影
      shadow_radius: 0.005  // 降低到 0.5%
    },
    {
      processor_name: 'watermark',
      // 品牌和型号（动态构建）
      showBrand: true,
      showModel: true,
      left_top: {
        color: '#000000',
        is_bold: true
      },
      // 镜头信息
      showLens: true,
      left_bottom: '{{LensModel|default("Unknown Lens")}}',
      // 拍摄参数（动态构建）
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true,
      right_top: {
        color: '#242424',
        is_bold: true
      },
      // 拍摄时间
      showDateTime: true,
      right_bottom: '{{DateTimeOriginal|datetime}}',
      // Logo 和样式
      logoEnabled: true,
      right_logo: '{{Make|logo}}',
      color: 'white',
      textColor: '#242424',
      delimiter_color: 'transparent'
    },
    {
      processor_name: 'margin',
      bottom_margin: 0.02  // vh(2) = 图片高度的 2%
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
      enabled: true
    },
    effects: {
      roundedCorner: true,
      shadow: true,
      borderRadius: 0.01,
      shadowRadius: 100
    }
  }
}
