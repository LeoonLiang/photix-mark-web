import type { TemplateConfig } from './types'

/**
 * 文件夹名+右下角参数模板
 * 显示时间戳和拍摄参数（注：Web版本无法获取文件夹名，使用文件名代替）
 */
export const folderNameParams: TemplateConfig = {
  id: 'folderNameParams',
  name: '时间戳+参数',
  description: '右下角显示拍摄时间和参数',
  preview: '/templates/folder_name.jpg',

  processors: [
    {
      processor_name: 'multi_rich_text',
      text_segments: [
        {
          text: '{{DateTimeOriginal|datetime}}',
          color: '(232,141,52)'
        },
        {
          text: '    ',  // 间隔
          color: '(232,141,52)'
        },
        {
          text: '{{FocalLength}}mm f/{{FNumber}} {{ExposureTime|shutter}} ISO{{ISO}}',
          color: '(232,141,52)'
        }
      ],
      text_spacing: 0.01,
      height: 0.03  // vh(3)
    },
    {
      processor_name: 'alignment',
      horizontal_alignment: 'right',
      vertical_alignment: 'bottom',
      offsets: [[0, 0], [-0.03, -0.03]]  // 负数偏移，往左上移动
    }
  ],

  userOptions: {
    exifFields: {
      showDateTime: true,
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true
    }
  }
}
