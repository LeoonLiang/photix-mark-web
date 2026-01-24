import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas } from '~/utils/canvas'

/**
 * 模糊处理器
 * 对图片应用高斯模糊效果
 */
export class BlurProcessor extends ImageProcessor {
  name = 'blur'
  category = 'modifier' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const config = ctx.config

    // 获取要处理的图层（默认 buffer[0]，即原图）
    const targetIndex = config.target_index !== undefined ? config.target_index : 0
    const canvas = ctx.buffer[targetIndex]

    if (!canvas) {
      console.warn('[BlurProcessor] No canvas in buffer at index', targetIndex)
      return ctx
    }

    // 计算模糊半径
    const blurRadiusConfig = config.blur_radius || 0.03
    const blurRadius = blurRadiusConfig < 1
      ? blurRadiusConfig * canvas.height
      : blurRadiusConfig

    // 创建模糊后的 Canvas
    const blurredCanvas = createCanvas(canvas.width, canvas.height)
    const bCtx = blurredCanvas.getContext('2d')!

    // 使用 CSS filter 实现模糊（性能最好）
    bCtx.filter = `blur(${blurRadius}px)`
    bCtx.drawImage(canvas, 0, 0)

    // 重置 filter
    bCtx.filter = 'none'

    // 将模糊后的图像添加到 buffer（不替换原图）
    ctx.buffer.push(blurredCanvas)
    return ctx
  }
}
