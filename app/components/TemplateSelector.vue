<template>
  <div>
    <!-- 桌面端：网格布局 -->
    <div class="hidden lg:grid grid-cols-3 gap-3 py-2">
      <button
        v-for="template in templates"
        :key="template.id"
        @click="$emit('select', template.id)"
        :class="[
          'rounded-lg transition-all duration-200 overflow-hidden w-full border-2',
          selectedId === template.id
            ? 'border-primary shadow-lg'
            : 'border-transparent hover:border-primary/50',
        ]"
      >
        <!-- 图片预览 -->
        <div v-if="getTemplateImage(template.id)" class="relative bg-secondary leading-[0]">
          <img
            :src="getTemplateImage(template.id)"
            :alt="template.name"
            class="w-full h-auto block aspect-[3/2] object-cover"
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
        <div v-else class="bg-secondary flex flex-col items-center justify-center aspect-[3/2]">
          <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        <!-- 模板名称 -->
        <div class="text-center text-xs py-1.5 bg-card/50">
          <span class="font-medium text-muted-foreground">{{ template.name }}</span>
        </div>
      </button>
    </div>

    <!-- 移动端：横向滚动小卡片 -->
    <div class="lg:hidden overflow-x-auto scrollbar-hide smooth-scroll">
      <div class="flex gap-3 px-3 py-2">
        <button
          v-for="template in templates"
          :key="template.id"
          @click="$emit('select', template.id)"
          :class="[
            'rounded-lg transition-all duration-200 overflow-hidden flex-shrink-0',
            selectedId === template.id
              ? 'ring-2 ring-primary shadow-md'
              : 'opacity-70',
          ]"
          style="width: 90px;"
        >
          <!-- 图片预览 -->
          <div v-if="getTemplateImage(template.id)" class="relative bg-secondary leading-[0]">
            <img
              :src="getTemplateImage(template.id)"
              :alt="template.name"
              class="w-full h-auto block aspect-[3/2] object-cover"
            />
            <!-- 选中指示器 -->
            <div
              v-if="selectedId === template.id"
              class="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-md"
            >
              <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <!-- 不处理选项 -->
          <div v-else class="bg-secondary flex flex-col items-center justify-center aspect-[3/2]">
            <svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>

          <!-- 模板名称 -->
          <div class="text-center text-[10px] py-1 bg-card/50">
            <span class="font-medium text-muted-foreground">{{ template.name }}</span>
          </div>
        </button>
      </div>
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
