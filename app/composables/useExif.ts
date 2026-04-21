import exifr from 'exifr'

/**
 * 从图片文件读取尺寸
 * @param file 图片文件
 * @returns 图片尺寸对象
 */
async function getImageDimensions(file: File): Promise<{ width?: number, height?: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ width: undefined, height: undefined })
    }

    img.src = url
  })
}

/**
 * EXIF 数据读取 Composable
 */
export function useExif() {
  /**
   * 从文件读取 EXIF 数据
   * @param file 图片文件
   * @returns EXIF 数据对象
   */
async function readExif(file: File): Promise<Record<string, any>> {
    try {
      console.log('[useExif] Reading EXIF from file:', file.name)

      // 同时读取 EXIF 数据和图片尺寸
      const [exif, dimensions] = await Promise.all([
        exifr.parse(file),
        getImageDimensions(file)
      ])

      console.log('[useExif] EXIF data:', exif)
      console.log('[useExif] Dimensions:', dimensions)

      // 将尺寸信息合并到 EXIF 数据中
      const result = {
        ...(exif || {}),
        // 使用 Image 对象读取的尺寸，因为 EXIF 中的尺寸可能不准确
        ImageWidth: dimensions.width,
        ImageHeight: dimensions.height
      }

      return result
    } catch (error) {
      console.error('[useExif] Failed to read EXIF:', error)
      return {}
    }
  }

  /**
   * 批量读取多个文件的 EXIF
   * @param files 图片文件数组
   * @returns EXIF 数据数组
   */
  async function readBatchExif(files: File[]): Promise<Array<{file: File, exif: Record<string, any>}>> {
    const results = await Promise.all(
      files.map(async (file) => ({
        file,
        exif: await readExif(file)
      }))
    )
    return results
  }

  return {
    readExif,
    readBatchExif
  }
}
