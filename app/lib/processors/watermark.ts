import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas, drawText, drawLogo, parseColor } from '~/utils/canvas'

/**
 * 水印处理器
 * 在图片底部添加水印条，包含四角文字和 Logo
 */
export class WatermarkProcessor extends ImageProcessor {
  name = 'watermark'
  category = 'merger' as const

  async process(ctx: ProcessorContext): Promise<ProcessorContext> {
    const canvas = ctx.buffer[0]
    const config = ctx.config
    const exif = ctx.exif

    if (!canvas) {
      console.warn('[WatermarkProcessor] No canvas in buffer')
      return ctx
    }

    // 创建水印层
    const watermarkCanvas = createCanvas(canvas.width, canvas.height)
    const wCtx = watermarkCanvas.getContext('2d')!

    // 绘制原图
    wCtx.drawImage(canvas, 0, 0)

    // 计算水印区域高度（底部 8%）
    const watermarkHeight = canvas.height * 0.08
    const padding = watermarkHeight * 0.2

    // 绘制水印背景条
    wCtx.fillStyle = parseColor(config.color || 'white')
    wCtx.fillRect(0, canvas.height - watermarkHeight, canvas.width, watermarkHeight)

    // 绘制分隔线（中间竖线）
    if (config.delimiter_color) {
      wCtx.strokeStyle = parseColor(config.delimiter_color)
      wCtx.lineWidth = 2
      wCtx.beginPath()
      wCtx.moveTo(canvas.width / 2, canvas.height - watermarkHeight + padding)
      wCtx.lineTo(canvas.width / 2, canvas.height - padding)
      wCtx.stroke()
    }

    const textY = canvas.height - watermarkHeight / 2
    const fontSize = watermarkHeight * 0.25

    // 左上（相机型号）
    if (config.left_top) {
      const text = this.renderTemplate(config.left_top.text || config.left_top, exif)
      if (text) {
        drawText(wCtx, {
          text,
          x: padding,
          y: textY - watermarkHeight / 4,
          align: 'left',
          color: parseColor(config.left_top.color || '#242424'),
          fontSize: watermarkHeight * 0.3,
          fontWeight: config.left_top.is_bold ? 'bold' : 'normal'
        })
      }
    }

    // 左下（镜头）
    if (config.left_bottom) {
      const text = this.renderTemplate(config.left_bottom.text || config.left_bottom, exif)
      if (text) {
        drawText(wCtx, {
          text,
          x: padding,
          y: textY + watermarkHeight / 4,
          align: 'left',
          color: parseColor(config.left_bottom.color || '#242424'),
          fontSize
        })
      }
    }

    // 右上（拍摄参数）
    if (config.right_top) {
      const text = this.renderTemplate(config.right_top.text || config.right_top, exif)
      if (text) {
        drawText(wCtx, {
          text,
          x: canvas.width - padding,
          y: textY - watermarkHeight / 4,
          align: config.right_alignment === 'left' ? 'left' : 'right',
          color: parseColor(config.right_top.color || '#242424'),
          fontSize
        })
      }
    }

    // 右下（拍摄时间）
    if (config.right_bottom) {
      const text = this.renderTemplate(config.right_bottom.text || config.right_bottom, exif)
      if (text) {
        drawText(wCtx, {
          text,
          x: canvas.width - padding,
          y: textY + watermarkHeight / 4,
          align: config.right_alignment === 'left' ? 'left' : 'right',
          color: parseColor(config.right_bottom.color || '#242424'),
          fontSize
        })
      }
    }

    // 绘制 Logo
    if (config.right_logo) {
      const logoPath = this.renderTemplate(config.right_logo, exif)
      if (logoPath) {
        await drawLogo(wCtx, {
          logoPath,
          x: canvas.width - padding - watermarkHeight * 0.4,
          y: textY,
          size: watermarkHeight * 0.6
        })
      }
    }

    ctx.buffer[0] = watermarkCanvas
    return ctx
  }

  /**
   * 渲染模板字符串
   * 简化版的 Jinja2 模板渲染，支持 {{variable}} 和 {{variable|default('value')}}
   */
  private renderTemplate(template: string, exif: Record<string, any>): string {
    if (!template) return ''

    // 处理 {{variable}} 和 {{variable|default('value')}}
    return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      expression = expression.trim()

      // 处理 default 过滤器
      const defaultMatch = expression.match(/^(.+?)\s*\|\s*default\(['"](.+?)['"]\)/)
      if (defaultMatch) {
        const [, varName, defaultValue] = defaultMatch
        const value = this.getNestedValue(exif, varName.trim())
        return value !== undefined && value !== null ? String(value) : defaultValue
      }

      // 处理 replace 过滤器
      const replaceMatch = expression.match(/^(.+?)\s*\|\s*replace\(['"](.+?)['"],\s*['"](.*?)['"]\)/)
      if (replaceMatch) {
        const [, varName, searchValue, replaceValue] = replaceMatch
        const value = this.getNestedValue(exif, varName.trim())
        return value ? String(value).replace(new RegExp(searchValue, 'g'), replaceValue) : ''
      }

      // 简单变量
      const value = this.getNestedValue(exif, expression)
      return value !== undefined && value !== null ? String(value) : ''
    })
  }

  /**
   * 获取嵌套对象的值
   */
  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }
}
