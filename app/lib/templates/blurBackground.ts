import type { TemplateConfig } from './types'

/**
 * 背景模糊模板
 * 带模糊背景的垂直文字布局
 */
export const blurBackground: TemplateConfig = {
  id: 'blurBackground',
  name: '艺术版式',
  description: '带模糊背景效果的创意水印',
  preview: '/templates/blur_background.jpg',

  processors: [
    // 1. 对原图应用圆角和阴影
    {
      processor_name: 'rounded_corner',
      border_radius: 0.02
    },
    {
      processor_name: 'shadow',
      shadow_radius: 0.01,
      shadow_color: 'black'
    },
    // 2. 生成文字层
    {
      processor_name: 'rich_text',
      auto_camera: true,  // 自动构建相机型号文本
      showBrand: true,
      showModel: true,
      height: 0.04,
      trim: true,
      color: 'white',
      is_bold: true  // 相机型号粗体
    },
    {
      processor_name: 'rich_text',
      auto_params: true,  // 自动构建拍摄参数文本
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true,
      height: 0.03,
      trim: true,
      color: 'white',
      is_bold: false  // 拍摄参数正常字重
    },
    // 3. 合并文字
    {
      processor_name: 'concat',
      spacing: 0.02,
      direction: 'vertical',
      select: [1, 2]  // 两个文字层（buffer索引 1 和 2）
    },
    // 4. 复制原图并模糊 -> buffer: [原图, 文字1, 文字2, 合并文字, 模糊原图]
    {
      processor_name: 'blur',
      blur_radius: 0.05,
      target_index: 0
    },
    // 5. 放大模糊背景，稍微超出边界
    {
      processor_name: 'resize',
      scale: 1.15,  // 减小放大倍数
      target_index: 4
    },
    // 6. 原图保持接近原始大小，只稍微缩小以留出水印空间
    {
      processor_name: 'resize',
      scale: 0.88,  // 增大原图比例
      target_index: 0
    },
    // 7. 将原图叠加到模糊背景上，居中偏上
    {
      processor_name: 'alignment',
      horizontal_alignment: 'center',
      vertical_alignment: 'center',
      weights: [0, -5],  // 稍微往上偏移
      select: [4, 0]  // 模糊背景(buffer[4]) + 原图(buffer[0])
    },
    // 8. 将文字叠加在底部
    {
      processor_name: 'alignment',
      horizontal_alignment: 'center',
      vertical_alignment: 'bottom',
      weights: [0, -8],  // 距离底部一点点边距
      select: [5, 3]  // 前一步的合并图(buffer[5]) + 文字(buffer[3])
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
