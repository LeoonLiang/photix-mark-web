<template>
  <div class="space-y-4">
    <div class="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 p-4 shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-slate-900">模板参数</p>
          <p class="mt-1 text-xs text-slate-500">只显示当前模板支持的配置项</p>
        </div>
        <button
          @click="resetAll"
          class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          恢复默认
        </button>
      </div>
    </div>

    <section v-if="hasColorConfig" class="config-card">
      <div class="section-head">
        <h3 class="section-title">颜色</h3>
      </div>
      <div class="space-y-3">
        <div v-if="hasColor('textColor')" class="field-row">
          <label class="field-label">文字颜色</label>
          <div class="field-actions">
            <input
              type="color"
              :value="localConfig.textColor"
              @input="updateConfig('textColor', ($event.target as HTMLInputElement).value)"
              class="color-input"
            />
            <button @click="resetField('textColor')" class="reset-chip">重置</button>
          </div>
        </div>
        <div v-if="hasColor('secondaryTextColor')" class="field-row">
          <label class="field-label">辅助文字颜色</label>
          <div class="field-actions">
            <input
              type="color"
              :value="localConfig.secondaryTextColor"
              @input="updateConfig('secondaryTextColor', ($event.target as HTMLInputElement).value)"
              class="color-input"
            />
            <button @click="resetField('secondaryTextColor')" class="reset-chip">重置</button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="hasBackgroundConfig" class="config-card">
      <div class="section-head">
        <h3 class="section-title">背景</h3>
      </div>
      <div class="space-y-3">
        <div v-if="hasBackground('backgroundColor')" class="field-row">
          <label class="field-label">背景色</label>
          <div class="field-actions">
            <input
              type="color"
              :value="localConfig.backgroundColor"
              @input="updateConfig('backgroundColor', ($event.target as HTMLInputElement).value)"
              class="color-input"
            />
            <button @click="resetField('backgroundColor')" class="reset-chip">重置</button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="hasLayoutConfig" class="config-card">
      <div class="section-head">
        <h3 class="section-title">间距</h3>
      </div>
      <div class="space-y-3">
        <div v-if="hasLayout('padding')" class="space-y-2">
          <div class="flex items-center justify-between gap-3">
            <label class="field-label">内边距</label>
            <div class="flex items-center gap-2">
              <span class="value-pill">{{ formatRangeValue(localConfig.padding) }}</span>
              <button @click="resetField('padding')" class="reset-chip">重置</button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="0.08"
            step="0.001"
            :value="localConfig.padding"
            @input="updateConfig('padding', Number(($event.target as HTMLInputElement).value))"
            class="slider-input"
          />
        </div>
      </div>
    </section>

    <section v-if="hasBorderConfig" class="config-card">
      <div class="section-head">
        <h3 class="section-title">边框</h3>
      </div>
      <div class="space-y-3">
        <div v-if="hasBorder('showBorder')" class="toggle-row">
          <span class="field-label">显示边框</span>
          <div class="flex items-center gap-2">
            <button @click="resetField('showBorder')" class="reset-chip">重置</button>
            <button
              @click="updateConfig('showBorder', !localConfig.showBorder)"
              :class="toggleClass(localConfig.showBorder)"
            >
              <span :class="toggleKnobClass(localConfig.showBorder)" />
            </button>
          </div>
        </div>
        <div v-if="hasBorder('borderColor')" class="field-row">
          <label class="field-label">边框颜色</label>
          <div class="field-actions">
            <input
              type="color"
              :value="localConfig.borderColor"
              @input="updateConfig('borderColor', ($event.target as HTMLInputElement).value)"
              class="color-input"
            />
            <button @click="resetField('borderColor')" class="reset-chip">重置</button>
          </div>
        </div>
        <div v-if="hasBorder('borderRadius')" class="space-y-2">
          <div class="flex items-center justify-between gap-3">
            <label class="field-label">圆角</label>
            <div class="flex items-center gap-2">
              <span class="value-pill">{{ formatRangeValue(localConfig.borderRadius) }}</span>
              <button @click="resetField('borderRadius')" class="reset-chip">重置</button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="0.05"
            step="0.001"
            :value="localConfig.borderRadius"
            @input="updateConfig('borderRadius', Number(($event.target as HTMLInputElement).value))"
            class="slider-input"
          />
        </div>
      </div>
    </section>

    <section v-if="hasShadowConfig" class="config-card">
      <div class="section-head">
        <h3 class="section-title">阴影</h3>
      </div>
      <div class="space-y-3">
        <div class="toggle-row">
          <span class="field-label">显示阴影</span>
          <div class="flex items-center gap-2">
            <button @click="resetField('shadowEnabled')" class="reset-chip">重置</button>
            <button
              @click="updateConfig('shadowEnabled', !localConfig.shadowEnabled)"
              :class="toggleClass(localConfig.shadowEnabled)"
            >
              <span :class="toggleKnobClass(localConfig.shadowEnabled)" />
            </button>
          </div>
        </div>
        <div v-if="hasShadow('shadowColor')" class="field-row">
          <label class="field-label">阴影颜色</label>
          <div class="field-actions">
            <input
              type="color"
              :value="shadowColorInputValue"
              @input="updateConfig('shadowColor', ($event.target as HTMLInputElement).value)"
              class="color-input"
            />
            <button @click="resetField('shadowColor')" class="reset-chip">重置</button>
          </div>
        </div>
        <div v-if="hasShadow('shadowRadius')" class="space-y-2">
          <div class="flex items-center justify-between gap-3">
            <label class="field-label">阴影强度</label>
            <div class="flex items-center gap-2">
              <span class="value-pill">{{ formatRangeValue(localConfig.shadowRadius) }}</span>
              <button @click="resetField('shadowRadius')" class="reset-chip">重置</button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="0.05"
            step="0.001"
            :value="localConfig.shadowRadius"
            @input="updateConfig('shadowRadius', Number(($event.target as HTMLInputElement).value))"
            class="slider-input"
          />
        </div>
      </div>
    </section>

    <section v-if="hasBlurConfig" class="config-card">
      <div class="section-head">
        <h3 class="section-title">模糊</h3>
      </div>
      <div class="space-y-3">
        <div v-if="hasBlur('blurRadius')" class="space-y-2">
          <div class="flex items-center justify-between gap-3">
            <label class="field-label">模糊强度</label>
            <div class="flex items-center gap-2">
              <span class="value-pill">{{ formatRangeValue(localConfig.blurRadius) }}</span>
              <button @click="resetField('blurRadius')" class="reset-chip">重置</button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="0.12"
            step="0.001"
            :value="localConfig.blurRadius"
            @input="updateConfig('blurRadius', Number(($event.target as HTMLInputElement).value))"
            class="slider-input"
          />
        </div>
      </div>
    </section>

    <section v-if="hasLogoConfig || hasAnyExifField" class="config-card">
      <div class="section-head">
        <h3 class="section-title">内容</h3>
        <button @click="resetContent" class="reset-chip">重置本组</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-if="hasLogoConfig"
          @click="toggleConfig('logoEnabled')"
          :class="pillClass(localConfig.logoEnabled)"
        >
          Logo
        </button>
        <button
          v-if="hasExifField('showBrand')"
          @click="toggleConfig('showBrand')"
          :class="pillClass(localConfig.showBrand)"
        >
          品牌
        </button>
        <button
          v-if="hasExifField('showModel')"
          @click="toggleConfig('showModel')"
          :class="pillClass(localConfig.showModel)"
        >
          型号
        </button>
        <button
          v-if="hasExifField('showLens')"
          @click="toggleConfig('showLens')"
          :class="pillClass(localConfig.showLens)"
        >
          镜头
        </button>
        <button
          v-if="hasExifField('showFocalLength')"
          @click="toggleConfig('showFocalLength')"
          :class="pillClass(localConfig.showFocalLength)"
        >
          焦段
        </button>
        <button
          v-if="hasExifField('showAperture')"
          @click="toggleConfig('showAperture')"
          :class="pillClass(localConfig.showAperture)"
        >
          光圈
        </button>
        <button
          v-if="hasExifField('showShutter')"
          @click="toggleConfig('showShutter')"
          :class="pillClass(localConfig.showShutter)"
        >
          快门
        </button>
        <button
          v-if="hasExifField('showISO')"
          @click="toggleConfig('showISO')"
          :class="pillClass(localConfig.showISO)"
        >
          ISO
        </button>
        <button
          v-if="hasExifField('showDateTime')"
          @click="toggleConfig('showDateTime')"
          :class="pillClass(localConfig.showDateTime)"
        >
          拍摄时间
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { TemplateConfig } from '~/lib/templates/types'
import { getTemplateDefaultConfig } from '~/lib/templates/userOptions'

const props = defineProps<{
  template: TemplateConfig
  modelValue: Record<string, any>
  exif?: Record<string, any>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const defaults = computed(() => getTemplateDefaultConfig(props.template))

function createLocalConfig() {
  return {
    ...defaults.value,
    ...props.modelValue
  }
}

const localConfig = ref(createLocalConfig())

const hasAnyExifField = computed(() => {
  const exifFields = props.template.userOptions.exifFields
  return !!(exifFields && Object.keys(exifFields).length > 0)
})

const hasLogoConfig = computed(() => {
  const logo = props.template.userOptions.logo
  return logo !== undefined && logo.enabled !== false
})

const hasColorConfig = computed(() => props.template.userOptions.colors !== undefined)
const hasBackgroundConfig = computed(() => props.template.userOptions.background !== undefined)
const hasBorderConfig = computed(() => props.template.userOptions.border !== undefined)
const hasShadowConfig = computed(() => props.template.userOptions.shadow !== undefined)
const hasBlurConfig = computed(() => props.template.userOptions.blur !== undefined)
const hasLayoutConfig = computed(() => props.template.userOptions.layout !== undefined)

const shadowColorInputValue = computed(() => {
  const color = localConfig.value.shadowColor
  if (typeof color === 'string' && color.startsWith('#')) {
    return color
  }
  return '#000000'
})

function hasExifField(field: keyof NonNullable<typeof props.template.userOptions.exifFields>): boolean {
  const exifFields = props.template.userOptions.exifFields
  return !!exifFields && field in exifFields
}

function hasColor(field: keyof NonNullable<typeof props.template.userOptions.colors>): boolean {
  const colors = props.template.userOptions.colors
  return !!colors && field in colors
}

function hasBackground(field: keyof NonNullable<typeof props.template.userOptions.background>): boolean {
  const background = props.template.userOptions.background
  return !!background && field in background
}

function hasBorder(field: keyof NonNullable<typeof props.template.userOptions.border>): boolean {
  const border = props.template.userOptions.border
  return !!border && field in border
}

function hasShadow(field: keyof NonNullable<typeof props.template.userOptions.shadow>): boolean {
  const shadow = props.template.userOptions.shadow
  return !!shadow && field in shadow
}

function hasBlur(field: keyof NonNullable<typeof props.template.userOptions.blur>): boolean {
  const blur = props.template.userOptions.blur
  return !!blur && field in blur
}

function hasLayout(field: keyof NonNullable<typeof props.template.userOptions.layout>): boolean {
  const layout = props.template.userOptions.layout
  return !!layout && field in layout
}

function pushConfig(value: Record<string, any>) {
  localConfig.value = value
  emit('update:modelValue', value)
}

function updateConfig(key: string, value: any) {
  pushConfig({
    ...localConfig.value,
    [key]: value
  })
}

function toggleConfig(key: string) {
  updateConfig(key, !localConfig.value[key])
}

function resetField(key: string) {
  updateConfig(key, defaults.value[key])
}

function resetAll() {
  pushConfig({ ...defaults.value })
}

function resetContent() {
  const nextValue = { ...localConfig.value }
  const keys = [
    'logoEnabled',
    'showBrand',
    'showModel',
    'showLens',
    'showFocalLength',
    'showAperture',
    'showShutter',
    'showISO',
    'showDateTime'
  ]

  for (const key of keys) {
    if (key in defaults.value) {
      nextValue[key] = defaults.value[key]
    }
  }

  pushConfig(nextValue)
}

function formatRangeValue(value: number) {
  return Number(value || 0).toFixed(3)
}

function pillClass(active: boolean) {
  return [
    'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
    active
      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
  ]
}

function toggleClass(active: boolean) {
  return [
    'relative inline-flex h-6 w-11 items-center rounded-full border transition',
    active
      ? 'border-slate-900 bg-slate-900'
      : 'border-slate-300 bg-slate-200'
  ]
}

function toggleKnobClass(active: boolean) {
  return [
    'inline-block h-4 w-4 rounded-full bg-white transition',
    active ? 'translate-x-6' : 'translate-x-1'
  ]
}

watch(() => props.template.id, () => {
  resetAll()
})

watch(() => props.modelValue, (value) => {
  localConfig.value = {
    ...defaults.value,
    ...value
  }
}, { deep: true })
</script>

<style scoped>
.config-card {
  @apply rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-200/60;
}

.section-head {
  @apply mb-3 flex items-center justify-between gap-3;
}

.section-title {
  @apply text-sm font-semibold text-slate-900;
}

.field-row {
  @apply flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-2.5;
}

.toggle-row {
  @apply flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3;
}

.field-label {
  @apply text-sm font-medium text-slate-700;
}

.field-actions {
  @apply flex items-center gap-2;
}

.color-input {
  @apply h-10 w-16 cursor-pointer rounded-xl border border-slate-200 bg-white p-1;
}

.reset-chip {
  @apply rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-900;
}

.value-pill {
  @apply rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600;
}

.slider-input {
  @apply h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200;
}

.slider-input::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #0f172a;
  border: 2px solid white;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.2);
}

.slider-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #0f172a;
  border: 2px solid white;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.2);
}
</style>
