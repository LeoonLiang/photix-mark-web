/**
 * 处理器入口文件
 * 导入并注册所有处理器
 */

// 导出类型
export * from './types'
export * from './registry'

// 导入所有处理器
import { WatermarkProcessor } from './watermark'
import { BlurProcessor } from './blur'
import { ShadowProcessor } from './shadow'
import { RoundedCornerProcessor } from './roundedCorner'
import { MarginProcessor } from './margin'
import { RichTextProcessor } from './richText'
import { AlignmentProcessor } from './alignment'
import { MultiRichTextProcessor } from './multiRichText'
import { ConcatProcessor } from './concat'
import { ResizeProcessor } from './resize'
import { CropProcessor } from './crop'
import { registerProcessor } from './registry'

/**
 * 初始化所有处理器
 * 在应用启动时调用
 */
export function initProcessors() {
  // 注册所有处理器
  registerProcessor(WatermarkProcessor)
  registerProcessor(BlurProcessor)
  registerProcessor(ShadowProcessor)
  registerProcessor(RoundedCornerProcessor)
  registerProcessor(MarginProcessor)
  registerProcessor(RichTextProcessor)
  registerProcessor(AlignmentProcessor)
  registerProcessor(MultiRichTextProcessor)
  registerProcessor(ConcatProcessor)
  registerProcessor(ResizeProcessor)
  registerProcessor(CropProcessor)

  console.log('[Processors] All processors initialized')
}
