<template>
  <div class="space-y-4">
    <!-- EXIF 字段配置 -->
    <div v-if="hasAnyExifField">
      <h3 class="text-sm font-medium text-gray-700 mb-2">EXIF 信息显示</h3>
      <div class="space-y-2">
        <label v-if="hasExifField('showBrand')" class="flex items-center text-sm">
          <input
            type="checkbox"
            :checked="localConfig.showBrand"
            @change="updateConfig('showBrand', ($event.target as HTMLInputElement).checked)"
            class="mr-2 rounded"
          />
          <span>显示品牌</span>
        </label>
        <label v-if="hasExifField('showModel')" class="flex items-center text-sm">
          <input
            type="checkbox"
            :checked="localConfig.showModel"
            @change="updateConfig('showModel', ($event.target as HTMLInputElement).checked)"
            class="mr-2 rounded"
          />
          <span>显示型号</span>
        </label>
        <label v-if="hasExifField('showLens')" class="flex items-center text-sm">
          <input
            type="checkbox"
            :checked="localConfig.showLens"
            @change="updateConfig('showLens', ($event.target as HTMLInputElement).checked)"
            class="mr-2 rounded"
          />
          <span>显示镜头</span>
        </label>
        <label v-if="hasExifField('showFocalLength')" class="flex items-center text-sm">
          <input
            type="checkbox"
            :checked="localConfig.showFocalLength"
            @change="updateConfig('showFocalLength', ($event.target as HTMLInputElement).checked)"
            class="mr-2 rounded"
          />
          <span>显示焦距</span>
        </label>
        <label v-if="hasExifField('showAperture')" class="flex items-center text-sm">
          <input
            type="checkbox"
            :checked="localConfig.showAperture"
            @change="updateConfig('showAperture', ($event.target as HTMLInputElement).checked)"
            class="mr-2 rounded"
          />
          <span>显示光圈</span>
        </label>
        <label v-if="hasExifField('showShutter')" class="flex items-center text-sm">
          <input
            type="checkbox"
            :checked="localConfig.showShutter"
            @change="updateConfig('showShutter', ($event.target as HTMLInputElement).checked)"
            class="mr-2 rounded"
          />
          <span>显示快门</span>
        </label>
        <label v-if="hasExifField('showISO')" class="flex items-center text-sm">
          <input
            type="checkbox"
            :checked="localConfig.showISO"
            @change="updateConfig('showISO', ($event.target as HTMLInputElement).checked)"
            class="mr-2 rounded"
          />
          <span>显示 ISO</span>
        </label>
        <label v-if="hasExifField('showDateTime')" class="flex items-center text-sm">
          <input
            type="checkbox"
            :checked="localConfig.showDateTime"
            @change="updateConfig('showDateTime', ($event.target as HTMLInputElement).checked)"
            class="mr-2 rounded"
          />
          <span>显示拍摄时间</span>
        </label>
      </div>
    </div>

    <!-- Logo 配置 -->
    <div v-if="hasLogoConfig">
      <h3 class="text-sm font-medium text-gray-700 mb-2">Logo 设置</h3>
      <label class="flex items-center text-sm mb-2">
        <input
          type="checkbox"
          :checked="localConfig.logoEnabled"
          @change="updateConfig('logoEnabled', ($event.target as HTMLInputElement).checked)"
          class="mr-2 rounded"
        />
        <span>显示 Logo</span>
      </label>
    </div>

    <!-- 颜色配置 -->
    <div v-if="hasColorConfig">
      <h3 class="text-sm font-medium text-gray-700 mb-2">颜色设置</h3>
      <div class="space-y-2">
        <div v-if="hasColor('textColor')">
          <label class="text-xs text-gray-600">文字颜色</label>
          <input
            type="color"
            :value="localConfig.textColor"
            @input="updateConfig('textColor', ($event.target as HTMLInputElement).value)"
            class="w-full h-10 rounded border border-gray-300"
          />
        </div>
        <div v-if="hasColor('backgroundColor')">
          <label class="text-xs text-gray-600">背景颜色</label>
          <input
            type="color"
            :value="localConfig.backgroundColor"
            @input="updateConfig('backgroundColor', ($event.target as HTMLInputElement).value)"
            class="w-full h-10 rounded border border-gray-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { TemplateConfig } from '~/lib/templates/types'

const props = defineProps<{
  template: TemplateConfig
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

// 本地配置状态
const localConfig = ref({
  showBrand: props.template.userOptions.exifFields?.showBrand ?? true,
  showModel: props.template.userOptions.exifFields?.showModel ?? true,
  showLens: props.template.userOptions.exifFields?.showLens ?? true,
  showFocalLength: props.template.userOptions.exifFields?.showFocalLength ?? true,
  showAperture: props.template.userOptions.exifFields?.showAperture ?? true,
  showShutter: props.template.userOptions.exifFields?.showShutter ?? true,
  showISO: props.template.userOptions.exifFields?.showISO ?? true,
  showDateTime: props.template.userOptions.exifFields?.showDateTime ?? true,
  logoEnabled: props.template.userOptions.logo?.enabled ?? true,
  logoPosition: props.template.userOptions.logo?.position ?? 'left',
  textColor: props.template.userOptions.colors?.textColor ?? '#242424',
  backgroundColor: props.template.userOptions.colors?.backgroundColor ?? '#FFFFFF',
  ...props.modelValue
})

// 检查是否有某个EXIF字段
function hasExifField(field: keyof NonNullable<typeof props.template.userOptions.exifFields>): boolean {
  const exifFields = props.template.userOptions.exifFields
  if (!exifFields) return false

  // 如果字段在配置中存在，就显示该配置项
  return field in exifFields
}

// 检查是否有任何EXIF字段
const hasAnyExifField = computed(() => {
  const exifFields = props.template.userOptions.exifFields
  return exifFields && Object.keys(exifFields).length > 0
})

// 检查是否有Logo配置
const hasLogoConfig = computed(() => {
  const logo = props.template.userOptions.logo
  // 只有当 logo.enabled 不是 false 时才显示logo配置
  // enabled 为 false 表示模板不支持logo，应该隐藏
  return logo !== undefined && logo.enabled !== false
})

// 检查是否有颜色配置
const hasColorConfig = computed(() => {
  return props.template.userOptions.colors !== undefined
})

// 检查是否有某个颜色配置
function hasColor(field: keyof NonNullable<typeof props.template.userOptions.colors>): boolean {
  const colors = props.template.userOptions.colors
  if (!colors) return false
  return field in colors
}

// 更新配置
function updateConfig(key: string, value: any) {
  localConfig.value = {
    ...localConfig.value,
    [key]: value
  }
  // 立即触发更新
  emit('update:modelValue', localConfig.value)
}

// 监听模板变化，重置配置
watch(() => props.template.id, () => {
  localConfig.value = {
    showBrand: props.template.userOptions.exifFields?.showBrand ?? true,
    showModel: props.template.userOptions.exifFields?.showModel ?? true,
    showLens: props.template.userOptions.exifFields?.showLens ?? true,
    showFocalLength: props.template.userOptions.exifFields?.showFocalLength ?? true,
    showAperture: props.template.userOptions.exifFields?.showAperture ?? true,
    showShutter: props.template.userOptions.exifFields?.showShutter ?? true,
    showISO: props.template.userOptions.exifFields?.showISO ?? true,
    showDateTime: props.template.userOptions.exifFields?.showDateTime ?? true,
    logoEnabled: props.template.userOptions.logo?.enabled ?? true,
    logoPosition: props.template.userOptions.logo?.position ?? 'left',
    textColor: props.template.userOptions.colors?.textColor ?? '#242424',
    backgroundColor: props.template.userOptions.colors?.backgroundColor ?? '#FFFFFF'
  }
  emit('update:modelValue', localConfig.value)
})
</script>
