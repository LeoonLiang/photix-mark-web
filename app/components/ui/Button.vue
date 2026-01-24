<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { buttonVariants } from './button-variants'
import { cn } from '@/utils/cn'

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  as?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'default',
  size: 'default'
})

const delegatedProps = computed(() => {
  const { class: _, variant, size, ...delegated } = props
  return delegated
})
</script>

<template>
  <component
    :is="as"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </component>
</template>
