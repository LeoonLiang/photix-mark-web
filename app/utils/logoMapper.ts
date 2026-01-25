/**
 * Logo 映射工具
 * 根据相机品牌自动选择对应的 logo
 */

/**
 * 品牌到 logo 文件的映射
 */
const BRAND_LOGO_MAP: Record<string, string> = {
  'NIKON': '/logos/nikon.png',
  'NIKON CORPORATION': '/logos/nikon.png',
  'CANON': '/logos/canon.png',
  'Canon': '/logos/canon.png',
  'SONY': '/logos/sony.png',
  'Sony': '/logos/sony.png',
  'FUJIFILM': '/logos/fujifilm.png',
  'FUJI': '/logos/fujifilm.png',
  'OLYMPUS': '/logos/olympus_white_gold.png',
  'OLYMPUS CORPORATION': '/logos/olympus_white_gold.png',
  'PANASONIC': '/logos/panasonic.png',
  'Panasonic': '/logos/panasonic.png',
  'LEICA': '/logos/leica_logo.png',
  'Leica': '/logos/leica_logo.png',
  'PENTAX': '/logos/pentax.png',
  'RICOH': '/logos/ricoh.png',
  'HASSELBLAD': '/logos/hasselblad.png',
  'DJI': '/logos/DJI.png',
  'APPLE': '/logos/apple.png',
  'Apple': '/logos/apple.png',
  'HUAWEI': '/logos/xmage.png'
}

/**
 * 根据相机品牌获取 logo 路径
 * @param make 相机制造商 (EXIF Make 字段)
 * @returns logo 文件路径
 */
export function getLogoPath(make: string | undefined): string {
  if (!make) {
    return '/logos/default.png'
  }

  // 尝试直接匹配
  if (BRAND_LOGO_MAP[make]) {
    return BRAND_LOGO_MAP[make]
  }

  // 尝试部分匹配（处理 "NIKON CORPORATION" 这种情况）
  const makeUpper = make.toUpperCase()
  for (const [brand, logoPath] of Object.entries(BRAND_LOGO_MAP)) {
    if (makeUpper.includes(brand.toUpperCase())) {
      return logoPath
    }
  }

  // 默认 logo
  return '/logos/default.png'
}

/**
 * 从 EXIF 数据中提取 logo 路径
 * @param exif EXIF 数据对象
 * @returns logo 文件路径
 */
export function extractLogoFromExif(exif: Record<string, any>): string {
  return getLogoPath(exif.Make)
}
