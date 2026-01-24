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
   * @param processors 处理器步骤配置
   * @param userConfig 用户配置（可选）
   * @returns 处理后的 Canvas
   */
  async function processImage(
    file: File,
    processors: ProcessorStep[],
    userConfig?: Record<string, any>
  ): Promise<HTMLCanvasElement> {
    // 1. 加载图片到 Canvas
    const sourceCanvas = await loadImageToCanvas(file)

    // 2. 读取 EXIF
    const exif = await readExif(file)

    // 3. 构建初始上下文
    const context: ProcessorContext = {
      buffer: [sourceCanvas],
      exif,
      config: userConfig || {}
    }

    // 4. 执行处理器管道
    for (const step of processors) {
      const ProcessorClass = getProcessor(step.processor_name)

      if (!ProcessorClass) {
        console.warn(`Processor not found: ${step.processor_name}`)
        continue
      }

      try {
        const processor = new ProcessorClass()
        // 合并步骤配置到上下文
        context.config = { ...context.config, ...step }

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
