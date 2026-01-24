<template>
  <div class="overflow-x-auto -mx-1 px-1">
    <div class="flex gap-2 pb-2 pt-2">
      <button
        v-for="template in templates"
        :key="template.id"
        @click="$emit('select', template.id)"
        :class="[
          'flex-shrink-0 rounded-lg transition-all duration-200 overflow-hidden',
          selectedId === template.id
            ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
            : 'hover:ring-2 hover:ring-primary/30',
          template.id === 'noProcess' ? 'w-[80px]' : 'w-[80px] lg:w-[120px]'
        ]"
      >
        <!-- 图片预览 -->
        <div v-if="getTemplateImage(template.id)" class="relative bg-gray-100 leading-[0]">
          <img
            :src="getTemplateImage(template.id)"
            :alt="template.name"
            class="w-full h-auto block"
          />
          <!-- 选中指示器 -->
          <div
            v-if="selectedId === template.id"
            class="absolute inset-0 bg-primary/20 flex items-center justify-center"
          >
            <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 不处理选项 -->
        <div v-else class="bg-gray-50 flex flex-col items-center justify-center py-2 px-2 min-h-[55px]">
          <svg class="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <span class="text-[10px] lg:text-xs text-gray-600 font-medium text-center mt-1 hidden lg:block">不处理</span>
        </div>
      </button>
    </div>
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

// 模板图片映射
const templateImages: Record<string, string> = {
  'standard1': '/demo/4_标准水印.JPG',
  'standard2': '/demo/3_标准水印2.JPG',
  'logoCentered': '/demo/2_logo居中.JPG',
  'blurBackground': '/demo/1_背景模糊.JPG',
  'nikonBlur': '/demo/6_尼康专用背景模糊.JPG',
  'folderNameParams': '/demo/5_时间戳参数.JPG'
}

function getTemplateImage(templateId: string): string | null {
  return templateImages[templateId] || null
}
</script>
