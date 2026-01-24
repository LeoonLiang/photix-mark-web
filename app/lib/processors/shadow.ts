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
    const shadowRadiusConfig = ctx.config.shadow_radius || 0.005  // 降低默认值到 0.5%
    const shadowColor = parseColor(ctx.config.shadow_color || 'rgba(0,0,0,0.15)')  // 降低透明度

    if (!canvas) {
      console.warn('[ShadowProcessor] No canvas in buffer')
      return ctx
    }

    // 支持百分比（0-1）或固定像素
    const shadowRadius = shadowRadiusConfig < 1
      ? shadowRadiusConfig * canvas.height  // 百分比
      : shadowRadiusConfig  // 固定像素

    // 创建更大的画布以容纳阴影（减少padding）
    const padding = shadowRadius * 2  // 从 3 降到 2
    const shadowCanvas = createCanvas(
      canvas.width + padding * 2,
      canvas.height + padding * 2
    )
    const sCtx = shadowCanvas.getContext('2d')!

    // 设置阴影参数
    sCtx.shadowColor = shadowColor
    sCtx.shadowBlur = shadowRadius
    sCtx.shadowOffsetX = 0  // 不偏移，居中
    sCtx.shadowOffsetY = shadowRadius * 0.3  // 只向下偏移一点

    // 绘制原图（自动生成阴影）
    sCtx.drawImage(canvas, padding, padding)

    ctx.buffer[0] = shadowCanvas
    return ctx
  }
}
