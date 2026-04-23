import { ImageProcessor, type ProcessorContext } from './types'
import { createCanvas, drawText, drawLogo, parseColor, drawRoundedRect } from '~/utils/canvas'
import { getLogoPath } from '~/utils/logoMapper'
import { renderTemplate } from './templateRenderer'

/**
 * 灵活布局处理器
 * 支持垂直/水平布局，可组合任意元素（文字、Logo、原图等）
 *
 * 配置示例：
 * {
 *   processor_name: 'flex_layout',
 *   direction: 'vertical',  // 'vertical' | 'horizontal'
 *   sections: [
 *     { type: 'logo_bar', height: 0.08 },
 *     { type: 'source_image' },
 *     { type: 'info_bar', height: 0.1 }
 *   ]
 * }
 */
export class FlexLayoutProcessor extends ImageProcessor {
  name = 'flex_layout'
  category = 'merger' as const

  async process(ctx: ProcessorContext): Promise<ProcessorContext> {
    const config = ctx.config
    const direction = config.direction || 'vertical'
    const sections = config.sections || []
    const sourceCanvas = ctx.buffer[0]

    if (!sourceCanvas) {
      console.warn('[FlexLayoutProcessor] No source canvas')
      return ctx
    }

    if (sections.length === 0) {
      console.warn('[FlexLayoutProcessor] No sections configured')
      return ctx
    }

    // ✨ 计算padding（确保是整数）
    const padding = config.padding || 0
    const reference = Math.min(sourceCanvas.width, sourceCanvas.height)
    const paddingSize = Math.round(this.calculateSize(padding, reference))

    // 渲染每个 section
    const layers: HTMLCanvasElement[] = []
    for (const section of sections) {
      const layer = await this.renderSection(section, ctx, sourceCanvas, paddingSize, direction)
      layers.push(layer)
    }

    // 合并图层（传递paddingSize和paddingColor）
    const finalCanvas = this.mergeLayers(layers, sections, direction, sourceCanvas, paddingSize, config.padding_color || 'white')

    ctx.buffer[0] = finalCanvas
    return ctx
  }

  /**
   * 渲染单个区块
   */
  private async renderSection(
    section: any,
    ctx: ProcessorContext,
    source: HTMLCanvasElement,
    paddingSize: number = 0,
    direction: string = 'vertical'
  ): Promise<HTMLCanvasElement> {
    const { type } = section

    // 预设类型
    if (type === 'source_image') {
      return source
    }
    if (type === 'logo_bar') {
      return await this.createLogoBar(ctx, source, section)
    }
    if (type === 'info_bar') {
      return this.createInfoBar(ctx, source, section)
    }
    if (type === 'sidebar') {
      return await this.createSidebar(ctx, source, section, paddingSize, direction)
    }

    // 自定义区域
    return await this.createCustomSection(section, ctx, source)
  }

  /**
   * 预设：Logo 条（顶部居中Logo）
   */
  private async createLogoBar(
    ctx: ProcessorContext,
    source: HTMLCanvasElement,
    config: any
  ): Promise<HTMLCanvasElement> {
    const height = Math.round(this.calculateSize(config.height || 0.08, source.height))
    const canvas = createCanvas(source.width, height)
    const lCtx = canvas.getContext('2d')!

    // 背景
    lCtx.fillStyle = parseColor(config.background || 'white')
    lCtx.fillRect(0, 0, canvas.width, canvas.height)

    // Logo - ✨ 从 ctx.config 读取用户配置
    const showLogo = ctx.config.logoEnabled !== false
    if (showLogo) {
      const logoPath = config.logo_path
        ? renderTemplate(config.logo_path, ctx.exif)
        : getLogoPath(ctx.exif.Make || '')

      if (logoPath) {
        const logoSize = Math.round(height * (config.logo_size || 0.7))

        // ✨ 可配置的垂直位置（0-1，默认 0.5 居中）
        // 考虑 logo 大小，确保 logo 不会被裁剪
        const verticalAlign = config.logo_vertical_align ?? 0.5

        // 计算 logo 的 y 坐标（logo 中心点）
        // verticalAlign = 0: logo 顶部对齐 (y = logoSize/2)
        // verticalAlign = 0.5: logo 居中 (y = canvas.height/2)
        // verticalAlign = 1: logo 底部对齐 (y = canvas.height - logoSize/2)
        const logoY = Math.round(logoSize / 2 + (canvas.height - logoSize) * verticalAlign)

        await drawLogo(lCtx, {
          logoPath,
          x: Math.round(canvas.width / 2),
          y: logoY,
          size: logoSize
        })
      }
    }

    return canvas
  }

  /**
   * 预设：信息条（品牌+型号+参数，居中）
   */
  private createInfoBar(
    ctx: ProcessorContext,
    source: HTMLCanvasElement,
    config: any
  ): HTMLCanvasElement {
    const height = Math.round(this.calculateSize(config.height || 0.1, source.height))
    const canvas = createCanvas(source.width, height)
    const lCtx = canvas.getContext('2d')!

    // 背景
    lCtx.fillStyle = parseColor(config.background || 'white')
    lCtx.fillRect(0, 0, canvas.width, canvas.height)

    // ✨ 可配置的字体大小（基于高度的比例）
    const baseFontSizeRatio = config.font_size || 0.16
    const fontSize = Math.round(height * baseFontSizeRatio)
    const lineHeight = Math.round(height / 3)

    // ✨ 可配置的垂直偏移（0-1，0=顶部，0.5=居中，1=底部）
    const brandVerticalAlign = config.brand_vertical_align ?? 0.3
    const paramsVerticalAlign = config.params_vertical_align ?? 0.7

    // ✨ 可配置的字体倍数
    const brandFontMultiplier = config.brand_font_multiplier || 1.2
    const paramsFontMultiplier = config.params_font_multiplier || 1.0

    // ✨ 可配置的颜色（独立控制品牌和参数的颜色）
    const brandColor = config.brand_color || config.text_color || '#000000'
    const paramsColor = config.params_color || config.text_color || '#000000'

    // 计算实际字体大小
    const brandFontSize = Math.round(fontSize * brandFontMultiplier)
    const paramsFontSize = Math.round(fontSize * paramsFontMultiplier)

    // 第一行：品牌型号
    if (config.show_camera !== false) {
      const parts = []
      if (ctx.config.showBrand !== false && ctx.exif.Make) {
        parts.push(ctx.exif.Make.replace('CORPORATION', '').trim())
      }
      if (ctx.config.showModel !== false && ctx.exif.Model) {
        parts.push(ctx.exif.Model)
      }
      const camera = parts.join(' ')

      if (camera) {
        // ✨ 考虑字体大小，确保文字不会被裁剪
        // verticalAlign = 0: 文字顶部对齐
        // verticalAlign = 0.5: 文字居中
        // verticalAlign = 1: 文字底部对齐
        const brandY = Math.round(brandFontSize / 2 + (canvas.height - brandFontSize) * brandVerticalAlign)

        drawText(lCtx, {
          text: camera,
          x: Math.round(canvas.width / 2),
          y: brandY,
          fontSize: brandFontSize,
          align: 'center',
          baseline: 'middle',
          fontWeight: '700',
          color: brandColor,  // ✨ 使用独立的品牌颜色
          fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
        })
      }
    }

    // 第二行：拍摄参数
    if (config.show_params !== false) {
      const params = this.buildParams(ctx.exif, ctx.config, config.params_spacing)  // ✨ 传递间距参数
      if (params) {
        // ✨ 考虑字体大小，确保文字不会被裁剪
        const paramsY = Math.round(paramsFontSize / 2 + (canvas.height - paramsFontSize) * paramsVerticalAlign)

        drawText(lCtx, {
          text: params,
          x: Math.round(canvas.width / 2),
          y: paramsY,
          fontSize: paramsFontSize,
          align: 'center',
          baseline: 'middle',
          fontWeight: '300',
          color: paramsColor,  // ✨ 使用独立的参数颜色
          fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
        })
      }
    }

    return canvas
  }

  /**
   * 预设：侧边栏（参数垂直排列）
   */
  private async createSidebar(
    ctx: ProcessorContext,
    source: HTMLCanvasElement,
    config: any,
    paddingSize: number = 0,
    direction: string = 'vertical'
  ): Promise<HTMLCanvasElement> {
    // 计算侧边栏宽度（基于原图高度，保持合适比例）
    const width = Math.round(this.calculateSize(config.width || 0.2, source.height))
    const height = source.height
    const canvas = createCanvas(width, height)
    const sCtx = canvas.getContext('2d')!

    // ✨ 禁用抗锯齿
    sCtx.imageSmoothingEnabled = false

    // ✨ 背景填充白色
    sCtx.fillStyle = parseColor(config.background || '#FFFFFF')
    sCtx.fillRect(0, 0, canvas.width, canvas.height)

    // 计算布局（确保所有尺寸都是整数）
    const padding = Math.round(width * 0.1)
    const itemHeight = Math.round(height / 8)

    // ✨ 可配置的字体大小（基于宽度的比例）
    const baseFontSizeRatio = config.font_size || 0.14
    const fontSize = Math.round(width * baseFontSizeRatio)

    // ✨ 可配置的字体倍数
    const valueFontMultiplier = config.value_font_multiplier || 0.8  // 参数数值
    const unitFontMultiplier = config.unit_font_multiplier || 0.55   // 参数单位
    const modelFontMultiplier = config.model_font_multiplier || 1 // 型号

    // 是否显示边框
    const showBorder = config.show_border !== false

    let currentY = padding

    // 参数列表
    const params = this.buildSidebarParams(ctx.exif, ctx.config)

    for (const param of params) {
      const boxY = Math.round(currentY + itemHeight * 0.1)
      const boxWidth = Math.round(width * 0.65)
      const boxHeight = Math.round(itemHeight * 0.45)
      const boxX = Math.round((width - boxWidth) / 2)

      // 绘制圆角矩形框（只框数值）
      if (showBorder) {
        drawRoundedRect(sCtx, {
          x: boxX,
          y: boxY,
          width: boxWidth,
          height: boxHeight,
          radius: Math.round(boxHeight * 0.15),
          fillColor: 'white',
          strokeColor: '#E5E5E5',
          strokeWidth: Math.max(1, Math.round(width * 0.005))
        })
      }

      // 数值（在框内居中）
      drawText(sCtx, {
        text: param.value,
        x: Math.round(canvas.width / 2),
        y: Math.round(boxY + boxHeight / 2),
        fontSize: Math.round(fontSize * valueFontMultiplier),
        align: 'center',
        baseline: 'middle',
        fontWeight: '200',
        color: config.text_color || '#000000',
        fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
      })

      // 单位（在框下方）
      drawText(sCtx, {
        text: param.unit,
        x: Math.round(canvas.width / 2),
        y: Math.round(boxY + boxHeight + itemHeight * 0.2),
        fontSize: Math.round(fontSize * unitFontMultiplier),
        align: 'center',
        baseline: 'middle',
        fontWeight: '200',
        color: config.text_color || '#999999',
        fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
      })

      currentY += itemHeight
    }

    // 相机型号（倒数第二）
    // ✨ 从 ctx.config 读取用户配置，从 config 读取 section 默认配置
    const showModel = ctx.config.showModel !== false && config.show_camera !== false
    if (showModel && ctx.exif.Model) {
      const model = ctx.exif.Model
      drawText(sCtx, {
        text: model,
        x: Math.round(canvas.width / 2),
        y: Math.round(height - itemHeight * 1),
        fontSize: Math.round(fontSize * modelFontMultiplier),
        align: 'center',
        baseline: 'middle',
        fontWeight: '700',
        color: config.text_color || '#000000',
        fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
      })
    }

    // Logo（最底部）
    // ✨ 从 ctx.config 读取用户配置（logoEnabled），从 config 读取 section 默认配置
    const showLogo = ctx.config.logoEnabled !== false && config.show_logo !== false
    if (showLogo) {
      const logoPath = config.logo_path
        ? renderTemplate(config.logo_path, ctx.exif)
        : getLogoPath(ctx.exif.Make || '')

      if (logoPath) {
        const logoSize = Math.round(width * 0.25)
        await drawLogo(sCtx, {
          logoPath,
          x: Math.round(canvas.width / 2),
          y: Math.round(height - itemHeight * 0.5),
          size: logoSize
        })
      }
    }

    return canvas
  }

  /**
   * 构建侧边栏参数列表
   */
  private buildSidebarParams(exif: any, config: any): Array<{ value: string; unit: string }> {
    const params = []

    // 焦距
    if (config.showFocalLength !== false && exif.FocalLength) {
      params.push({
        value: String(exif.FocalLength),
        unit: 'mm'
      })
    }

    // 光圈
    if (config.showAperture !== false && exif.FNumber) {
      params.push({
        value: String(exif.FNumber),
        unit: 'F'
      })
    }

    // 快门
    if (config.showShutter !== false && exif.ExposureTime) {
      const shutterValue = exif.ExposureTime < 1
        ? `1/${Math.round(1 / exif.ExposureTime)}`
        : String(exif.ExposureTime)
      params.push({
        value: shutterValue,
        unit: 'S'
      })
    }

    // ISO
    if (config.showISO !== false && exif.ISO) {
      params.push({
        value: String(exif.ISO),
        unit: 'ISO'
      })
    }

    return params
  }

  /**
   * 自定义区域
   */
  private async createCustomSection(
    section: any,
    ctx: ProcessorContext,
    source: HTMLCanvasElement
  ): Promise<HTMLCanvasElement> {
    const { background, items = [] } = section

    const layerHeight = this.calculateSize(section.height, source.height) || 100
    const layerWidth = this.calculateSize(section.width, source.width) || source.width
    const canvas = createCanvas(layerWidth, layerHeight)
    const lCtx = canvas.getContext('2d')!

    // 背景
    if (background) {
      lCtx.fillStyle = parseColor(background)
      lCtx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // 绘制元素
    for (const item of items) {
      await this.renderItem(lCtx, item, ctx, canvas)
    }

    return canvas
  }

  /**
   * 渲染单个元素
   */
  private async renderItem(
    ctx: CanvasRenderingContext2D,
    item: any,
    processorCtx: ProcessorContext,
    canvas: HTMLCanvasElement
  ) {
    const { type, x = 0.5, y = 0.5, align = 'center' } = item
    const actualX = x <= 1 ? canvas.width * x : x
    const actualY = y <= 1 ? canvas.height * y : y

    switch (type) {
      case 'logo': {
        const logoPath = item.logo_path
          ? renderTemplate(item.logo_path, processorCtx.exif)
          : getLogoPath(processorCtx.exif.Make || '')
        const size = this.calculateSize(item.size, canvas.height)
        await drawLogo(ctx, { logoPath, x: actualX, y: actualY, size })
        break
      }

      case 'text': {
        const text = renderTemplate(item.content || item.text || '', processorCtx.exif)
        const fontSize = this.calculateSize(item.fontSize || 0.2, canvas.height)
        drawText(ctx, {
          text,
          x: actualX,
          y: actualY,
          fontSize,
          align,
          baseline: 'middle',
          color: parseColor(item.color || '#000000'),
          fontWeight: item.is_bold ? '700' : '300',
          fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
        })
        break
      }

      case 'params': {
        const params = this.buildParams(processorCtx.exif, processorCtx.config, item.params_spacing)
        const fontSize = this.calculateSize(item.fontSize || 0.15, canvas.height)
        drawText(ctx, {
          text: params,
          x: actualX,
          y: actualY,
          fontSize,
          align,
          baseline: 'middle',
          color: parseColor(item.color || '#000000'),
          fontWeight: '300',
          fontFamily: '"Alibaba PuHuiTi", Arial, sans-serif'
        })
        break
      }
    }
  }

  /**
   * 构建拍摄参数字符串（横向排列）
   * @param spacing 参数之间的间距（空格数量，默认 1）
   */
  private buildParams(exif: any, config: any, spacing?: number): string {
    const parts = []

    if (config.showFocalLength !== false && exif.FocalLength) {
      parts.push(`${exif.FocalLength}mm`)
    }
    if (config.showAperture !== false && exif.FNumber) {
      parts.push(`f/${exif.FNumber}`)
    }
    if (config.showShutter !== false && exif.ExposureTime) {
      const shutterSpeed = exif.ExposureTime < 1
        ? `1/${Math.round(1 / exif.ExposureTime)}s`
        : `${exif.ExposureTime}s`
      parts.push(shutterSpeed)
    }
    if (config.showISO !== false && exif.ISO) {
      parts.push(`ISO${exif.ISO}`)
    }

    // ✨ 可配置的参数间距（默认 1 个空格）
    const separator = ' '.repeat(spacing ?? 1)
    return parts.join(separator)
  }

  /**
   * 合并图层
   */
  private mergeLayers(
    layers: HTMLCanvasElement[],
    sections: any[],
    direction: string,
    source: HTMLCanvasElement,
    paddingSize: number,
    paddingColor: string
  ): HTMLCanvasElement {
    if (direction === 'horizontal') {
      return this.mergeHorizontal(layers, sections, source, paddingSize, paddingColor)
    } else {
      return this.mergeVertical(layers, sections, paddingSize, paddingColor)
    }
  }

  /**
   * 垂直合并（上下堆叠）
   * ✨ 实现区域内居中：顶部/底部元素在各自区域（内容+padding）内居中
   */
  private mergeVertical(layers: HTMLCanvasElement[], sections: any[], paddingSize: number, paddingColor: string): HTMLCanvasElement {
    const maxWidth = Math.max(...layers.map(l => l.width))
    const totalHeight = layers.reduce((sum, l) => sum + l.height, 0)

    // ✨ 创建包含padding的canvas（确保尺寸是整数）
    const canvas = createCanvas(
      Math.round(maxWidth + paddingSize * 2),
      Math.round(totalHeight + paddingSize * 2)
    )
    const ctx = canvas.getContext('2d')!

    // ✨ 禁用抗锯齿
    ctx.imageSmoothingEnabled = false

    // ✨ 填充背景色
    ctx.fillStyle = paddingColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // ✨ 区域内居中：每个元素在自己的区域（内容+padding）内居中
    let currentY = 0

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i]
      const isFirst = i === 0
      const isLast = i === layers.length - 1

      // 定义当前元素的区域高度
      let regionHeight = layer.height

      // 顶部区域包含上 padding
      if (isFirst) {
        regionHeight += paddingSize
      }

      // 底部区域包含下 padding
      if (isLast) {
        regionHeight += paddingSize
      }

      // ✨ 在区域内垂直居中
      const drawY = Math.round(currentY + (regionHeight - layer.height) / 2)

      // ✨ 水平居中（考虑左右 padding）
      const drawX = Math.round(paddingSize + (maxWidth - layer.width) / 2)

      ctx.drawImage(layer, drawX, drawY)

      currentY += regionHeight
    }

    return canvas
  }

  /**
   * 水平合并（左右并列）
   * ✨ 实现区域内居中：左侧/右侧元素在各自区域（内容+padding）内居中
   */
  private mergeHorizontal(layers: HTMLCanvasElement[], sections: any[], source: HTMLCanvasElement, paddingSize: number, paddingColor: string): HTMLCanvasElement {
    // ✨ 在水平布局中，所有元素按实际宽度排列，不进行flex缩放
    // source_image保持原宽度，其他元素使用实际宽度
    const layoutItems = layers.map((layer, i) => ({
      layer,
      section: sections[i],
      width: layer.width  // 直接使用实际canvas宽度
    }))

    const totalWidth = layoutItems.reduce((sum, item) => sum + item.width, 0)
    const maxHeight = source.height

    // ✨ 创建包含padding的canvas（确保尺寸是整数）
    const canvas = createCanvas(
      Math.round(totalWidth + paddingSize * 2),
      Math.round(maxHeight + paddingSize * 2)
    )
    const ctx = canvas.getContext('2d')!

    // ✨ 禁用抗锯齿
    ctx.imageSmoothingEnabled = false

    // ✨ 填充背景色
    ctx.fillStyle = paddingColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // ✨ 区域内居中：每个元素在自己的区域（内容+padding）内居中
    let currentX = 0

    for (let i = 0; i < layoutItems.length; i++) {
      const item = layoutItems[i]
      if (!item) continue  // TypeScript 类型守护

      const isFirst = i === 0
      const isLast = i === layoutItems.length - 1

      // 定义当前元素的区域宽度
      let regionWidth = item.width

      // 左侧区域包含左 padding
      if (isFirst) {
        regionWidth += paddingSize
      }

      // 右侧区域包含右 padding
      if (isLast) {
        regionWidth += paddingSize
      }

      // ✨ 确保图层高度与maxHeight一致
      if (item.layer.height !== maxHeight) {
        // 创建临时canvas，扩展高度到maxHeight
        const tempCanvas = createCanvas(item.width, maxHeight)
        const tempCtx = tempCanvas.getContext('2d')!
        tempCtx.imageSmoothingEnabled = false

        // 填充背景色
        const bgColor = item.section.background ? parseColor(item.section.background) : paddingColor
        tempCtx.fillStyle = bgColor
        tempCtx.fillRect(0, 0, item.width, maxHeight)

        // 绘制原图层（垂直居中）
        const offsetY = Math.round((maxHeight - item.layer.height) / 2)
        tempCtx.drawImage(item.layer, 0, offsetY)

        // ✨ 在区域内水平居中
        const drawX = Math.round(currentX + (regionWidth - item.width) / 2)
        // ✨ 垂直方向考虑上下 padding
        const drawY = Math.round(paddingSize)

        ctx.drawImage(tempCanvas, drawX, drawY)
      } else {
        // 高度匹配，直接绘制
        // ✨ 在区域内水平居中
        const drawX = Math.round(currentX + (regionWidth - item.width) / 2)
        // ✨ 垂直方向考虑上下 padding
        const drawY = Math.round(paddingSize)

        ctx.drawImage(item.layer, drawX, drawY)
      }

      currentX += regionWidth
    }

    return canvas
  }

  /**
   * 计算尺寸（支持百分比和固定像素）
   */
  private calculateSize(value: number | undefined, reference: number): number {
    if (!value) return reference * 0.1
    if (value > 0 && value <= 1) {
      return value * reference
    }
    return value
  }
}
