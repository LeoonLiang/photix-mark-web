import { getLogoPath } from '~/utils/logoMapper'

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
      return value ? formatShutterSpeed(value) : ''
    }

    // 处理 datetime 过滤器
    const datetimeMatch = expression.match(/^(.+?)\s*\|\s*datetime/)
    if (datetimeMatch) {
      const [, varName] = datetimeMatch
      const value = getNestedValue(exif, varName.trim())
      return value ? formatDateTime(value) : ''
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

/**
 * 格式化快门速度
 */
function formatShutterSpeed(value: any): string {
  const speed = parseFloat(value)
  if (isNaN(speed)) return String(value)

  if (speed >= 1) {
    return `${Math.round(speed * 10) / 10}s`
  }

  const denominator = Math.round(1 / speed)
  return `1/${denominator}s`
}

/**
 * 格式化日期时间
 */
function formatDateTime(value: any): string {
  if (!value) return ''

  // 如果是 Date 对象
  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    const hours = String(value.getHours()).padStart(2, '0')
    const minutes = String(value.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  // 如果是字符串 "2026:01:23 14:30:00"
  const str = String(value)
  const match = str.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2})/)
  if (match) {
    const [, year, month, day, hours, minutes] = match
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return str
}
