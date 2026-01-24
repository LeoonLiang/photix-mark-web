/**
 * Canvas 工具函数
 */

/**
 * 创建 Canvas 元素
 */
export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

/**
 * 从 File 加载图片到 Canvas
 */
export async function loadImageToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = createCanvas(img.width, img.height)
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Cannot get 2d context'))
        return
      }

      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      resolve(canvas)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * 将 Canvas 转换为 Blob
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/jpeg',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas to Blob conversion failed'))
        }
      },
      type,
      quality
    )
  })
}

/**
 * 绘制文字
 */
export interface DrawTextOptions {
  text: string
  x: number
  y: number
  align?: CanvasTextAlign
  baseline?: CanvasTextBaseline
  color?: string
  fontSize?: number
  fontWeight?: string | number
  fontFamily?: string
}

export function drawText(ctx: CanvasRenderingContext2D, options: DrawTextOptions) {
  const {
    text,
    x,
    y,
    align = 'left',
    baseline = 'middle',
    color = '#000000',
    fontSize = 16,
    fontWeight = 'normal',
    fontFamily = 'Arial, sans-serif'
  } = options

  ctx.save()
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = baseline
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillText(text, x, y)
  ctx.restore()
}

/**
 * 加载图片
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 绘制 Logo
 */
export interface DrawLogoOptions {
  logoPath: string
  x: number
  y: number
  size: number
}

export async function drawLogo(
  ctx: CanvasRenderingContext2D,
  options: DrawLogoOptions
): Promise<void> {
  const { logoPath, x, y, size } = options

  try {
    const logo = await loadImage(logoPath)
    const aspectRatio = logo.width / logo.height
    const width = size * aspectRatio
    const height = size

    ctx.save()
    ctx.drawImage(logo, x - width / 2, y - height / 2, width, height)
    ctx.restore()
  } catch (error) {
    console.error('Failed to load logo:', error)
  }
}

/**
 * 解析颜色为 RGBA 字符串
 */
export function parseColor(color: string | number[]): string {
  if (Array.isArray(color)) {
    if (color.length === 3) {
      return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    } else if (color.length === 4) {
      return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`
    }
  }

  // 支持字符串元组格式 "(r,g,b)" 或 "(r,g,b,a)"
  if (typeof color === 'string') {
    const tupleMatch = color.match(/^\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/)
    if (tupleMatch) {
      const [, r, g, b, a] = tupleMatch
      if (a !== undefined) {
        return `rgba(${r}, ${g}, ${b}, ${parseInt(a) / 255})`
      }
      return `rgb(${r}, ${g}, ${b})`
    }
  }

  return color as string
}
