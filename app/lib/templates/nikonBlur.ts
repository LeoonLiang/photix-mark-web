import type { TemplateConfig } from './types'

/**
 * 尼康专用背景模糊模板
 * 尼康 Z 系列相机专用，红色 Z 字母
 */
export const nikonBlur: TemplateConfig = {
  id: 'nikonBlur',
  name: '尼康专用背景模糊',
  description: '尼康 Z 系列专用，红色 Z 字突出显示',
  preview: '/templates/nikon_blur.jpg',

  processors: [
    {
      processor_name: 'rounded_corner',
      border_radius: 0.02  // vh(2)
    },
    {
      processor_name: 'shadow',
      shadow_radius: 0.01,  // vh(1)
      shadow_color: 'black'
    },
    {
      processor_name: 'multi_rich_text',
      text_segments: [
        {
          text: '{{Model|partition("Z")[0]}}',  // Z 之前的部分
          color: 'white',
          is_bold: true,
          trim: true
        },
        {
          text: 'Z',
          color: 'red',
          is_bold: true,
          trim: true
        },
        {
          text: '{{Model|partition("Z")[2]|replace("_", "")}}',  // Z 之后的部分
          color: 'white',
          is_bold: true,
          trim: true
        }
      ],
      text_spacing: 0.02,  // min(vh(2), vw(2))
      height: 0.04  // vh(4)
    },
    {
      processor_name: 'rich_text',
      auto_params: true,  // 自动构建拍摄参数文本
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true,
      height: 0.03,  // vh(3)
      trim: true,
      color: 'white'
    },
    {
      processor_name: 'concat',
      alignment: 'center',
      spacing: 0.03,  // vh(3)
      direction: 'vertical',
      select: [1, 2]  // 选择两个文字层
    },
    {
      processor_name: 'blur',
      blur_radius: 0.05,
      target_index: 0
    },
    // 5. 放大模糊背景
    {
      processor_name: 'resize',
      scale: 1.15,
      target_index: 4
    },
    // 6. 原图稍微缩小
    {
      processor_name: 'resize',
      scale: 0.88,
      target_index: 0
    },
    // 7. 将原图叠加到模糊背景上
    {
      processor_name: 'alignment',
      horizontal_alignment: 'center',
      vertical_alignment: 'center',
      weights: [0, -5],
      select: [4, 0]  // 模糊背景 + 原图
    },
    // 8. 将文字叠加在底部
    {
      processor_name: 'alignment',
      horizontal_alignment: 'center',
      vertical_alignment: 'bottom',
      weights: [0, -8],
      select: [5, 3]  // 前一步的合并图 + 文字
    }
  ],

  userOptions: {
    exifFields: {
      showBrand: true,
      showModel: true,
      showLens: false,
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true,
      showDateTime: false
    },
    logo: {
      enabled: false
    }
  }
}
