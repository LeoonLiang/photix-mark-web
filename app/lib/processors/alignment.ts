import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas } from '~/utils/canvas'

/**
 * 对齐处理器
 * 将图层对齐到指定位置并合并
 */
export class AlignmentProcessor extends ImageProcessor {
  name = 'alignment'
  category = 'merger' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const config = ctx.config

    if (ctx.buffer.length < 2) {
      console.warn('[AlignmentProcessor] Need at least 2 layers in buffer')
      return ctx
    }

    // 选择图层
    let baseCanvas: HTMLCanvasElement
    let overlayCanvas: HTMLCanvasElement

    if (config.select && Array.isArray(config.select) && config.select.length === 2) {
      // 使用 select 参数选择图层
      const [baseIdx, overlayIdx] = config.select
      baseCanvas = ctx.buffer[baseIdx]
      overlayCanvas = ctx.buffer[overlayIdx]
    } else {
      // 默认：底层（原图）和顶层（文字层）
      baseCanvas = ctx.buffer[0]
      overlayCanvas = ctx.buffer[ctx.buffer.length - 1]
    }

    if (!baseCanvas || !overlayCanvas) {
      console.warn('[AlignmentProcessor] Missing canvas in buffer')
      return ctx
    }

    // 如果 overlay 是占位层（1x1），直接返回 base
    if (overlayCanvas.width <= 1 && overlayCanvas.height <= 1) {
      console.log('[AlignmentProcessor] Overlay is placeholder, skipping alignment')
      ctx.buffer.push(baseCanvas)
      return ctx
    }

    // 如果 base 是占位层（1x1），直接返回 overlay
    if (baseCanvas.width <= 1 && baseCanvas.height <= 1) {
      console.log('[AlignmentProcessor] Base is placeholder, using overlay')
      ctx.buffer.push(overlayCanvas)
      return ctx
    }

    // 创建合并后的 canvas
    const mergedCanvas = createCanvas(baseCanvas.width, baseCanvas.height)
    const mCtx = mergedCanvas.getContext('2d')!

    // 绘制底层
    mCtx.drawImage(baseCanvas, 0, 0)

    // 计算对齐位置
    const { x, y } = this.calculatePosition(
      baseCanvas.width,
      baseCanvas.height,
      overlayCanvas.width,
      overlayCanvas.height,
      config
    )

    // 绘制顶层
    mCtx.drawImage(overlayCanvas, x, y)

    // 添加合并结果到 buffer（不清空其他层）
    ctx.buffer.push(mergedCanvas)

    return ctx
  }

  /**
   * 计算对齐位置
   */
  private calculatePosition(
    baseWidth: number,
    baseHeight: number,
    overlayWidth: number,
    overlayHeight: number,
    config: Record<string, any>
  ): { x: number; y: number } {
    let x = 0
    let y = 0

    // 水平对齐
    const hAlign = config.horizontal_alignment || 'center'
    switch (hAlign) {
      case 'left':
        x = 0
        break
      case 'center':
        x = (baseWidth - overlayWidth) / 2
        break
      case 'right':
        x = baseWidth - overlayWidth
        break
    }

    // 垂直对齐
    const vAlign = config.vertical_alignment || 'center'
    switch (vAlign) {
      case 'top':
        y = 0
        break
      case 'center':
        y = (baseHeight - overlayHeight) / 2
        break
      case 'bottom':
        y = baseHeight - overlayHeight
        break
    }

    // 应用偏移量
    if (config.offsets && Array.isArray(config.offsets)) {
      const offsets = config.offsets[1] || config.offsets[0] || [0, 0]

      // 支持百分比（0-1）或固定像素
      const xOffset = this.calculateOffset(offsets[0], baseWidth)
      const yOffset = this.calculateOffset(offsets[1], baseHeight)

      x += xOffset
      y += yOffset
    }

    // 应用权重偏移
    if (config.weights && Array.isArray(config.weights) && config.weights.length === 2) {
      const [xWeight, yWeight] = config.weights
      // weights 使用百分比作为偏移
      x += (xWeight / 100) * baseWidth
      y += (yWeight / 100) * baseHeight
    }

    return { x, y }
  }

  /**
   * 计算偏移量
   */
  private calculateOffset(value: number, reference: number): number {
    if (!value) return 0

    // 如果是小数（0-1），视为百分比
    if (Math.abs(value) > 0 && Math.abs(value) <= 1) {
      return value * reference
    }

    // 否则视为固定像素
    return value
  }
}
