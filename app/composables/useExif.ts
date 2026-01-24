import exifr from 'exifr'

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

      const exif = await exifr.parse(file, {
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
      })

      console.log('[useExif] EXIF data:', exif)
      return exif || {}
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
