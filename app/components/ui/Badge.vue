<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { badgeVariants } from './badge-variants'
import { cn } from '@/utils/cn'

interface Props {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </div>
</template>
