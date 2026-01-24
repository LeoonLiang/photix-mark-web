import { ref, computed } from 'vue'
import type { TemplateConfig } from '~/lib/templates/types'
import { useImageProcessor } from './useImageProcessor'

/**
 * 水印预览 Composable
 * 负责生成带水印的预览图
 */
export function useWatermarkPreview() {
  const previewCache = ref<Map<string, string>>(new Map())
  const { processImage } = useImageProcessor()

  /**
   * 生成预览
   * @param file 原始图片文件
   * @param processors 处理器配置
   * @param userConfig 用户配置
   * @returns 预览图 URL (data URL)
   */
  async function generatePreview(
    file: File,
    processors: any[],
    userConfig: Record<string, any>
  ): Promise<string> {
    try {
      // 生成缓存key
      const cacheKey = `${file.name}-${JSON.stringify(processors)}-${JSON.stringify(userConfig)}`

      // 检查缓存
      if (previewCache.value.has(cacheKey)) {
        return previewCache.value.get(cacheKey)!
      }

      // 处理图片
      const canvas = await processImage(file, processors, userConfig)

      // 转换为 Data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)

      // 缓存结果
      previewCache.value.set(cacheKey, dataUrl)

      // 限制缓存大小（最多10张）
      if (previewCache.value.size > 10) {
        const firstKey = previewCache.value.keys().next().value
        previewCache.value.delete(firstKey)
      }

      return dataUrl
    } catch (error) {
      console.error('Preview generation failed:', error)
      // 失败时返回原图
      return URL.createObjectURL(file)
    }
  }

  /**
   * 清除所有缓存
   */
  function clearCache() {
    previewCache.value.clear()
  }

  /**
   * 清除指定文件的缓存
   */
  function clearFileCache(fileName: string) {
    const keysToDelete: string[] = []
    previewCache.value.forEach((_, key) => {
      if (key.startsWith(fileName)) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach(key => previewCache.value.delete(key))
  }

  return {
    generatePreview,
    clearCache,
    clearFileCache
  }
}
