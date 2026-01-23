import type { ProcessorStep } from '~/lib/processors/types'
import { canvasToBlob } from '~/utils/canvas'
import { useImageProcessor } from './useImageProcessor'

/**
 * 批量处理 Composable
 */
export function useBatchProcessor() {
  const processing = ref(false)
  const progress = ref({
    current: 0,
    total: 0,
    percent: 0
  })

  const { processImage } = useImageProcessor()

  /**
   * 批量处理图片
   * @param files 图片文件数组
   * @param processors 处理器步骤
   * @param userConfig 用户配置
   * @returns 处理结果数组
   */
  async function processBatch(
    files: File[],
    processors: ProcessorStep[],
    userConfig?: Record<string, any>
  ): Promise<Array<{ blob: Blob; name: string }>> {
    processing.value = true
    progress.value = { current: 0, total: files.length, percent: 0 }

    const results: Array<{ blob: Blob; name: string }> = []

    // 顺序处理（避免内存爆炸）
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      try {
        // 处理图片
        const canvas = await processImage(file, processors, userConfig)

        // 转换为 Blob
        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95)

        results.push({
          blob,
          name: file.name
        })
      } catch (error) {
        console.error(`Processing failed: ${file.name}`, error)
      }

      // 更新进度
      progress.value.current = i + 1
      progress.value.percent = Math.round(((i + 1) / files.length) * 100)
    }

    processing.value = false
    return results
  }

  return {
    processBatch,
    processing: readonly(processing),
    progress: readonly(progress)
  }
}
