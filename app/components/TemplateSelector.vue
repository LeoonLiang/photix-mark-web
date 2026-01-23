<template>
  <div class="space-y-2">
    <button
      v-for="template in templates"
      :key="template.id"
      @click="$emit('select', template.id)"
      :class="[
        'w-full text-left px-4 py-3 rounded-lg border transition-all',
        selectedId === template.id
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
      ]"
    >
      <div class="flex items-center">
        <div
          :class="[
            'w-4 h-4 rounded-full border-2 mr-3',
            selectedId === template.id
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300'
          ]"
        >
          <div
            v-if="selectedId === template.id"
            class="w-full h-full flex items-center justify-center"
          >
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <div>
          <div class="font-medium">{{ template.name }}</div>
          <div class="text-xs text-gray-500">{{ template.description }}</div>
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
