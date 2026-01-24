import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas } from '~/utils/canvas'

/**
 * 裁剪处理器
 * 裁剪图像到指定尺寸或比例
 */
export class CropProcessor extends ImageProcessor {
  name = 'crop'
  category = 'modifier' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const config = ctx.config

    if (ctx.buffer.length === 0) {
      console.warn('[CropProcessor] No layers in buffer')
      return ctx
    }

    const canvas = ctx.buffer[0] // 处理第一层（最终图像）
    const originalWidth = canvas.width
    const originalHeight = canvas.height

    // 计算裁剪尺寸
    const cropWidth = this.calculateSize(config.width, originalWidth)
    const cropHeight = this.calculateSize(config.height, originalHeight)

    // 如果裁剪尺寸大于等于原始尺寸，不需要裁剪
    if (cropWidth >= originalWidth && cropHeight >= originalHeight) {
      return ctx
    }

    // 计算裁剪位置（居中裁剪）
    let cropX = Math.max(0, (originalWidth - cropWidth) / 2)
    let cropY = Math.max(0, (originalHeight - cropHeight) / 2)

    // 应用偏移量
    if (config.offset && Array.isArray(config.offset) && config.offset.length === 2) {
      const xOffset = this.calculateOffset(config.offset[0], originalWidth)
      const yOffset = this.calculateOffset(config.offset[1], originalHeight)
      cropX += xOffset
      cropY += yOffset
    }

    // 确保裁剪区域在画布内
    cropX = Math.max(0, Math.min(cropX, originalWidth - cropWidth))
    cropY = Math.max(0, Math.min(cropY, originalHeight - cropHeight))

    // 创建裁剪后的 canvas
    const croppedCanvas = createCanvas(cropWidth, cropHeight)
    const cCtx = croppedCanvas.getContext('2d')!

    // 裁剪图像
    cCtx.drawImage(
      canvas,
      cropX, cropY, cropWidth, cropHeight, // 源区域
      0, 0, cropWidth, cropHeight // 目标区域
    )

    // 替换 buffer
    ctx.buffer[0] = croppedCanvas
    ctx.buffer.length = 1

    return ctx
  }

  /**
   * 计算尺寸
   * @param value 尺寸配置（倍数或百分比）
   * @param original 原始尺寸
   */
  private calculateSize(value: number | undefined, original: number): number {
    if (value === undefined || value === null) return original

    // 任何正数都视为倍数（包括 0.5、1、1.35 等）
    if (value > 0) {
      return Math.round(value * original)
    }

    return original
  }

  /**
   * 计算偏移量
   * @param value 偏移量配置（百分比或像素）
   * @param reference 参考尺寸
   */
  private calculateOffset(value: number, reference: number): number {
    if (!value) return 0

    // 如果是小数（-1 到 1），视为百分比
    if (Math.abs(value) > 0 && Math.abs(value) <= 1) {
      return value * reference
    }

    // 否则视为固定像素
    return value
  }
}
