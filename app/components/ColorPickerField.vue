<template>
  <button
    ref="triggerRef"
    type="button"
    class="color-picker-trigger"
    :disabled="disabled"
    :aria-label="label ? `${label}颜色选择器` : '颜色选择器'"
  >
    <span class="color-picker-chip" :style="{ backgroundColor: swatchColor }" />
    <span class="color-picker-value">{{ displayValue }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type Pickr from '@simonwep/pickr'
import '@simonwep/pickr/dist/themes/nano.min.css'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  disabled?: boolean
}>(), {
  modelValue: '#000000',
  label: '',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const triggerRef = ref<HTMLElement | null>(null)
const pickrRef = ref<Pickr | null>(null)
const lastEmittedColor = ref(normalizeColor(props.modelValue))

const displayValue = computed(() => normalizeColor(props.modelValue).toUpperCase())
const swatchColor = computed(() => normalizeColor(props.modelValue))

function normalizeColor(value?: string) {
  const trimmed = value?.trim()
  if (!trimmed) return '#000000'
  return trimmed
}

function componentToHex(value: number) {
  return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')
}

function colorToHex(color: NonNullable<ReturnType<Pickr['getColor']>>) {
  const [red, green, blue] = color.toRGBA()
  return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`
}

async function createPickr() {
  if (!triggerRef.value) return

  const { default: PickrConstructor } = await import('@simonwep/pickr')

  const pickr = PickrConstructor.create({
    el: triggerRef.value,
    theme: 'nano',
    useAsButton: true,
    closeOnScroll: true,
    autoReposition: true,
    padding: 8,
    comparison: false,
    lockOpacity: true,
    default: normalizeColor(props.modelValue),
    defaultRepresentation: 'HEXA',
    appClass: 'photix-pickr-app',
    position: 'bottom-middle',
    swatches: [
      '#FFFFFF',
      '#F8FAFC',
      '#E2E8F0',
      '#CBD5E1',
      '#64748B',
      '#0F172A',
      '#EF4444',
      '#F59E0B',
      '#10B981',
      '#3B82F6'
    ],
    components: {
      preview: true,
      opacity: false,
      hue: true,
      interaction: {
        hex: true,
        rgba: false,
        hsla: false,
        hsva: false,
        cmyk: false,
        input: true,
        clear: false,
        save: false,
        cancel: false
      }
    },
    i18n: {
      'btn:toggle': '切换颜色选择器',
      'btn:swatch': '颜色样本',
      'btn:last-color': '使用上一个颜色',
      'aria:input': '颜色输入框',
      'aria:palette': '颜色选择区域',
      'aria:hue': '色相滑块'
    }
  })

  pickr
    .on('change', (color: ReturnType<Pickr['getColor']>) => {
      if (!color) return
      const nextColor = colorToHex(color)
      lastEmittedColor.value = nextColor
      emit('update:modelValue', nextColor)
    })
    .on('hide', () => {
      if (pickr.getColor()) {
        pickr.setColor(lastEmittedColor.value, true)
      }
    })

  pickrRef.value = pickr
}

watch(() => props.modelValue, (value) => {
  const nextColor = normalizeColor(value)
  lastEmittedColor.value = nextColor

  if (pickrRef.value && pickrRef.value.getColor()) {
    pickrRef.value.setColor(nextColor, true)
  }
})

watch(() => props.disabled, (disabled) => {
  if (!pickrRef.value) return
  if (disabled) {
    pickrRef.value.disable()
  } else {
    pickrRef.value.enable()
  }
})

onMounted(async () => {
  await createPickr()

  if (props.disabled) {
    pickrRef.value?.disable()
  }
})

onBeforeUnmount(() => {
  pickrRef.value?.destroyAndRemove()
  pickrRef.value = null
})
</script>

<style scoped>
.color-picker-trigger {
  @apply inline-flex h-8 min-w-[92px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-left transition hover:border-slate-300 sm:h-10 sm:min-w-[124px] sm:rounded-xl sm:px-3;
}

.color-picker-trigger:disabled {
  @apply cursor-not-allowed opacity-60;
}

.color-picker-chip {
  @apply h-4 w-4 shrink-0 rounded-full border border-slate-200 shadow-inner sm:h-5 sm:w-5;
}

.color-picker-value {
  @apply truncate text-[11px] font-medium uppercase tracking-[0.04em] text-slate-600 sm:text-xs;
}
</style>

<style>
.photix-pickr-app {
  z-index: 80;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
}

.photix-pickr-app .pcr-interaction {
  gap: 8px;
}

.photix-pickr-app .pcr-result {
  border-radius: 10px;
  border: 1px solid rgba(203, 213, 225, 0.9);
  box-shadow: none;
}

.photix-pickr-app .pcr-swatches {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.photix-pickr-app .pcr-swatches button {
  width: 100%;
  border-radius: 9999px;
}

@media (max-width: 640px) {
  .photix-pickr-app {
    position: fixed !important;
    top: auto !important;
    right: 12px !important;
    bottom: 12px !important;
    left: 12px !important;
    width: auto !important;
    max-width: none !important;
    border-radius: 20px;
  }

  .photix-pickr-app .pcr-selection .pcr-color-preview,
  .photix-pickr-app .pcr-selection .pcr-last-color {
    border-radius: 14px;
  }
}
</style>
