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

    // 保存初始用户配置，用于覆盖模板配置
    const initialUserConfig = { ...context.config }

    // 4. 执行处理器管道
    for (const step of processors) {
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

        // 只在 watermark 处理器中应用用户配置覆盖
        if (step.processor_name === 'watermark') {
          // 用户配置优先级更高，重新应用用户的 show* 配置
          Object.keys(initialUserConfig).forEach(key => {
            if ((key.startsWith('show') || key === 'logoEnabled') && initialUserConfig[key] !== undefined) {
              context.config[key] = initialUserConfig[key]
            }
          })
        }

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
