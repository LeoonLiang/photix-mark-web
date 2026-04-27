import { getLogoPath } from '~/utils/logoMapper'

export function withUploadedLogo(
  customLogos: Map<string, string>,
  brand: string,
  dataUrl: string
): Map<string, string> {
  const nextLogos = new Map(customLogos)
  nextLogos.set(brand, dataUrl)
  return nextLogos
}

export function withoutCustomLogo(
  customLogos: Map<string, string>,
  brand: string
): Map<string, string> {
  const nextLogos = new Map(customLogos)
  nextLogos.delete(brand)
  return nextLogos
}

export function buildCustomLogoConfig(
  brand: string | undefined,
  customLogos?: Map<string, string>
): {
  customLogoUrl?: string
  customDefaultLogoUrl?: string
} {
  if (!customLogos) {
    return {}
  }

  return {
    customLogoUrl: brand ? customLogos.get(brand) : undefined,
    customDefaultLogoUrl: customLogos.get('')
  }
}

export function resolveLogoPath(
  brand: string | undefined,
  config?: {
    customLogoUrl?: string
    customDefaultLogoUrl?: string
  }
): string {
  if (brand && config?.customLogoUrl) {
    return config.customLogoUrl
  }

  if (!brand && config?.customDefaultLogoUrl) {
    return config.customDefaultLogoUrl
  }

  return getLogoPath(brand || '')
}
