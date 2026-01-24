import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas, drawText, parseColor } from '~/utils/canvas'
import { renderTemplate } from './templateRenderer'

/**
 * 多段富文本处理器
 * 渲染多段不同样式的文本（如不同颜色）
 */
export class MultiRichTextProcessor extends ImageProcessor {
  name = 'multi_rich_text'
  category = 'generator' as const

  process(ctx: ProcessorContext): ProcessorContext {
    const config = ctx.config
    const exif = ctx.exif

    if (!config.text_segments || !Array.isArray(config.text_segments)) {
      console.warn('[MultiRichTextProcessor] No text_segments configured')
      return ctx
    }

    console.log('[MultiRichTextProcessor] Processing with config:', config)
    console.log('[MultiRichTextProcessor] EXIF data:', exif)

    // 渲染每段文本
    const segments = config.text_segments.map((segment: any) => ({
      text: renderTemplate(segment.text || '', exif),
      color: segment.color || 'white',
      is_bold: segment.is_bold || false,
      trim: segment.trim || false
    })).filter((seg: any) => seg.text)

    console.log('[MultiRichTextProcessor] Rendered segments:', segments)

    if (segments.length === 0) {
      console.warn('[MultiRichTextProcessor] No text after rendering')
      return ctx
    }

    // 获取参考尺寸（原图尺寸）
    const referenceHeight = ctx.buffer[0]?.height || 1000
    const referenceWidth = ctx.buffer[0]?.width || 1000

    console.log('[MultiRichTextProcessor] Reference size:', referenceWidth, 'x', referenceHeight)

    // 计算文本高度和间距
    const height = this.calculateHeight(config.height, referenceHeight)
    const fontSize = height * 0.8
    const textSpacing = this.calculateSpacing(config.text_spacing, referenceWidth)  // 使用图片宽度作为参考

    console.log('[MultiRichTextProcessor] Text height:', height, 'fontSize:', fontSize, 'spacing:', textSpacing)

    // 创建临时 canvas 测量文本
    const tempCanvas = createCanvas(1, 1)
    const tempCtx = tempCanvas.getContext('2d')!

    const segmentMetrics = segments.map((seg: any) => {
      const fontWeight = seg.is_bold ? '700' : '300'
      const fontFamily = '"Alibaba PuHuiTi", Arial, sans-serif'
      tempCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
      const metrics = tempCtx.measureText(seg.text)
      return {
        ...seg,
        width: Math.ceil(metrics.width)
      }
    })

    // 计算总宽度
    const totalWidth = segmentMetrics.reduce((sum: number, seg: any) => sum + seg.width, 0) +
                       textSpacing * (segments.length - 1)

    console.log('[MultiRichTextProcessor] Total width:', totalWidth)

    // 创建文本图层
    const padding = 40
    const textCanvas = createCanvas(totalWidth + padding * 2, height + padding * 2)
    const tCtx = textCanvas.getContext('2d')!

    // 绘制每段文本
    let currentX = padding
    segmentMetrics.forEach((seg: any) => {
      drawText(tCtx, {
        text: seg.text,
        x: currentX,
        y: height / 2 + padding,
        align: 'left',
        baseline: 'middle',
        color: parseColor(seg.color),
        fontSize,
        fontWeight: seg.is_bold ? '700' : '300',
        fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
      })
      currentX += seg.width + textSpacing
    })

    console.log('[MultiRichTextProcessor] Text canvas created:', textCanvas.width, 'x', textCanvas.height)

    // 添加到 buffer
    ctx.buffer.push(textCanvas)
    return ctx
  }

  private calculateHeight(value: number | undefined, reference: number): number {
    if (!value) return 50
    if (value > 0 && value <= 1) return value * reference
    return value
  }

  private calculateSpacing(value: number | undefined, reference: number): number {
    if (!value) return 10
    if (value > 0 && value <= 1) return value * reference
    return value
  }
}
