import JSZip from 'jszip'
import FileSaver from 'file-saver'

/**
 * 导出工具函数
 */

/**
 * 智能导出图片
 * 单张直接导出，多张打包 ZIP
 * @param results 处理结果数组
 */
export async function downloadImages(
  results: Array<{ blob: Blob; name: string }>
): Promise<void> {
  if (results.length === 0) {
    console.warn('No images to export')
    return
  }

  if (results.length === 1) {
    // 单张：直接导出
    const result = results[0]
    const fileName = generateFileName(result.name)
    FileSaver.saveAs(result.blob, fileName)
  } else {
    // 多张：打包 ZIP
    const zip = new JSZip()

    for (const result of results) {
      const fileName = generateFileName(result.name)
      zip.file(fileName, result.blob)
    }

    // 生成 ZIP
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    })

    // 导出 ZIP
    const timestamp = new Date().toISOString().slice(0, 10)
    FileSaver.saveAs(zipBlob, `photix-mark-${timestamp}.zip`)
  }
}

/**
 * 生成输出文件名
 * @param originalName 原始文件名
 * @returns 带水印后缀的文件名
 */
function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop() || 'jpg'
  const basename = originalName.replace(/\.[^/.]+$/, '')
  return `${basename}.${ext}`
}
