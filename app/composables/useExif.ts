import exifr from 'exifr'
import { normalizeParsedExif } from '~/lib/editor/exif'

/**
 * EXIF 数据读取 Composable
 */
export function useExif() {
  async function readImageDimensions(file: File): Promise<Record<string, number>> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({
          ImageWidth: img.naturalWidth || img.width,
          ImageHeight: img.naturalHeight || img.height
        })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image dimensions'))
      }

      img.src = url
    })
  }

  /**
   * 从文件读取 EXIF 数据
   * @param file 图片文件
   * @returns EXIF 数据对象
   */
  async function readExif(file: File): Promise<Record<string, any>> {
    let parsedExif: Record<string, any> = {}

    try {
      console.log('[useExif] Reading EXIF from file:', file.name)

      parsedExif = (await exifr.parse(file, {
        // 读取所有可用的 EXIF 标签
        pick: [
          // 相机信息
          'Make',
          'Model',
          'CameraModelName',

          // 镜头信息
          'LensModel',
          'LensMake',

          // 拍摄参数
          'FocalLength',
          'FocalLengthIn35mmFormat',
          'FNumber',
          'AperatureValue',
          'ApertureValue',
          'ExposureTime',
          'ShutterSpeed',
          'ShutterSpeedValue',
          'ISO',
          'ISOSpeedRatings',

          // 时间信息
          'DateTimeOriginal',
          'CreateDate',
          'DateCreated',
          'DateTimeCreated',
          'DigitalCreationDate',
          'DigitalCreationDateTime',

          // 图片信息
          'ImageWidth',
          'ImageHeight',
          'Orientation'
        ]
      })) || {}
    } catch (error) {
      console.error('[useExif] Failed to read EXIF:', error)
    }

    try {
      const dimensions = await readImageDimensions(file)
      parsedExif = {
        ...dimensions,
        ...parsedExif
      }
    } catch (error) {
      console.error('[useExif] Failed to read image dimensions:', error)
    }

    const normalizedExif = normalizeParsedExif(parsedExif)
    console.log('[useExif] EXIF data:', normalizedExif)
    return normalizedExif
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
