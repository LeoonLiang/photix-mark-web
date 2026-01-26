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
    const textCenterY = watermarkY + watermarkHeight / 2  // ✨ 居中位置

    // ✨ 预先检测左侧和右侧分别有几个元素
    let hasLeftTop = false
    let hasLeftBottom = false
    let hasRightTop = false
    let hasRightBottom = false

    // 检测左上（品牌型号）
    if (config.left_top) {
      const parts = []
      if (config.showBrand !== false && exif.Make) {
        parts.push(exif.Make.replace('CORPORATION', '').trim())
      }
      if (config.showModel !== false && exif.Model) {
        parts.push(exif.Model)
      }
      hasLeftTop = parts.length > 0
    }

    // 检测左下（镜头）
    const showLens = config.showLens !== false
    if (config.left_bottom && showLens) {
      const text = this.renderTemplate(config.left_bottom.text || config.left_bottom, exif, config)
      hasLeftBottom = !!text
    }

    // 检测右上（参数）
    if (config.right_top) {
      const parts = []
      if (config.showFocalLength !== false && exif.FocalLength) parts.push('1')
      if (config.showAperture !== false && exif.FNumber) parts.push('1')
      if (config.showShutter !== false && exif.ExposureTime) parts.push('1')
      if (config.showISO !== false && exif.ISO) parts.push('1')
      hasRightTop = parts.length > 0
    }

    // 检测右下（时间）
    const showDateTime = config.showDateTime !== false
    if (config.right_bottom && showDateTime) {
      const text = this.renderTemplate(config.right_bottom.text || config.right_bottom, exif, config)
      hasRightBottom = !!text
    }

    // ✨ 计算左侧和右侧的元素数量
    const leftCount = (hasLeftTop ? 1 : 0) + (hasLeftBottom ? 1 : 0)
    const rightCount = (hasRightTop ? 1 : 0) + (hasRightBottom ? 1 : 0)

    // ✨ 单个元素时的字体放大倍数（1.15倍）
    const singleElementMultiplier = 1.15

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
        // ✨ 如果左侧只有一个元素，居中显示且字体变大
        const yPos = leftCount === 1 ? textCenterY : textTopY
        const fontSize = leftCount === 1 ? largeFontSize * singleElementMultiplier : largeFontSize
        const baseline = leftCount === 1 ? 'middle' : 'bottom'

        drawText(wCtx, {
          text,
          x: leftX,
          y: yPos,
          align: 'left',
          baseline,
          color: parseColor(config.left_top.color || '#000000'),
          fontSize,
          fontWeight: config.left_top.is_bold ? '700' : '300',
          fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
        })
      }
    }

    // 左下（镜头）- 检查用户配置
    if (config.left_bottom && showLens) {
      const text = this.renderTemplate(config.left_bottom.text || config.left_bottom, exif, config)
      if (text) {
        // ✨ 如果左侧只有一个元素，居中显示且字体变大
        const yPos = leftCount === 1 ? textCenterY : textBottomY
        const fontSize = leftCount === 1 ? baseFontSize * singleElementMultiplier : baseFontSize
        const baseline = leftCount === 1 ? 'middle' : 'top'

        drawText(wCtx, {
          text,
          x: leftX,
          y: yPos,
          align: 'left',
          baseline,
          color: parseColor(config.left_bottom.color || textColor),
          fontSize,
          fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
        })
      }
    }

    // 右侧位置计算（为 Logo 预留空间）
    const logoSize = watermarkHeight * 0.8  // Logo 尺寸
    const showLogo = config.logoEnabled !== false  // 默认显示
    const logoPosition = config.logo_position || 'right'  // logo位置：left, center, right

    // Logo 右侧边距（可配置，默认为 commonSpacing 的 1.5 倍，给长 logo 更多空间）
    const logoRightMargin = config.logo_right_margin !== undefined
      ? canvas.width * config.logo_right_margin
      : commonSpacing * 1.5

    // 右侧起始 X 位置：无论是否显示 Logo，都使用相同的右边距
    let rightX = canvas.width - logoRightMargin

    // 绘制 Logo
    if (config.right_logo && showLogo) {
      const logoPath = this.renderTemplate(config.right_logo, exif, config)
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
          // 右侧显示（默认）- 增加右侧边距
          logoX = canvas.width - logoRightMargin - logoSize / 2
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

    // 右侧文字对齐方式（默认右对齐）
    const rightAlignment = config.right_alignment || 'right'

    // 预先计算右上和右下文字的宽度
    let rightTopText = ''
    let rightBottomText = ''

    // 右上（拍摄参数）
    if (config.right_top) {
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
      rightTopText = parts.join(' ')
    }

    // 右下（拍摄时间）
    // showDateTime 已在前面声明
    if (config.right_bottom && showDateTime) {
      rightBottomText = this.renderTemplate(config.right_bottom.text || config.right_bottom, exif, config) || ''
    }

    // 如果设置为左对齐，计算文字宽度并调整 X 位置
    let rightTopX = rightX
    let rightBottomX = rightX

    if (rightAlignment === 'left' && (rightTopText || rightBottomText)) {
      // ✨ 计算实际使用的字体大小（考虑单元素时的放大）
      const actualTopFontSize = rightCount === 1 ? baseFontSize * singleElementMultiplier : baseFontSize
      const actualBottomFontSize = rightCount === 1 ? baseFontSize * singleElementMultiplier : baseFontSize

      // 测量文字宽度（使用实际字体大小）
      const tempCanvas = createCanvas(100, 100)
      const tempCtx = tempCanvas.getContext('2d')!

      // 测量上方文字
      let topWidth = 0
      if (rightTopText) {
        tempCtx.font = `300 ${actualTopFontSize}px "Alibaba PuHuiTi", Arial, sans-serif`
        topWidth = tempCtx.measureText(rightTopText).width
      }

      // 测量下方文字
      let bottomWidth = 0
      if (rightBottomText) {
        tempCtx.font = `300 ${actualBottomFontSize}px "Alibaba PuHuiTi", Arial, sans-serif`
        bottomWidth = tempCtx.measureText(rightBottomText).width
      }

      // 取两者中较小的 X 位置（更靠左），实现左对齐效果
      const minX = Math.min(
        rightX - topWidth,
        rightX - bottomWidth
      )

      rightTopX = minX
      rightBottomX = minX
    }

    // 绘制右上文字
    if (rightTopText && config.right_top) {
      // ✨ 如果右侧只有一个元素，居中显示且字体变大
      const yPos = rightCount === 1 ? textCenterY : textTopY
      const fontSize = rightCount === 1 ? baseFontSize * singleElementMultiplier : baseFontSize
      const baseline = rightCount === 1 ? 'middle' : 'bottom'

      drawText(wCtx, {
        text: rightTopText,
        x: rightAlignment === 'left' ? rightTopX : rightX,
        y: yPos,
        align: rightAlignment === 'left' ? 'left' : 'right',
        baseline,
        color: parseColor(config.right_top.color || textColor),
        fontSize,
        fontWeight: config.right_top.is_bold ? '700' : '300',
        fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
      })
    }

    // 绘制右下文字
    if (rightBottomText) {
      // ✨ 如果右侧只有一个元素，居中显示且字体变大
      const yPos = rightCount === 1 ? textCenterY : textBottomY
      const fontSize = rightCount === 1 ? baseFontSize * singleElementMultiplier : baseFontSize
      const baseline = rightCount === 1 ? 'middle' : 'top'

      drawText(wCtx, {
        text: rightBottomText,
        x: rightAlignment === 'left' ? rightBottomX : rightX,
        y: yPos,
        align: rightAlignment === 'left' ? 'left' : 'right',
        baseline,
        color: parseColor(config.right_bottom?.color || textColor),
        fontSize,
        fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
      })
    }

    ctx.buffer[0] = watermarkCanvas
    return ctx
  }

  /**
   * 渲染模板字符串
   * 简化版的 Jinja2 模板渲染，支持 {{variable}} 和 {{variable|default('value')}}
   */
  private renderTemplate(template: string, exif: Record<string, any>, config?: Record<string, any>): string {
    if (!template) return ''

    // 处理 {{variable}} 和 {{variable|default('value')}}
    const result = template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      expression = expression.trim()

      // 处理 logo 过滤器 - 根据品牌获取 logo 路径
      const logoMatch = expression.match(/^(.+?)\s*\|\s*logo/)
      if (logoMatch) {
        const [, varName] = logoMatch
        const value = this.getNestedValue(exif, varName.trim())

        // 1. 优先使用配置中的自定义Logo URL
        if (value && config?.customLogoUrl) {
          return config.customLogoUrl
        }

        // 2. 其次使用默认Logo（没有品牌时）
        if (!value && config?.customDefaultLogoUrl) {
          return config.customDefaultLogoUrl
        }

        // 3. 使用系统默认Logo
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
