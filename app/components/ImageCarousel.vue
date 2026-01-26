<template>
  <div class="h-full flex flex-col" style="box-sizing: border-box;">
    <!-- Main Image - flex-1 takes remaining space -->
    <div
      class="flex items-center justify-center bg-gray rounded-lg overflow-hidden cursor-pointer"
      :style="{
        flex: files.length > 1 ? '1 1 0' : '1 1 auto',
        minHeight: 0
      }"
      @click="openPreview"
    >
      <!-- 加载中状态 -->
      <div v-if="isProcessing" class="flex flex-col items-center justify-center">
        <svg class="animate-spin w-12 h-12 text-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p class="text-muted-foreground font-medium">处理中...</p>
      </div>
      <!-- 预览图片 -->
      <img
        v-else-if="currentPreviewUrl"
        :src="currentPreviewUrl"
        :alt="files[currentIndex]?.name"
        style="max-height: 100%; max-width: 100%; height: auto; width: auto; object-fit: contain;"
      />
      <!-- 初始加载状态 -->
      <div v-else class="flex flex-col items-center justify-center">
        <svg class="animate-spin w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p class="text-gray-500">加载中...</p>
      </div>
    </div>

    <!-- Thumbnails Carousel - 优化样式 -->
    <div v-if="files.length > 1" class="border-t border-border/50 bg-background/30" style="height: 96px; flex-shrink: 0; padding: 8px 0;">
      <div class="flex items-center gap-1.5 h-full px-2">
        <!-- Thumbnail List - 无箭头，纯滚动 -->
        <div ref="thumbnailContainer" class="flex-1 overflow-x-auto h-full scrollbar-hide smooth-scroll">
          <div class="flex gap-2 h-full items-center p-1">
            <div
              v-for="(file, index) in files"
              :key="index"
              :data-thumbnail="index"
              @click="selectImage(index)"
              :class="[
                'relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-200',
                currentIndex === index
                  ? 'ring-2 ring-primary scale-105'
                  : 'opacity-60 hover:opacity-100'
              ]"
              :style="{
                width: '56px',
                height: '68px'
              }"
            >
              <img
                v-if="getThumbnailUrl(file)"
                :src="getThumbnailUrl(file)"
                :alt="file.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-muted flex items-center justify-center">
                <svg class="animate-spin w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useWatermarkPreview } from '~/composables/useWatermarkPreview'

const props = defineProps<{
  files: File[]
  currentIndex: number
  processors?: any[]
  userConfig?: Record<string, any>
  previewUrls?: Map<File, string>
  customLogos?: Map<string, string>  // 自定义Logo配置
  exifCache?: Map<File, Record<string, any>>  // EXIF缓存
}>()

const emit = defineEmits<{
  'update:current-index': [index: number]
}>()

// 缩略图容器引用
const thumbnailContainer = ref<HTMLElement | null>(null)

// 预览缓存
const originalUrls = ref<Map<File, string>>(new Map())
const processedUrls = ref<Map<File, string>>(new Map())
const isProcessing = ref(false)  // 处理中状态
const { generatePreview, clearCache } = useWatermarkPreview()

// 滚动到当前缩略图
function scrollToCurrentThumbnail() {
  nextTick(() => {
    if (!thumbnailContainer.value) return
    const container = thumbnailContainer.value
    const thumbnails = container.querySelectorAll('[data-thumbnail]')
    const currentThumbnail = thumbnails[props.currentIndex] as HTMLElement

    if (currentThumbnail) {
      const containerWidth = container.offsetWidth
      const thumbnailLeft = currentThumbnail.offsetLeft
      const thumbnailWidth = currentThumbnail.offsetWidth
      const scrollPosition = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2)

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  })
}

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
    isProcessing.value = false
    return
  }

  // 🔧 修复：先检查本地缓存（配置变化时会被 watch 清除）
  // 如果本地有缓存，说明配置没变，直接使用
  if (processedUrls.value.has(currentFile)) {
    isProcessing.value = false
    return
  }

  // 然后检查父组件缓存（来自"应用全部"）
  if (props.previewUrls && props.previewUrls.has(currentFile)) {
    isProcessing.value = false
    return
  }

  try {
    // 开始处理
    isProcessing.value = true

    // 获取当前文件的品牌信息
    const exif = props.exifCache?.get(currentFile)
    const brand = exif?.Make?.trim()

    // 构建包含自定义Logo的配置
    const configWithLogos = {
      ...props.userConfig || {},
      customLogoUrl: brand && props.customLogos?.has(brand) ?
        props.customLogos.get(brand) : undefined,
      customDefaultLogoUrl: props.customLogos?.get('')
    }

    const previewUrl = await generatePreview(
      currentFile,
      props.processors,
      configWithLogos
    )
    processedUrls.value.set(currentFile, previewUrl)
  } catch (error) {
    console.error('Failed to generate preview:', error)
  } finally {
    // 处理完成
    isProcessing.value = false
  }
}, 300)

// 当前预览URL
const currentPreviewUrl = computed(() => {
  const currentFile = props.files[props.currentIndex]
  if (!currentFile) return null

  // 🔧 修复：优先使用本地处理后的URL（配置变化时会重新生成）
  if (processedUrls.value.has(currentFile)) {
    return processedUrls.value.get(currentFile)!
  }

  // 其次使用父组件传递的预览URL（来自"应用全部"）
  if (props.previewUrls && props.previewUrls.has(currentFile)) {
    return props.previewUrls.get(currentFile)!
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
  scrollToCurrentThumbnail()
}

function prevImage() {
  if (props.currentIndex > 0) {
    emit('update:current-index', props.currentIndex - 1)
    scrollToCurrentThumbnail()
  }
}

function nextImage() {
  if (props.currentIndex < props.files.length - 1) {
    emit('update:current-index', props.currentIndex + 1)
    scrollToCurrentThumbnail()
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

// 监听当前索引变化 - 切换图片时生成预览并滚动
watch(() => props.currentIndex, () => {
  updateCurrentPreview()
  scrollToCurrentThumbnail()
})

// 监听配置变化 - 只清除当前图片的缓存
watch([() => props.processors, () => props.userConfig, () => props.customLogos], () => {
  const currentFile = props.files[props.currentIndex]
  if (!currentFile) return

  // 设置处理中状态
  isProcessing.value = true

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

// 打开图片预览
function openPreview() {
  if (!currentPreviewUrl.value) return

  // 创建预览元素
  const img = document.createElement('img')
  img.src = currentPreviewUrl.value

  // 动态导入 viewerjs
  import('viewerjs/dist/viewer.css')
  import('viewerjs').then(({ default: Viewer }) => {
    const viewer = new Viewer(img, {
      inline: false,
      navbar: false,
      title: false,
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        rotateLeft: 1,
        rotateRight: 1,
      },
      hidden() {
        viewer.destroy()
      }
    })
    viewer.show()
  })
}

</script>
