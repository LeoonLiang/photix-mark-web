/**
 * 处理器上下文
 * 在处理器管道中传递的数据结构
 */
export interface ProcessorContext {
  /** 图像缓冲区（支持多图层） */
  buffer: HTMLCanvasElement[]
  /** EXIF 数据 */
  exif: Record<string, any>
  /** 处理器配置 */
  config: Record<string, any>
}

/**
 * 处理器步骤配置
 */
export interface ProcessorStep {
  processor_name: string
  [key: string]: any
}

/**
 * 图像处理器抽象类
 */
export abstract class ImageProcessor {
  /** 处理器名称 */
  abstract name: string

  /** 处理器类别 */
  abstract category: 'generator' | 'filter' | 'merger'

  /**
   * 处理图像
   * @param ctx 处理器上下文
   * @returns 更新后的上下文
   */
  abstract process(ctx: ProcessorContext): ProcessorContext | Promise<ProcessorContext>
}

/**
 * 处理器类型
 */
export type ProcessorClass = new () => ImageProcessor
