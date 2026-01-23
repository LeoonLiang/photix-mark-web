<template>
  <div class="space-y-4">
    <!-- EXIF 字段配置 -->
    <div>
      <h3 class="text-sm font-medium text-gray-700 mb-2">EXIF 信息显示</h3>
      <div class="space-y-2">
        <label class="flex items-center text-sm">
          <input
            type="checkbox"
            v-model="config.showCamera"
            class="mr-2 rounded"
          />
          <span>显示相机型号</span>
        </label>
        <label class="flex items-center text-sm">
          <input
            type="checkbox"
            v-model="config.showLens"
            class="mr-2 rounded"
          />
          <span>显示镜头</span>
        </label>
        <label class="flex items-center text-sm">
          <input
            type="checkbox"
            v-model="config.showFocalLength"
            class="mr-2 rounded"
          />
          <span>显示焦距</span>
        </label>
        <label class="flex items-center text-sm">
          <input
            type="checkbox"
            v-model="config.showAperture"
            class="mr-2 rounded"
          />
          <span>显示光圈</span>
        </label>
        <label class="flex items-center text-sm">
          <input
            type="checkbox"
            v-model="config.showShutter"
            class="mr-2 rounded"
          />
          <span>显示快门</span>
        </label>
        <label class="flex items-center text-sm">
          <input
            type="checkbox"
            v-model="config.showISO"
            class="mr-2 rounded"
          />
          <span>显示 ISO</span>
        </label>
        <label class="flex items-center text-sm">
          <input
            type="checkbox"
            v-model="config.showDateTime"
            class="mr-2 rounded"
          />
          <span>显示拍摄时间</span>
        </label>
      </div>
    </div>

    <!-- Logo 配置 -->
    <div>
      <h3 class="text-sm font-medium text-gray-700 mb-2">Logo 设置</h3>
      <label class="flex items-center text-sm mb-2">
        <input
          type="checkbox"
          v-model="config.logoEnabled"
          class="mr-2 rounded"
        />
        <span>显示 Logo</span>
      </label>
      <select
        v-if="config.logoEnabled"
        v-model="config.logoPosition"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      >
        <option value="right-bottom">右下角</option>
        <option value="right-top">右上角</option>
        <option value="left-bottom">左下角</option>
        <option value="left-top">左上角</option>
      </select>
    </div>

    <!-- 颜色配置 -->
    <div>
      <h3 class="text-sm font-medium text-gray-700 mb-2">颜色设置</h3>
      <div class="space-y-2">
        <div>
          <label class="text-xs text-gray-600">文字颜色</label>
          <input
            type="color"
            v-model="config.textColor"
            class="w-full h-10 rounded border border-gray-300"
          />
        </div>
        <div>
          <label class="text-xs text-gray-600">背景颜色</label>
          <input
            type="color"
            v-model="config.backgroundColor"
            class="w-full h-10 rounded border border-gray-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TemplateConfig } from '~/lib/templates/types'

const props = defineProps<{
  template: TemplateConfig
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const config = computed({
  get: () => ({
    showCamera: props.template.userOptions.exifFields?.showCamera ?? true,
    showLens: props.template.userOptions.exifFields?.showLens ?? true,
    showFocalLength: props.template.userOptions.exifFields?.showFocalLength ?? true,
    showAperture: props.template.userOptions.exifFields?.showAperture ?? true,
    showShutter: props.template.userOptions.exifFields?.showShutter ?? true,
    showISO: props.template.userOptions.exifFields?.showISO ?? true,
    showDateTime: props.template.userOptions.exifFields?.showDateTime ?? true,
    logoEnabled: props.template.userOptions.logo?.enabled ?? true,
    logoPosition: props.template.userOptions.logo?.position ?? 'right-bottom',
    textColor: props.template.userOptions.colors?.textColor ?? '#242424',
    backgroundColor: props.template.userOptions.colors?.backgroundColor ?? '#FFFFFF',
    ...props.modelValue
  }),
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>
