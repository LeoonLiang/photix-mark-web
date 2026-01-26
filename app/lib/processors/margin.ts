import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas } from '~/utils/canvas'

/**
 * 边距处理器
 * 在图片周围添加边距（白边）
 */
export class MarginProcessor extends ImageProcessor {
  name = 'margin'
  category = 'filter' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const canvas = ctx.buffer[0]
    const config = ctx.config

    if (!canvas) {
      console.warn('[MarginProcessor] No canvas in buffer')
      return ctx
    }

    // 计算边距（支持百分比或固定像素）
    // ✨ 使用统一的参考尺寸（取宽高中较小值），确保四周边距一致
    const reference = Math.min(canvas.width, canvas.height)

    // 如果设置了 size，则四周统一边距
    const defaultSize = config.size !== undefined ? config.size : 0
    const marginSize = this.calculateMargin(defaultSize, reference)

    const bottomMargin = config.bottom_margin !== undefined
      ? this.calculateMargin(config.bottom_margin, reference)
      : marginSize
    const topMargin = config.top_margin !== undefined
      ? this.calculateMargin(config.top_margin, reference)
      : marginSize
    const leftMargin = config.left_margin !== undefined
      ? this.calculateMargin(config.left_margin, reference)
      : marginSize
    const rightMargin = config.right_margin !== undefined
      ? this.calculateMargin(config.right_margin, reference)
      : marginSize

    // 创建新 canvas（增加边距）
    const marginCanvas = createCanvas(
      canvas.width + leftMargin + rightMargin,
      canvas.height + topMargin + bottomMargin
    )
    const mCtx = marginCanvas.getContext('2d')!

    // 填充背景色（默认白色）
    mCtx.fillStyle = config.margin_color || config.color || 'white'
    mCtx.fillRect(0, 0, marginCanvas.width, marginCanvas.height)

    // 绘制原图
    mCtx.drawImage(canvas, leftMargin, topMargin)

    ctx.buffer[0] = marginCanvas
    return ctx
  }

  /**
   * 计算边距值
   * @param value 边距配置（百分比 0-1 或固定像素）
   * @param reference 参考尺寸（宽度或高度）
   */
  private calculateMargin(value: number | undefined, reference: number): number {
    if (!value) return 0

    // 如果是小数（0-1），视为百分比
    if (value > 0 && value < 1) {
      return value * reference
    }

    // 否则视为固定像素
    return value
  }
}
