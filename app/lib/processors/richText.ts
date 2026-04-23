import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas, drawText, parseColor } from '~/utils/canvas'
import { renderTemplate } from './templateRenderer'

/**
 * 富文本处理器
 * 在任意位置渲染文本，创建独立的文本图层
 */
export class RichTextProcessor extends ImageProcessor {
  name = 'rich_text'
  category = 'generator' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const config = ctx.config
    const exif = ctx.exif

    // 检查是否有文本配置
    if (!config.text && !config.auto_params && !config.auto_camera) {
      console.warn('[RichTextProcessor] No text configured')
      return ctx
    }

    // 如果配置了 auto_params，根据用户配置动态构建拍摄参数文本
    let text = ''
    if (config.auto_params) {
      const parts = []

      if (config.showFocalLength !== false && exif.FocalLength) {
        parts.push(`${exif.FocalLength}mm`)
      }
      if (config.showAperture !== false && exif.FNumber) {
        parts.push(`f/${exif.FNumber}`)
      }
      if (config.showShutter !== false && exif.ExposureTime) {
        // 使用 shutter 过滤器格式化快门速度
        const shutterSpeed = exif.ExposureTime < 1
          ? `1/${Math.round(1 / exif.ExposureTime)}s`
          : `${exif.ExposureTime}s`
        parts.push(shutterSpeed)
      }
      if (config.showISO !== false && exif.ISO) {
        parts.push(`ISO${exif.ISO}`)
      }

      text = parts.join(' ')
    } else if (config.auto_camera) {
      // 相机型号文本
      const parts = []

      // 品牌
      if (config.showBrand !== false && exif.Make) {
        const make = exif.Make.replace('CORPORATION', '').trim()
        parts.push(make)
      }

      // 型号
      if (config.showModel !== false && exif.Model) {
        parts.push(exif.Model)
      }

      text = parts.join(' ')
    } else {
      // 渲染模板文本
      text = renderTemplate(config.text, exif)
    }

    if (!text || text.trim() === '') {
      console.warn('[RichTextProcessor] Text is empty after rendering, creating placeholder')
      // 创建一个极小的透明占位层，避免 buffer 索引错位
      const placeholderCanvas = createCanvas(1, 1)
      ctx.buffer.push(placeholderCanvas)
      return ctx
    }

    // 计算文本尺寸
    const height = this.calculateHeight(config.height, ctx.buffer[0]?.height || 1000)
    const fontSize = height * 0.8  // 字体大小约为高度的 80%

    // 创建临时 canvas 来测量文本宽度
    const tempCanvas = createCanvas(1, 1)
    const tempCtx = tempCanvas.getContext('2d')!
    const fontWeight = config.is_bold ? '700' : '300'
    const fontFamily = '"Alibaba PuHuiTi", Arial, sans-serif'
    tempCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    const metrics = tempCtx.measureText(text)
    const textWidth = Math.ceil(metrics.width)

    // 创建文本图层
    const padding = config.trim ? 0 : 40  // trim 时不添加 padding
    const textCanvas = createCanvas(textWidth + padding * 2, height + padding * 2)
    const tCtx = textCanvas.getContext('2d')!

    // 绘制文本
    drawText(tCtx, {
      text,
      x: textWidth / 2 + padding,
      y: height / 2 + padding,
      align: 'center',
      baseline: 'middle',
      color: parseColor(config.color || '#FFFFFF'),
      fontSize,
      fontWeight: config.is_bold ? '700' : '300',
      fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
    })

    // 添加到 buffer
    ctx.buffer.push(textCanvas)
    return ctx
  }

  /**
   * 计算高度
   * @param value 高度配置（百分比 0-1 或固定像素）
   * @param reference 参考高度
   */
  private calculateHeight(value: number | undefined, reference: number): number {
    if (!value) return 50  // 默认高度

    // 如果是小数（0-1），视为百分比
    if (value > 0 && value <= 1) {
      return value * reference
    }

    // 否则视为固定像素
    return value
  }
}
