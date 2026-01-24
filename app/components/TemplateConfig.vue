<template>
  <div class="space-y-4">
    <!-- 颜色配置 -->
    <div v-if="hasColorConfig">
      <h3 class="text-xs font-semibold text-gray-700 mb-2">颜色</h3>
      <div class="space-y-2">
        <div v-if="hasColor('textColor')">
          <label class="text-xs text-gray-600 block mb-1">文字颜色</label>
          <input
            type="color"
            :value="localConfig.textColor"
            @input="updateConfig('textColor', ($event.target as HTMLInputElement).value)"
            class="w-full h-10 rounded border border-gray-300"
          />
        </div>
        <div v-if="hasColor('backgroundColor')">
          <label class="text-xs text-gray-600 block mb-1">背景颜色</label>
          <input
            type="color"
            :value="localConfig.backgroundColor"
            @input="updateConfig('backgroundColor', ($event.target as HTMLInputElement).value)"
            class="w-full h-10 rounded border border-gray-300"
          />
        </div>
      </div>
    </div>

    <!-- Logo 和 EXIF 信息配置 - 合并 -->
    <div v-if="hasLogoConfig || hasAnyExifField">
      <div class="flex flex-wrap gap-2">
        <!-- Logo 按钮 -->
        <button
          v-if="hasLogoConfig"
          @click="toggleConfig('logoEnabled')"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md border transition-all',
            localConfig.logoEnabled
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
          ]"
        >
          Logo
        </button>

        <!-- EXIF 信息按钮 -->
        <button
          v-if="hasExifField('showBrand')"
          @click="toggleConfig('showBrand')"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md border transition-all',
            localConfig.showBrand
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
          ]"
        >
          品牌
        </button>
        <button
          v-if="hasExifField('showModel')"
          @click="toggleConfig('showModel')"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md border transition-all',
            localConfig.showModel
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
          ]"
        >
          型号
        </button>
        <button
          v-if="hasExifField('showLens')"
          @click="toggleConfig('showLens')"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md border transition-all',
            localConfig.showLens
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
          ]"
        >
          镜头
        </button>
        <button
          v-if="hasExifField('showFocalLength')"
          @click="toggleConfig('showFocalLength')"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md border transition-all',
            localConfig.showFocalLength
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
          ]"
        >
          焦段
        </button>
        <button
          v-if="hasExifField('showAperture')"
          @click="toggleConfig('showAperture')"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md border transition-all',
            localConfig.showAperture
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
          ]"
        >
          光圈
        </button>
        <button
          v-if="hasExifField('showShutter')"
          @click="toggleConfig('showShutter')"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md border transition-all',
            localConfig.showShutter
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
          ]"
        >
          快门
        </button>
        <button
          v-if="hasExifField('showISO')"
          @click="toggleConfig('showISO')"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md border transition-all',
            localConfig.showISO
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
          ]"
        >
          ISO
        </button>
        <button
          v-if="hasExifField('showDateTime')"
          @click="toggleConfig('showDateTime')"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md border transition-all',
            localConfig.showDateTime
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
          ]"
        >
          拍摄时间
        </button>
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

// 切换配置（用于按钮）
function toggleConfig(key: string) {
  updateConfig(key, !localConfig.value[key])
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
