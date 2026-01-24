import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas, drawText, drawLogo, parseColor } from '~/utils/canvas'
import { getLogoPath } from '~/utils/logoMapper'

/**
 * 水印处理器
 * 在图片底部添加水印条，包含四角文字和右侧 Logo
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

    console.log('[WatermarkProcessor] Canvas size:', canvas.width, 'x', canvas.height)

    // 计算水印区域高度（使用宽度的百分比，避免竖屏图片水印过高）
    // 对于竖屏图片，基于宽度计算可以保持合理的水印高度
    const watermarkHeight = Math.min(canvas.width * 0.12, canvas.height * 0.08)
    const commonSpacing = canvas.width * 0.02  // 通用间距 2%
    const middleSpacing = watermarkHeight * 0.05  // 上下文字间距

    // 创建新 canvas（高度 = 原图 + 水印条）
    const watermarkCanvas = createCanvas(canvas.width, canvas.height + watermarkHeight)
    const wCtx = watermarkCanvas.getContext('2d')!

    // 绘制原图（顶部）
    wCtx.drawImage(canvas, 0, 0)

    // 绘制水印背景条（底部）
    const bgColor = config.backgroundColor || config.color || 'white'
    wCtx.fillStyle = parseColor(bgColor)
    wCtx.fillRect(0, canvas.height, canvas.width, watermarkHeight)

    const watermarkY = canvas.height  // 水印条起始 Y 坐标

    // 计算文字字体大小
    const baseFontSize = watermarkHeight * 0.2  // 基础字体
    const largeFontSize = watermarkHeight * 0.25  // 大字体（相机型号）

    // 用户配置的文字颜色
    const textColor = config.textColor || '#242424'

    // 文字垂直位置计算
    const textTopY = watermarkY + watermarkHeight / 2 - middleSpacing / 2
    const textBottomY = watermarkY + watermarkHeight / 2 + middleSpacing / 2

    // 左侧起始位置
    const leftX = commonSpacing

    // 左上（相机型号）- 根据用户配置动态构建
    if (config.left_top) {
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

      const text = parts.join(' ')

      if (text) {
        drawText(wCtx, {
          text,
          x: leftX,
          y: textTopY,
          align: 'left',
          baseline: 'bottom',
          color: parseColor(config.left_top.color || '#000000'),
          fontSize: largeFontSize,
          fontWeight: config.left_top.is_bold ? '700' : '300',
          fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
        })
      }
    }

    // 左下（镜头）- 检查用户配置
    const showLens = config.showLens !== false  // 默认显示
    if (config.left_bottom && showLens) {
      const text = this.renderTemplate(config.left_bottom.text || config.left_bottom, exif)
      if (text) {
        drawText(wCtx, {
          text,
          x: leftX,
          y: textBottomY,
          align: 'left',
          baseline: 'top',
          color: parseColor(config.left_bottom.color || textColor),
          fontSize: baseFontSize,
          fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
        })
      }
    }

    // 右侧位置计算（为 Logo 预留空间）
    const logoSize = watermarkHeight * 0.8  // Logo 尺寸
    const showLogo = config.logoEnabled !== false  // 默认显示
    const logoPosition = config.logo_position || 'right'  // logo位置：left, center, right
    let rightX = canvas.width - commonSpacing

    // 绘制 Logo
    if (config.right_logo && showLogo) {
      const logoPath = this.renderTemplate(config.right_logo, exif)
      console.log('[WatermarkProcessor] Logo path:', logoPath)
      if (logoPath) {
        let logoX: number

        if (logoPosition === 'center') {
          // 居中显示
          logoX = canvas.width / 2
        } else if (logoPosition === 'left') {
          // 左侧显示
          logoX = commonSpacing + logoSize / 2
        } else {
          // 右侧显示（默认）
          logoX = canvas.width - commonSpacing - logoSize / 2
        }

        await drawLogo(wCtx, {
          logoPath,
          x: logoX,
          y: watermarkY + watermarkHeight / 2,
          size: logoSize
        })

        // 只有右侧logo才需要预留空间
        if (logoPosition === 'right') {
          rightX = logoX - logoSize / 2 - commonSpacing
        }
      }
    }

    // 绘制分隔线（Logo 左侧，仅在右侧logo时显示）
    if (config.delimiter_color && config.right_logo && showLogo && logoPosition === 'right') {
      const delimiterWidth = canvas.width * 0.003  // 0.3%
      wCtx.fillStyle = parseColor(config.delimiter_color)
      wCtx.fillRect(
        rightX - delimiterWidth / 2,
        watermarkY + watermarkHeight * 0.1,
        delimiterWidth,
        watermarkHeight * 0.8
      )
      rightX -= delimiterWidth / 2 + commonSpacing
    }

    // 右上（拍摄参数）- 根据用户配置动态构建
    if (config.right_top) {
      // 根据用户配置构建拍摄参数文本
      const parts = []

      if (config.showFocalLength !== false && exif.FocalLength) {
        parts.push(`${exif.FocalLength}mm`)
      }
      if (config.showAperture !== false && exif.FNumber) {
        parts.push(`f/${exif.FNumber}`)
      }
      if (config.showShutter !== false && exif.ExposureTime) {
        parts.push(this.formatShutterSpeed(exif.ExposureTime))
      }
      if (config.showISO !== false && exif.ISO) {
        parts.push(`ISO${exif.ISO}`)
      }

      const paramText = parts.join(' ')

      if (paramText) {
        drawText(wCtx, {
          text: paramText,
          x: rightX,
          y: textTopY,
          align: 'right',
          baseline: 'bottom',
          color: parseColor(config.right_top.color || textColor),
          fontSize: baseFontSize,
          fontWeight: config.right_top.is_bold ? '700' : '300',
          fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
        })
      }
    }

    // 右下（拍摄时间）- 检查用户配置
    const showDateTime = config.showDateTime !== false  // 默认显示
    if (config.right_bottom && showDateTime) {
      const text = this.renderTemplate(config.right_bottom.text || config.right_bottom, exif)
      if (text) {
        drawText(wCtx, {
          text,
          x: rightX,
          y: textBottomY,
          align: 'right',
          baseline: 'top',
          color: parseColor(config.right_bottom.color || textColor),
          fontSize: baseFontSize,
          fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
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
    const result = template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      expression = expression.trim()

      // 处理 logo 过滤器 - 根据品牌获取 logo 路径
      const logoMatch = expression.match(/^(.+?)\s*\|\s*logo/)
      if (logoMatch) {
        const [, varName] = logoMatch
        const value = this.getNestedValue(exif, varName.trim())
        return value ? getLogoPath(String(value)) : '/logos/default.png'
      }

      // 处理 shutter 过滤器 - 将小数转为分数格式
      const shutterMatch = expression.match(/^(.+?)\s*\|\s*shutter/)
      if (shutterMatch) {
        const [, varName] = shutterMatch
        const value = this.getNestedValue(exif, varName.trim())
        return value ? this.formatShutterSpeed(value) : ''
      }

      // 处理 datetime 过滤器 - 格式化日期时间
      const datetimeMatch = expression.match(/^(.+?)\s*\|\s*datetime/)
      if (datetimeMatch) {
        const [, varName] = datetimeMatch
        const value = this.getNestedValue(exif, varName.trim())
        return value ? this.formatDateTime(value) : ''
      }

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

    return result
  }

  /**
   * 格式化快门速度
   * 将小数转换为分数格式 (0.008 -> 1/125)
   */
  private formatShutterSpeed(value: any): string {
    const speed = parseFloat(value)
    if (isNaN(speed)) return String(value)

    // 如果大于等于 1 秒，直接显示秒数
    if (speed >= 1) {
      return `${Math.round(speed * 10) / 10}s`
    }

    // 转换为分数格式
    const denominator = Math.round(1 / speed)
    return `1/${denominator}s`
  }

  /**
   * 格式化日期时间
   * 将 Date 对象或 "2026:01:23 14:30:00" 转换为 "2026-01-23 14:30"
   */
  private formatDateTime(value: any): string {
    // 如果是 Date 对象
    if (value instanceof Date) {
      const year = value.getFullYear()
      const month = String(value.getMonth() + 1).padStart(2, '0')
      const day = String(value.getDate()).padStart(2, '0')
      const hour = String(value.getHours()).padStart(2, '0')
      const minute = String(value.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    }

    // 如果是字符串
    const dateStr = String(value)
    // EXIF 格式: "2026:01:23 14:30:00"
    // 目标格式: "2026-01-23 14:30"
    return dateStr
      .replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')
      .replace(/:\d{2}$/, '')
  }

  /**
   * 获取嵌套对象的值
   */
  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }
}
