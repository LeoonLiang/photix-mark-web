import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas } from '~/utils/canvas'

/**
 * 圆角处理器
 * 为图片添加圆角效果
 */
export class RoundedCornerProcessor extends ImageProcessor {
  name = 'rounded_corner'
  category = 'filter' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const canvas = ctx.buffer[0]
    const radius = ctx.config.border_radius || 20

    if (!canvas) {
      console.warn('[RoundedCornerProcessor] No canvas in buffer')
      return ctx
    }

    const roundedCanvas = createCanvas(canvas.width, canvas.height)
    const rCtx = roundedCanvas.getContext('2d')!

    // 创建圆角路径
    rCtx.beginPath()
    rCtx.moveTo(radius, 0)
    rCtx.lineTo(canvas.width - radius, 0)
    rCtx.quadraticCurveTo(canvas.width, 0, canvas.width, radius)
    rCtx.lineTo(canvas.width, canvas.height - radius)
    rCtx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height)
    rCtx.lineTo(radius, canvas.height)
    rCtx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius)
    rCtx.lineTo(0, radius)
    rCtx.quadraticCurveTo(0, 0, radius, 0)
    rCtx.closePath()

    // 应用裁剪
    rCtx.clip()

    // 绘制原图
    rCtx.drawImage(canvas, 0, 0)

    ctx.buffer[0] = roundedCanvas
    return ctx
  }
}
