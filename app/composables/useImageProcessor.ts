import type { ProcessorContext, ProcessorStep } from '~/lib/processors/types'
import { getProcessor } from '~/lib/processors/registry'
import { loadImageToCanvas } from '~/utils/canvas'
import { useExif } from './useExif'

/**
 * 图像处理 Composable
 */
export function useImageProcessor() {
  const { readExif } = useExif()

  /**
   * 处理单张图片
   * @param file 图片文件
   * @param processors 处理器步骤配置（可以是数组或响应式配置）
   * @param userConfig 用户配置（可选）
   * @returns 处理后的 Canvas
   */
  async function processImage(
    file: File,
    processors: ProcessorStep[] | { landscape: ProcessorStep[]; portrait: ProcessorStep[]; square?: ProcessorStep[] },
    userConfig?: Record<string, any>
  ): Promise<HTMLCanvasElement> {
    // 1. 加载图片到 Canvas
    const sourceCanvas = await loadImageToCanvas(file)

    // 2. 读取 EXIF
    const exif = await readExif(file)

    // 3. 选择处理器配置（如果是响应式配置）
    let actualProcessors: ProcessorStep[]

    if (!Array.isArray(processors)) {
      // 响应式配置：根据图片宽高比选择
      const aspectRatio = sourceCanvas.width / sourceCanvas.height

      if (aspectRatio > 1.1) {
        // 横屏图（宽显著大于高）
        actualProcessors = processors.landscape
        console.log('[ImageProcessor] Using landscape layout (aspect ratio:', aspectRatio.toFixed(2), ')')
      } else if (aspectRatio < 0.9) {
        // 竖屏图（高显著大于宽）
        actualProcessors = processors.portrait
        console.log('[ImageProcessor] Using portrait layout (aspect ratio:', aspectRatio.toFixed(2), ')')
      } else {
        // 正方形图（宽高接近）
        actualProcessors = processors.square || processors.portrait
        console.log('[ImageProcessor] Using square layout (aspect ratio:', aspectRatio.toFixed(2), ')')
      }
    } else {
      // 固定配置
      actualProcessors = processors
    }

    // 4. 构建初始上下文
    const context: ProcessorContext = {
      buffer: [sourceCanvas],
      exif,
      config: userConfig || {}
    }

    // 保存初始用户配置，用于覆盖模板配置
    const initialUserConfig = { ...context.config }

    // 5. 执行处理器管道
    for (const step of actualProcessors) {
      const ProcessorClass = getProcessor(step.processor_name)

      if (!ProcessorClass) {
        console.warn(`Processor not found: ${step.processor_name}`)
        continue
      }

      try {
        const processor = new ProcessorClass()
        // 不要累积配置，每次都重新合并
        // 保留 exif 和 buffer，但重置 config
        context.config = { ...initialUserConfig, ...step }

        // 用户配置优先级更高，重新应用用户的 show* 和 logo 配置
        // 适用于所有处理器（watermark、rich_text 等）
        Object.keys(initialUserConfig).forEach(key => {
          // 用户显式设置的配置优先
          if (initialUserConfig[key] !== undefined) {
            context.config[key] = initialUserConfig[key]
          }
        })

        // 执行处理
        const result = processor.process(context)

        // 如果返回 Promise，等待完成
        if (result instanceof Promise) {
          await result
        }
      } catch (error) {
        console.error(`Error in processor ${step.processor_name}:`, error)
      }
    }

    // 5. 返回最终 Canvas（通常是 buffer 的最后一层）
    const finalCanvas = context.buffer[context.buffer.length - 1] || context.buffer[0]
    return finalCanvas
  }

  return {
    processImage
  }
}
