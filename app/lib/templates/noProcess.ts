import type { TemplateConfig } from './types'

/**
 * 不处理模板
 * 保持原图，不添加任何水印
 */
export const noProcess: TemplateConfig = {
  id: 'noProcess',
  name: '不处理',
  description: '保持原图，不添加水印',
  preview: '/templates/no_process.jpg',

  processors: [],

  userOptions: {}
}
