function normalizeFormats(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return [...new Set(value
    .filter((format): format is string => typeof format === 'string')
    .map(format => format.trim())
    .filter(format => format.length > 0 && format.length <= 120))]
}

export function parseSavedDateTimeFormats(value: string | null): string[] {
  try {
    return normalizeFormats(JSON.parse(value ?? '[]'))
  } catch {
    return []
  }
}

export function addSavedDateTimeFormat(formats: string[], format: string): string[] {
  return normalizeFormats([...formats, format])
}
