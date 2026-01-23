import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas } from '~/utils/canvas'

/**
 * 模糊处理器
 * 对图片应用高斯模糊效果
 */
export class BlurProcessor extends ImageProcessor {
  name = 'blur'
  category = 'filter' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const canvas = ctx.buffer[0]
    const blurRadius = ctx.config.blur_radius || 20

    if (!canvas) {
      console.warn('[BlurProcessor] No canvas in buffer')
      return ctx
    }

    // 创建模糊后的 Canvas
    const blurredCanvas = createCanvas(canvas.width, canvas.height)
    const bCtx = blurredCanvas.getContext('2d')!

    // 使用 CSS filter 实现模糊（性能最好）
    bCtx.filter = `blur(${blurRadius}px)`
    bCtx.drawImage(canvas, 0, 0)

    // 重置 filter
    bCtx.filter = 'none'

    // 将模糊后的图像添加到 buffer
    ctx.buffer.push(blurredCanvas)
    return ctx
  }
}
