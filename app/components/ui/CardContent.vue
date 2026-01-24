<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <p :class="cn('p-6 pt-0', props.class)">
    <slot />
  </p>
</template>
