import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas } from '~/utils/canvas'

/**
 * 合并处理器
 * 将 buffer 中的多个图层合并成一个
 */
export class ConcatProcessor extends ImageProcessor {
  name = 'concat'
  category = 'merger' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const config = ctx.config

    if (ctx.buffer.length < 2) {
      console.warn('[ConcatProcessor] Need at least 2 layers in buffer')
      return ctx
    }

    // 选择要合并的图层
    let layers = ctx.buffer
    if (config.select && Array.isArray(config.select)) {
      layers = config.select.map((idx: number) => ctx.buffer[idx]).filter(Boolean)
    }

    // 过滤掉空的占位层（1x1 的透明层）
    layers = layers.filter(layer => layer.width > 1 || layer.height > 1)

    if (layers.length < 1) {
      console.warn('[ConcatProcessor] No valid layers to concat after filtering')
      // 创建一个空占位层
      const placeholderCanvas = createCanvas(1, 1)
      ctx.buffer.push(placeholderCanvas)
      return ctx
    }

    if (layers.length === 1) {
      // 只有一层，直接添加到 buffer
      ctx.buffer.push(layers[0])
      return ctx
    }

    // 获取方向
    const direction = config.direction || (config.vertical !== false ? 'vertical' : 'horizontal')
    const spacing = this.calculateSpacing(config.spacing, layers)

    if (direction === 'vertical') {
      return this.concatVertical(ctx, layers, spacing)
    } else {
      return this.concatHorizontal(ctx, layers, spacing)
    }
  }

  /**
   * 垂直合并（上下堆叠）
   */
  private concatVertical(ctx: ProcessorContext, layers: HTMLCanvasElement[], spacing: number): ProcessorContext {
    // 计算总尺寸
    const maxWidth = Math.max(...layers.map(l => l.width))
    const totalHeight = layers.reduce((sum, l) => sum + l.height, 0) + spacing * (layers.length - 1)

    // 创建合并后的 canvas
    const mergedCanvas = createCanvas(maxWidth, totalHeight)
    const mCtx = mergedCanvas.getContext('2d')!

    // 依次绘制每层（垂直堆叠）
    let currentY = 0
    for (const layer of layers) {
      const x = (maxWidth - layer.width) / 2 // 水平居中
      mCtx.drawImage(layer, x, currentY)
      currentY += layer.height + spacing
    }

    // 添加到 buffer
    ctx.buffer.push(mergedCanvas)
    return ctx
  }

  /**
   * 水平合并（左右并列）
   */
  private concatHorizontal(ctx: ProcessorContext, layers: HTMLCanvasElement[], spacing: number): ProcessorContext {
    // 计算总尺寸
    const totalWidth = layers.reduce((sum, l) => sum + l.width, 0) + spacing * (layers.length - 1)
    const maxHeight = Math.max(...layers.map(l => l.height))

    // 创建合并后的 canvas
    const mergedCanvas = createCanvas(totalWidth, maxHeight)
    const mCtx = mergedCanvas.getContext('2d')!

    // 依次绘制每层（水平并列）
    let currentX = 0
    for (const layer of layers) {
      const y = (maxHeight - layer.height) / 2 // 垂直居中
      mCtx.drawImage(layer, currentX, y)
      currentX += layer.width + spacing
    }

    // 添加到 buffer
    ctx.buffer.push(mergedCanvas)
    return ctx
  }

  /**
   * 计算间距
   */
  private calculateSpacing(value: number | undefined, layers: HTMLCanvasElement[]): number {
    if (!value) return 0

    // 计算参考尺寸（取第一个图层的高度）
    const reference = layers[0]?.height || 100

    // 如果是小数（0-1），视为百分比
    if (value > 0 && value <= 1) {
      return value * reference
    }

    // 否则视为固定像素
    return value
  }
}
