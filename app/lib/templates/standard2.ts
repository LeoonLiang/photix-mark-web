import type { TemplateConfig } from './types'

/**
 * 标准水印2模板
 * 带圆角和阴影的水印
 */
export const standard2: TemplateConfig = {
  id: 'standard2',
  name: '标准样式2',
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
      shadow_radius: 0.006  // 白色边框
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
      right_alignment: 'left',  // 右侧文字左对齐，保持 Logo 位置固定
      logo_right_margin: 0.04,  // Logo 右侧边距 4%
      color: 'white',
      textColor: '#242424',
      delimiter_color: 'transparent'
    },
    {
      processor_name: 'margin',
      bottom_margin: 0.01  // 从 0.02 降低到 1%，减少底部白色边距
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
