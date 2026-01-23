import type { ProcessorStep } from '~/lib/processors/types'

/**
 * 模板用户可配置选项
 */
export interface TemplateUserOptions {
  /** EXIF 字段显示控制 */
  exifFields?: {
    showCamera?: boolean
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
    position?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'
  }

  /** 颜色控制 */
  colors?: {
    textColor?: string
    backgroundColor?: string
  }
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

  /** 处理器步骤配置（完整配置） */
  processors: ProcessorStep[]

  /** 用户可调整的参数 */
  userOptions: TemplateUserOptions
}
