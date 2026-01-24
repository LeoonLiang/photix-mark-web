<template>
  <div class="h-full flex flex-col">
    <!-- Mode Switcher -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold">预览区</h2>
        <Badge v-if="isProcessing" variant="secondary" class="animate-pulse">
          <svg class="animate-spin w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          处理中
        </Badge>
      </div>
      <div class="flex gap-2">
        <Button
          @click="$emit('update:preview-mode', 'grid')"
          :variant="previewMode === 'grid' ? 'default' : 'outline'"
          size="sm"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          批量预览
        </Button>
        <Button
          @click="$emit('update:preview-mode', 'carousel')"
          :variant="previewMode === 'carousel' ? 'default' : 'outline'"
          size="sm"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          轮播预览
        </Button>
      </div>
    </div>

    <!-- Preview Content -->
    <div class="flex-1 overflow-hidden">
      <div v-if="files.length === 0" class="h-full flex items-center justify-center">
        <div class="text-center text-muted-foreground">
          <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-lg font-medium">请先上传图片</p>
          <p class="text-sm mt-1">支持批量上传和拖拽</p>
        </div>
      </div>

      <!-- Grid View -->
      <div
        v-else-if="previewMode === 'grid'"
        class="h-full overflow-y-auto"
      >
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="(file, index) in files"
            :key="index"
            @click="selectImage(index)"
            class="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary hover:shadow-lg transition-all relative group"
          >
            <img
              v-if="previewUrls.get(file)"
              :src="previewUrls.get(file)"
              :alt="file.name"
              class="w-full h-full object-contain bg-gray-100"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="animate-spin w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="text-white text-sm font-medium">点击查看</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel View -->
      <div
        v-else
        class="h-full flex flex-col"
      >
        <!-- 图片容器 - 使用 flex-1 并限制最小高度为 0 -->
        <div class="flex-1 min-h-0 flex items-center justify-center w-full p-2">
          <img
            v-if="previewUrls.get(files[currentIndex])"
            :src="previewUrls.get(files[currentIndex])"
            :alt="files[currentIndex].name"
            class="max-w-full object-contain rounded-lg shadow-2xl"
            style="max-height: calc(100vh - 240px);"
          />
          <div v-else class="flex items-center justify-center">
            <svg class="animate-spin w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>

        <!-- Navigation - 固定高度 -->
        <div class="flex-shrink-0 flex items-center gap-4 py-3 px-4 border-t bg-slate-50/50">
          <Button
            @click="prevImage"
            :disabled="currentIndex === 0"
            variant="outline"
            size="icon"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div class="text-sm text-muted-foreground font-medium flex-1 text-center">
            <span class="text-foreground font-semibold">{{ currentIndex + 1 }}</span> / {{ files.length }}
            <span class="text-xs block mt-0.5 truncate">{{ files[currentIndex]?.name }}</span>
          </div>
          <Button
            @click="nextImage"
            :disabled="currentIndex === files.length - 1"
            variant="outline"
            size="icon"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import { useWatermarkPreview } from '~/composables/useWatermarkPreview'

const props = defineProps<{
  files: File[]
  currentIndex: number
  previewMode: 'grid' | 'carousel'
  processors?: any[]
  userConfig?: Record<string, any>
}>()

const emit = defineEmits<{
  'update:current-index': [index: number]
  'update:preview-mode': [mode: 'grid' | 'carousel']
}>()

// 预览 URL 缓存
const previewUrls = ref<Map<File, string>>(new Map())
const isProcessing = ref(false)
const { generatePreview, clearCache } = useWatermarkPreview()

// 生成预览 URL（带水印）
async function generatePreviewUrl(file: File): Promise<string> {
  // 如果没有处理器配置，返回原图
  if (!props.processors || props.processors.length === 0) {
    return URL.createObjectURL(file)
  }

  try {
    isProcessing.value = true
    const previewUrl = await generatePreview(
      file,
      props.processors,
      props.userConfig || {}
    )
    return previewUrl
  } catch (error) {
    console.error('Failed to generate preview:', error)
    return URL.createObjectURL(file)
  } finally {
    isProcessing.value = false
  }
}

// 防抖的预览更新函数
const updatePreviews = useDebounceFn(async () => {
  isProcessing.value = true

  for (const file of props.files) {
    const url = await generatePreviewUrl(file)
    previewUrls.value.set(file, url)
  }

  isProcessing.value = false
}, 300)

// 监听文件列表变化
watch(() => props.files, async (newFiles) => {
  // 清理不再使用的预览
  const currentFiles = new Set(newFiles)
  previewUrls.value.forEach((_, file) => {
    if (!currentFiles.has(file)) {
      const url = previewUrls.value.get(file)
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
      previewUrls.value.delete(file)
    }
  })

  // 为新文件生成预览
  await updatePreviews()
}, { immediate: true })

// 监听处理器或配置变化，重新生成预览
watch([() => props.processors, () => props.userConfig], () => {
  // 清除所有缓存
  previewUrls.value.clear()
  clearCache()

  // 重新生成预览
  updatePreviews()
}, { deep: true })

function selectImage(index: number) {
  emit('update:current-index', index)
  emit('update:preview-mode', 'carousel')
}

function prevImage() {
  if (props.currentIndex > 0) {
    emit('update:current-index', props.currentIndex - 1)
  }
}

function nextImage() {
  if (props.currentIndex < props.files.length - 1) {
    emit('update:current-index', props.currentIndex + 1)
  }
}

// 清理 URL
onUnmounted(() => {
  previewUrls.value.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
  clearCache()
})
</script>
