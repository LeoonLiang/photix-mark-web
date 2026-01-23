import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas, parseColor } from '~/utils/canvas'

/**
 * 阴影处理器
 * 为图片添加阴影效果
 */
export class ShadowProcessor extends ImageProcessor {
  name = 'shadow'
  category = 'filter' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const canvas = ctx.buffer[0]
    const shadowRadius = ctx.config.shadow_radius || 10
    const shadowColor = parseColor(ctx.config.shadow_color || 'rgba(0,0,0,0.3)')

    if (!canvas) {
      console.warn('[ShadowProcessor] No canvas in buffer')
      return ctx
    }

    // 创建更大的画布以容纳阴影
    const padding = shadowRadius * 3
    const shadowCanvas = createCanvas(
      canvas.width + padding * 2,
      canvas.height + padding * 2
    )
    const sCtx = shadowCanvas.getContext('2d')!

    // 设置阴影参数
    sCtx.shadowColor = shadowColor
    sCtx.shadowBlur = shadowRadius
    sCtx.shadowOffsetX = shadowRadius / 2
    sCtx.shadowOffsetY = shadowRadius / 2

    // 绘制原图（自动生成阴影）
    sCtx.drawImage(canvas, padding, padding)

    ctx.buffer[0] = shadowCanvas
    return ctx
  }
}
