import type { ProcessorStep } from '~/lib/processors/types'

/**
 * 模板用户可配置选项
 */
export interface TemplateUserOptions {
  /** EXIF 字段显示控制 */
  exifFields?: {
    showBrand?: boolean
    showModel?: boolean
    showLens?: boolean
    showFocalLength?: boolean
    showAperture?: boolean
    showShutter?: boolean
    showISO?: boolean
    showDateTime?: boolean
  }

  /** Logo 控制 */
  logo?: {
    enabled?: boolean
    position?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'top-center'
  }

  /** 颜色控制 */
  colors?: {
    textColor?: string
    backgroundColor?: string
  }
}

/**
 * 响应式处理器配置
 * 根据图片宽高比选择不同的处理器
 */
export interface ResponsiveProcessors {
  /** 横屏图（宽 > 高）*/
  landscape: ProcessorStep[]
  /** 竖屏图（高 > 宽）*/
  portrait: ProcessorStep[]
  /** 正方形图（宽 ≈ 高，可选，默认使用 portrait）*/
  square?: ProcessorStep[]
}

/**
 * 模板配置
 */
export interface TemplateConfig {
  /** 模板 ID */
  id: string

  /** 模板名称 */
  name: string

  /** 模板描述 */
  description: string

  /** 预览图 URL */
  preview?: string

  /** 处理器步骤配置（完整配置）
   * 可以是固定配置或响应式配置
   */
  processors: ProcessorStep[] | ResponsiveProcessors

  /** 用户可调整的参数 */
  userOptions: TemplateUserOptions
}
