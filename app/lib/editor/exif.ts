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

export function formatDateTimeValue(value: unknown): string {
  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    const hour = String(value.getHours()).padStart(2, '0')
    const minute = String(value.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  }

  const raw = String(value).trim()
  return raw
    .replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')
    .replace(/:\d{2}$/, '')
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
