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
    // 1. 生成时间戳文本
    {
      processor_name: 'rich_text',
      text: '{{DateTimeOriginal|datetime}}',
      showDateTime: true,
      height: 0.03,
      trim: true,
      color: '(232,141,52)'
    },
    // 2. 生成拍摄参数文本
    {
      processor_name: 'rich_text',
      auto_params: true,
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true,
      height: 0.03,
      trim: true,
      color: '(232,141,52)'
    },
    // 3. 横向合并时间戳和参数
    {
      processor_name: 'concat',
      spacing: 0.015,  // 文本间距
      direction: 'horizontal',
      select: [1, 2]  // 两个文字层
    },
    // 4. 将合并后的文本放置在右下角
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
