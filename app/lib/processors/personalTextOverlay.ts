import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas, parseColor } from '~/utils/canvas'

type PersonalTextPosition = 'bottom-center' | 'top-center' | 'left-bottom' | 'right-bottom'

const DEFAULT_TEXT = 'photographed by leoon '.toUpperCase()
const FONT_FAMILY = '"Alibaba PuHuiTi", Arial, sans-serif'

/**
 * 个性文字覆盖处理器
 * 在原图上直接覆盖一层可配置文字。
 */
export class PersonalTextOverlayProcessor extends ImageProcessor {
  name = 'personal_text_overlay'
  category = 'filter' as const

  async process(ctx: ProcessorContext): Promise<ProcessorContext> {
    const baseCanvas = ctx.buffer[ctx.buffer.length - 1] || ctx.buffer[0]

    if (!baseCanvas) {
      console.warn('[PersonalTextOverlayProcessor] Missing source canvas')
      return ctx
    }

    const config = ctx.config
    const width = baseCanvas.width
    const height = baseCanvas.height
    const reference = Math.min(width, height)
    const text = String(config.personalText || DEFAULT_TEXT)
    const margin = this.resolveSize(config.textMargin, reference, 0.04)
    const opacity = this.clamp(Number(config.textOpacity ?? 0.9), 0, 1)
    const position = this.resolvePosition(config.textPosition)
    const fontWeight = this.resolveFontWeight(config.textFontWeight)
    await this.loadFont(fontWeight, reference)
    const fontSize = this.resolveFontSize(config.textFontSize, reference, text, width, margin, fontWeight)

    const outputCanvas = createCanvas(width, height)
    const outputCtx = outputCanvas.getContext('2d')!

    outputCtx.drawImage(baseCanvas, 0, 0)

    const placement = this.calculatePlacement(width, height, margin, position)

    outputCtx.save()
    outputCtx.globalAlpha = opacity
    outputCtx.fillStyle = parseColor(config.textColor || '#FFFFFF')
    outputCtx.font = `normal ${fontWeight} ${fontSize}px ${FONT_FAMILY}`
    outputCtx.textAlign = placement.align
    outputCtx.textBaseline = placement.baseline
    outputCtx.fillText(text, placement.x, placement.y)
    outputCtx.restore()

    ctx.buffer.push(outputCanvas)
    return ctx
  }

  private resolveSize(value: unknown, reference: number, fallbackRatio: number): number {
    const numericValue = Number(value)
    const safeValue = Number.isFinite(numericValue) ? numericValue : fallbackRatio

    if (safeValue > 0 && safeValue <= 1) {
      return safeValue * reference
    }

    return Math.max(0, safeValue)
  }

  private resolveFontSize(
    value: unknown,
    reference: number,
    text: string,
    width: number,
    margin: number,
    fontWeight: number
  ): number {
    const requestedSize = this.resolveSize(value, reference, 0.045)
    const maxWidth = Math.max(width - margin * 2, 1)
    const measureCanvas = createCanvas(1, 1)
    const measureCtx = measureCanvas.getContext('2d')!

    measureCtx.font = `normal ${fontWeight} ${requestedSize}px ${FONT_FAMILY}`
    const measuredWidth = measureCtx.measureText(text).width

    if (measuredWidth <= maxWidth || measuredWidth <= 0) {
      return requestedSize
    }

    return Math.max(8, requestedSize * (maxWidth / measuredWidth))
  }

  private resolveFontWeight(value: unknown): number {
    const fontWeight = Number(value)
    const supportedWeights = [300, 400, 500]

    if (supportedWeights.includes(fontWeight)) {
      return fontWeight
    }

    return 300
  }

  private async loadFont(fontWeight: number, reference: number): Promise<void> {
    if (!('fonts' in document)) return

    const fontSize = Math.max(12, Math.round(reference * 0.045))
    await document.fonts.load(`normal ${fontWeight} ${fontSize}px ${FONT_FAMILY}`)
  }

  private resolvePosition(position: unknown): PersonalTextPosition {
    const positions: PersonalTextPosition[] = ['bottom-center', 'top-center', 'left-bottom', 'right-bottom']

    if (positions.includes(position as PersonalTextPosition)) {
      return position as PersonalTextPosition
    }

    return 'bottom-center'
  }

  private calculatePlacement(
    width: number,
    height: number,
    margin: number,
    position: PersonalTextPosition
  ): { x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline } {
    switch (position) {
      case 'top-center':
        return { x: width / 2, y: margin, align: 'center', baseline: 'top' }
      case 'left-bottom':
        return { x: margin, y: height - margin, align: 'left', baseline: 'bottom' }
      case 'right-bottom':
        return { x: width - margin, y: height - margin, align: 'right', baseline: 'bottom' }
      case 'bottom-center':
      default:
        return { x: width / 2, y: height - margin, align: 'center', baseline: 'bottom' }
    }
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min
    return Math.min(Math.max(value, min), max)
  }
}
