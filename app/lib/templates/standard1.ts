import type { TemplateConfig } from './types'

/**
 * 标准水印模板
 * 四角文字 + 右侧 Logo
 */
export const standard1: TemplateConfig = {
  id: 'standard1',
  name: '标准水印',
  description: '经典四角水印，包含相机、镜头、拍摄参数和时间',
  preview: '/templates/standard1.jpg',

  processors: [
    {
      processor_name: 'watermark',
      left_top: {
        text: '{{exif.CameraModelName}}',
        color: '#000000',
        is_bold: true
      },
      left_bottom: {
        text: '{{exif.LensModel}}',
        color: '#242424'
      },
      right_top: {
        text: '{{exif.FocalLengthIn35mmFormat}} f/{{exif.FNumber}} {{exif.ShutterSpeed}}s ISO{{exif.ISO}}',
        color: '#242424'
      },
      right_bottom: {
        text: '{{exif.DateTimeOriginal}}',
        color: '#242424'
      },
      right_logo: '/logos/default.png',
      delimiter_color: '#D8D8D6',
      right_alignment: 'left',
      color: 'white'
    }
  ],

  userOptions: {
    exifFields: {
      showCamera: true,
      showLens: true,
      showFocalLength: true,
      showAperture: true,
      showShutter: true,
      showISO: true,
      showDateTime: true
    },
    logo: {
      enabled: true,
      position: 'right-bottom'
    },
    colors: {
      textColor: '#242424',
      backgroundColor: '#FFFFFF'
    }
  }
}
