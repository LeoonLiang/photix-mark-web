import type { TemplateConfig } from './types'

const DEFAULT_PERSONAL_TEXT = 'photographed by leoon '.toUpperCase()

/**
 * 个性文字模板
 * 在图片上覆盖一层可自定义文字。
 */
export const personalText: TemplateConfig = {
  id: 'personalText',
  name: '个性文字',
  description: '在照片上覆盖一层可自定义的个性文字',
  preview: '/templates/personal_text.jpg',

  processors: [
    {
      processor_name: 'personal_text_overlay',
      personalText: DEFAULT_PERSONAL_TEXT,
      textMargin: 0.017,
      textColor: '#FFFFFF',
      textFontSize: 0.018,
      textFontWeight: 300,
      textOpacity: 1,
      textPosition: 'bottom-center'
    }
  ],

  userOptions: {
    colors: {
      textColor: '#FFFFFF'
    },
    personalText: {
      text: DEFAULT_PERSONAL_TEXT,
      margin: 0.017,
      fontSize: 0.018,
      opacity: 1,
      position: 'bottom-center'
    }
  }
}
