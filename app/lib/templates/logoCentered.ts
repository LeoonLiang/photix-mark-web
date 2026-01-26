import type { TemplateConfig } from './types'

/**
 * Logo居中模板
 * 只显示居中的 Logo，无文字
 */
export const logoCentered: TemplateConfig = {
  id: 'logoCentered',
  name: '品牌印记',
  description: '只显示居中的品牌 Logo，适合突出品牌',
  preview: '/templates/logo_centered.jpg',

  processors: [
    {
      processor_name: 'watermark',
      // 隐藏所有文字
      showBrand: false,
      showModel: false,
      showLens: false,
      showFocalLength: false,
      showAperture: false,
      showShutter: false,
      showISO: false,
      showDateTime: false,
      // 只显示居中 Logo
      logoEnabled: true,
      logo_position: 'center',  // logo居中显示
      right_logo: '{{Make|logo}}',
      // 移除分隔线
      delimiter_color: '',
      color: 'white',
      backgroundColor: 'white'
    }
  ],

  userOptions: {
    // Logo居中模板不需要EXIF字段配置
    logo: {
      enabled: true
    }
  }
}
