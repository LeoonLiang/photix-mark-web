import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas } from '~/utils/canvas'

/**
 * 尺寸调整处理器
 * 调整图层的宽度或高度
 */
export class ResizeProcessor extends ImageProcessor {
  name = 'resize'
  category = 'modifier' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const config = ctx.config

    if (ctx.buffer.length === 0) {
      console.warn('[ResizeProcessor] No layers in buffer')
      return ctx
    }

    // 获取要处理的图层（默认最后一层）
    const targetIndex = config.target_index !== undefined ? config.target_index : ctx.buffer.length - 1
    const canvas = ctx.buffer[targetIndex]

    if (!canvas) {
      console.warn('[ResizeProcessor] No canvas at index', targetIndex)
      return ctx
    }

    const originalWidth = canvas.width
    const originalHeight = canvas.height

    // 计算新尺寸
    let newWidth = originalWidth
    let newHeight = originalHeight

    if (config.scale !== undefined) {
      // 使用 scale 参数（等比缩放）
      newWidth = originalWidth * config.scale
      newHeight = originalHeight * config.scale
    } else if (config.width !== undefined) {
      newWidth = this.calculateSize(config.width, originalWidth)
      // 保持宽高比
      newHeight = (newWidth / originalWidth) * originalHeight
    } else if (config.height !== undefined) {
      newHeight = this.calculateSize(config.height, originalHeight)
      // 保持宽高比
      newWidth = (newHeight / originalHeight) * originalWidth
    } else {
      console.warn('[ResizeProcessor] No width, height or scale specified')
      return ctx
    }

    newWidth = Math.round(newWidth)
    newHeight = Math.round(newHeight)

    // 创建新 canvas
    const resizedCanvas = createCanvas(newWidth, newHeight)
    const rCtx = resizedCanvas.getContext('2d')!

    // 绘制缩放后的图像
    rCtx.drawImage(canvas, 0, 0, originalWidth, originalHeight, 0, 0, newWidth, newHeight)

    // 替换 buffer 中的目标层
    ctx.buffer[targetIndex] = resizedCanvas

    return ctx
  }

  /**
   * 计算尺寸
   * @param value 尺寸配置（百分比 0-1，倍数 >1，或绝对像素）
   * @param original 原始尺寸
   */
  private calculateSize(value: number, original: number): number {
    if (!value || value <= 0) return original

    // 如果是小数（0-1），视为百分比
    if (value > 0 && value < 1) {
      return value * original
    }

    // 如果是 >1 的小数或整数，视为倍数
    return value * original
  }
}
