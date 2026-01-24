<template>
  <div class="h-full flex flex-col" style="box-sizing: border-box;">
    <!-- Main Image - flex-1 takes remaining space -->
    <div
      class="flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden"
      :style="{
        flex: files.length > 1 ? '1 1 0' : '1 1 auto',
        minHeight: 0
      }"
    >
      <img
        v-if="currentPreviewUrl"
        :src="currentPreviewUrl"
        :alt="files[currentIndex]?.name"
        style="max-height: 100%; max-width: 100%; height: auto; width: auto; object-fit: contain;"
      />
      <div v-else class="flex flex-col items-center justify-center">
        <svg class="animate-spin w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p class="text-gray-500">处理中...</p>
      </div>
    </div>

    <!-- Thumbnails Carousel - 固定148px总高度(16px padding + 96px thumbnails + 8px gap + 28px info) -->
    <div v-if="files.length > 1" class="border-t" style="height: 148px; flex-shrink: 0; padding-top: 16px;">
      <div class="flex items-center gap-2" style="height: 96px;">
        <!-- Previous Button -->
        <button
          @click="prevImage"
          :disabled="currentIndex === 0"
          class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Thumbnail List -->
        <div class="flex-1 overflow-x-auto h-full">
          <div class="flex gap-2 h-full">
            <div
              v-for="(file, index) in files"
              :key="index"
              @click="selectImage(index)"
              :class="[
                'relative h-20 w-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0',
                currentIndex === index
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-transparent hover:border-gray-300'
              ]"
            >
              <img
                v-if="getThumbnailUrl(file)"
                :src="getThumbnailUrl(file)"
                :alt="file.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                <svg class="animate-spin w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <!-- Current indicator -->
              <div v-if="currentIndex === index" class="absolute top-1 right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">
                当前
              </div>
            </div>
          </div>
        </div>

        <!-- Next Button -->
        <button
          @click="nextImage"
          :disabled="currentIndex === files.length - 1"
          class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Image Info - 固定高度 -->
      <div class="text-center text-sm text-gray-500" style="height: 28px; margin-top: 8px;">
        <span class="font-medium text-gray-700">{{ currentIndex + 1 }}</span> / {{ files.length }}
        <span class="ml-2 text-xs truncate inline-block max-w-xs">{{ files[currentIndex]?.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useWatermarkPreview } from '~/composables/useWatermarkPreview'

const props = defineProps<{
  files: File[]
  currentIndex: number
  processors?: any[]
  userConfig?: Record<string, any>
  previewUrls?: Map<File, string>
}>()

const emit = defineEmits<{
  'update:current-index': [index: number]
}>()

// 预览缓存
const originalUrls = ref<Map<File, string>>(new Map())
const processedUrls = ref<Map<File, string>>(new Map())
const { generatePreview, clearCache } = useWatermarkPreview()

// 为所有文件生成原图缩略图
function generateThumbnails() {
  for (const file of props.files) {
    if (!originalUrls.value.has(file)) {
      const url = URL.createObjectURL(file)
      originalUrls.value.set(file, url)
    }
  }
}

// 生成当前图片的处理预览
const updateCurrentPreview = useDebounceFn(async () => {
  const currentFile = props.files[props.currentIndex]
  if (!currentFile) return

  // 如果没有处理器，使用原图
  if (!props.processors || props.processors.length === 0) {
    return
  }

  // 如果父组件已有预览URL，不需要重新处理
  if (props.previewUrls && props.previewUrls.has(currentFile)) {
    return
  }

  // 检查是否已有本地缓存，避免重复处理
  if (processedUrls.value.has(currentFile)) {
    return
  }

  try {
    const previewUrl = await generatePreview(
      currentFile,
      props.processors,
      props.userConfig || {}
    )
    processedUrls.value.set(currentFile, previewUrl)
  } catch (error) {
    console.error('Failed to generate preview:', error)
  }
}, 300)

// 当前预览URL
const currentPreviewUrl = computed(() => {
  const currentFile = props.files[props.currentIndex]
  if (!currentFile) return null

  // 优先使用父组件传递的预览URL（来自"应用全部"）
  if (props.previewUrls && props.previewUrls.has(currentFile)) {
    return props.previewUrls.get(currentFile)!
  }

  // 其次返回本地处理后的URL
  if (processedUrls.value.has(currentFile)) {
    return processedUrls.value.get(currentFile)!
  }

  // 最后返回原图
  return originalUrls.value.get(currentFile) || null
})

// 获取缩略图URL（始终返回原图）
function getThumbnailUrl(file: File): string | null {
  return originalUrls.value.get(file) || null
}

// 切换图片
function selectImage(index: number) {
  emit('update:current-index', index)
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

// 监听文件变化
watch(() => props.files, (newFiles, oldFiles) => {
  // 清理不再使用的URL
  const currentFiles = new Set(newFiles)

  originalUrls.value.forEach((url, file) => {
    if (!currentFiles.has(file)) {
      URL.revokeObjectURL(url)
      originalUrls.value.delete(file)
    }
  })

  processedUrls.value.forEach((url, file) => {
    if (!currentFiles.has(file)) {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
      processedUrls.value.delete(file)
    }
  })

  // 生成缩略图
  generateThumbnails()

  // 更新当前预览
  updateCurrentPreview()
}, { immediate: true })

// 监听当前索引变化 - 切换图片时生成预览
watch(() => props.currentIndex, () => {
  updateCurrentPreview()
})

// 监听配置变化 - 只清除当前图片的缓存
watch([() => props.processors, () => props.userConfig], () => {
  const currentFile = props.files[props.currentIndex]
  if (!currentFile) return

  // 只清除当前图片的处理缓存
  const currentProcessedUrl = processedUrls.value.get(currentFile)
  if (currentProcessedUrl && currentProcessedUrl.startsWith('blob:')) {
    URL.revokeObjectURL(currentProcessedUrl)
  }
  processedUrls.value.delete(currentFile)

  // 清除useWatermarkPreview的内部缓存
  clearCache()

  // 重新生成当前图片
  updateCurrentPreview()
}, { deep: true })

// 清理
onUnmounted(() => {
  originalUrls.value.forEach(url => URL.revokeObjectURL(url))
  processedUrls.value.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
  clearCache()
})
</script>
