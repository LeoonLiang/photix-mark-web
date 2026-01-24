<template>
  <div class="space-y-2">
    <button
      v-for="template in templates"
      :key="template.id"
      @click="$emit('select', template.id)"
      :class="[
        'w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200',
        selectedId === template.id
          ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
          : 'border-border hover:border-primary/50 hover:bg-accent'
      ]"
    >
      <div class="flex items-center">
        <div
          :class="[
            'w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0',
            selectedId === template.id
              ? 'border-primary bg-primary'
              : 'border-input'
          ]"
        >
          <div
            v-if="selectedId === template.id"
            class="w-2 h-2 bg-primary-foreground rounded-full"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-medium text-foreground">{{ template.name }}</div>
          <div class="text-xs text-muted-foreground truncate">{{ template.description }}</div>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TemplateConfig } from '~/lib/templates/types'

defineProps<{
  templates: TemplateConfig[]
  selectedId: string
}>()

defineEmits<{
  select: [id: string]
}>()
</script>
