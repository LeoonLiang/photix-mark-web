export const EDITABLE_EXIF_FIELDS = [
  { key: 'Make', label: '品牌', inputMode: 'text' },
  { key: 'Model', label: '型号', inputMode: 'text' },
  { key: 'LensModel', label: '镜头', inputMode: 'text' },
  { key: 'FocalLength', label: '焦距', inputMode: 'text' },
  { key: 'FNumber', label: '光圈', inputMode: 'text' },
  { key: 'ExposureTime', label: '快门', inputMode: 'text' },
  { key: 'ISO', label: 'ISO', inputMode: 'text' },
  { key: 'DateTimeOriginal', label: '拍摄时间', inputMode: 'text' }
] as const

export type EditableExifKey = typeof EDITABLE_EXIF_FIELDS[number]['key']
export type ExifOverrides = Partial<Record<EditableExifKey, string>>

const PARAM_KEYS = ['FocalLength', 'FNumber', 'ExposureTime', 'ISO'] as const

export function hasExifValue(value: unknown): boolean {
  return value !== undefined && value !== null && String(value).trim() !== ''
}

export function mergeExifWithOverrides(
  exif: Record<string, any> | undefined,
  overrides: Record<string, any> | undefined
): Record<string, any> {
  return {
    ...(exif || {}),
    ...(overrides || {})
  }
}

export function normalizeExifOverrides(
  draft: Record<string, any>
): ExifOverrides {
  const normalized: ExifOverrides = {}

  for (const field of EDITABLE_EXIF_FIELDS) {
    const rawValue = draft[field.key]

    if (!hasExifValue(rawValue)) {
      continue
    }

    normalized[field.key] = String(rawValue).trim()
  }

  return normalized
}

export function normalizeParsedExif(exif: Record<string, any>): Record<string, any> {
  const normalized = { ...exif }

  if (hasExifValue(normalized.Make)) {
    normalized.Make = String(normalized.Make).replace('CORPORATION', '').trim()
  }

  if (hasExifValue(normalized.Model)) {
    normalized.Model = String(normalized.Model).trim()
  }

  if (hasExifValue(normalized.LensModel)) {
    normalized.LensModel = String(normalized.LensModel).trim()
  }

  for (const key of PARAM_KEYS) {
    if (hasExifValue(normalized[key])) {
      normalized[key] = formatExifValue(key, normalized[key])
    }
  }

  if (hasExifValue(normalized.DateTimeOriginal)) {
    normalized.DateTimeOriginal = formatDateTimeValue(normalized.DateTimeOriginal)
  }

  return normalized
}

export function formatExifValue(key: EditableExifKey, value: unknown): string {
  const raw = String(value).trim()

  switch (key) {
    case 'FocalLength':
      return raw.toLowerCase().includes('mm') ? raw : `${raw}mm`
    case 'FNumber':
      return raw.toLowerCase().startsWith('f/') ? raw : `f/${raw}`
    case 'ExposureTime':
      return formatShutterValue(raw)
    case 'ISO':
      return raw.toUpperCase().startsWith('ISO') ? raw : `ISO ${raw}`
    case 'DateTimeOriginal':
      return formatDateTimeValue(raw)
    default:
      return raw
  }
}

export function formatShutterValue(value: unknown): string {
  const raw = String(value).trim()

  if (/[a-zA-Z/]/.test(raw)) {
    return raw.endsWith('s') || raw.endsWith('S') ? raw : `${raw}s`
  }

  const numeric = Number(raw)
  if (Number.isNaN(numeric)) {
    return raw
  }

  if (numeric >= 1) {
    const rounded = Math.round(numeric * 10) / 10
    return `${rounded}s`
  }

  return `1/${Math.round(1 / numeric)}s`
}

export const DATE_TIME_FORMAT_OPTIONS = [
  { value: 'datetime', label: '年月日时分秒', example: '2026-10-12 14:30:45' },
  { value: 'slash', label: '斜杠分隔', example: '2026/10/12 14:30:45' },
  { value: 'dot', label: '圆点分隔', example: '2026.10.12 14:30:45' },
  { value: 'chinese', label: '中文日期', example: '2026年10月12日 14:30:45' },
  { value: 'minute', label: '精确到分钟', example: '2026-10-12 14:30' },
  { value: 'date', label: '仅日期', example: '2026-10-12' }
] as const

export type DateTimeFormat = typeof DATE_TIME_FORMAT_OPTIONS[number]['value'] | 'custom'
export const DEFAULT_DATE_TIME_FORMAT: DateTimeFormat = 'datetime'
export const DEFAULT_CUSTOM_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function formatDateTimeValue(
  value: unknown,
  format: DateTimeFormat = DEFAULT_DATE_TIME_FORMAT,
  customFormat: string = DEFAULT_CUSTOM_DATE_TIME_FORMAT
): string {
  if (!hasExifValue(value)) return ''

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return ''
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    const hour = String(value.getHours()).padStart(2, '0')
    const minute = String(value.getMinutes()).padStart(2, '0')
    const second = String(value.getSeconds()).padStart(2, '0')
    value = `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  const raw = String(value).trim()
  const parts = raw.match(/^(\d{4})[-/.\x3a](\d{2})[-/.\x3a](\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/)
  if (!parts) return raw

  const [, year, month, day, hour, minute, second, offset = ''] = parts
  if (format === 'custom' && customFormat.trim()) {
    const unpad = (part: string | undefined) => part === undefined ? undefined : String(Number(part))
    const tokens: Record<string, string | undefined> = {
      YYYY: year, YY: year!.slice(-2), MM: month, M: unpad(month),
      DD: day, D: unpad(day), HH: hour, H: unpad(hour),
      mm: minute, m: unpad(minute), ss: second, s: unpad(second), Z: offset || undefined
    }
    let missingValue = false
    const formatted = customFormat.trim().replace(/\[([^\]]*)\]|YYYY|YY|MM|DD|HH|mm|ss|M|D|H|m|s|Z/g, (token, literal) => {
      if (literal !== undefined) return literal
      if (tokens[token] === undefined) missingValue = true
      return tokens[token] ?? ''
    })
    // 缺少格式要求的信息时保留原有精度，避免补出不存在的时间。
    return missingValue ? formatDateTimeValue(value) : formatted
  }
  let date = `${year}-${month}-${day}`
  if (format === 'slash') date = `${year}/${month}/${day}`
  if (format === 'dot') date = `${year}.${month}.${day}`
  if (format === 'chinese') date = `${year}年${month}月${day}日`
  if (format === 'date' || hour === undefined) return date

  // 仅改变显示格式；原始信息没有秒数时保留已有精度。
  const seconds = format !== 'minute' && second !== undefined ? `:${second}` : ''
  return `${date} ${hour}:${minute}${seconds}${offset}`
}

export function splitExifDisplayValue(key: 'FocalLength' | 'FNumber' | 'ExposureTime' | 'ISO', value: unknown) {
  const display = formatExifValue(key, value)

  if (key === 'FocalLength' && /mm$/i.test(display)) {
    return { value: display.replace(/mm$/i, ''), unit: 'mm' }
  }

  if (key === 'ExposureTime' && /s$/i.test(display)) {
    return { value: display.replace(/s$/i, ''), unit: 's' }
  }

  if (key === 'ISO') {
    return { value: display.replace(/^ISO\s*/i, ''), unit: 'ISO' }
  }

  return { value: display, unit: '' }
}
