<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/utils/cn'

interface Props {
  value?: number
  max?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100
})

const percentage = computed(() => {
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})
</script>

<template>
  <div :class="cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', props.class)">
    <div
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="{ transform: `translateX(-${100 - percentage}%)` }"
    />
  </div>
</template>
