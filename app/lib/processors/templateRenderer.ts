import { getLogoPath } from '~/utils/logoMapper'
import { formatDateTimeValue, formatShutterValue } from '~/lib/editor/exif'

/**
 * 模板渲染工具
 * 支持 Jinja2 风格的模板语法
 */

/**
 * 渲染模板字符串
 * 支持 {{variable}}, {{variable|filter}}, {{variable|filter('arg')}}
 */
export function renderTemplate(template: string, exif: Record<string, any>): string {
  if (!template) return ''

  const result = template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
    expression = expression.trim()

    // 处理 partition 过滤器 - 分割字符串
    // {{Model|partition("Z")[0]}} -> "NIKON Z 6_2".partition("Z") -> ["NIKON ", "Z", " 6_2"][0]
    const partitionMatch = expression.match(/^(.+?)\s*\|\s*partition\(['"](.+?)['"]\)\[(\d+)\]/)
    if (partitionMatch) {
      const [, varName, separator, index] = partitionMatch
      const value = getNestedValue(exif, varName.trim())
      if (value) {
        const str = String(value)
        const idx = str.indexOf(separator)
        if (idx !== -1) {
          const parts = [str.slice(0, idx), separator, str.slice(idx + separator.length)]
          return parts[parseInt(index)] || ''
        }
      }
      return ''
    }

    // 处理 logo 过滤器
    const logoMatch = expression.match(/^(.+?)\s*\|\s*logo/)
    if (logoMatch) {
      const [, varName] = logoMatch
      const value = getNestedValue(exif, varName.trim())
      return value ? getLogoPath(String(value)) : '/logos/default.png'
    }

    // 处理 shutter 过滤器
    const shutterMatch = expression.match(/^(.+?)\s*\|\s*shutter/)
    if (shutterMatch) {
      const [, varName] = shutterMatch
      const value = getNestedValue(exif, varName.trim())
      return value ? formatShutterValue(value) : ''
    }

    // 处理 datetime 过滤器
    const datetimeMatch = expression.match(/^(.+?)\s*\|\s*datetime/)
    if (datetimeMatch) {
      const [, varName] = datetimeMatch
      const value = getNestedValue(exif, varName.trim())
      return value ? formatDateTimeValue(value) : ''
    }

    // 处理 default 过滤器
    const defaultMatch = expression.match(/^(.+?)\s*\|\s*default\(['"](.+?)['"]\)/)
    if (defaultMatch) {
      const [, varName, defaultValue] = defaultMatch
      const value = getNestedValue(exif, varName.trim())
      return value !== undefined && value !== null ? String(value) : defaultValue
    }

    // 处理 replace 过滤器
    const replaceMatch = expression.match(/^(.+?)\s*\|\s*replace\(['"](.+?)['"],\s*['"](.*?)['"]\)/)
    if (replaceMatch) {
      const [, varName, searchValue, replaceValue] = replaceMatch
      const value = getNestedValue(exif, varName.trim())
      return value ? String(value).replace(new RegExp(searchValue, 'g'), replaceValue) : ''
    }

    // 简单变量
    const value = getNestedValue(exif, expression)
    return value !== undefined && value !== null ? String(value) : ''
  })

  return result
}

/**
 * 获取嵌套对象的值
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  const keys = path.split('.')
  let value: any = obj

  for (const key of keys) {
    if (value === null || value === undefined) {
      return undefined
    }
    value = value[key]
  }

  return value
}
