<template>
  <div class="h-full flex flex-col" style="box-sizing: border-box;">
    <!-- Main Image - flex-1 takes remaining space -->
    <div
      class="relative flex items-center justify-center bg-gray rounded-lg overflow-hidden cursor-pointer"
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

      <!-- EXIF 信息卡片 - 按钮悬浮在右上角 -->
      <div
        v-if="currentExif && Object.keys(currentExif).length > 0"
        class="absolute top-3 right-3 z-10"
        @click.stop
      >
        <!-- 折叠按钮 -->
        <button
          @click="exifExpanded = !exifExpanded"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-xl transition-all',
            'bg-black/60 backdrop-blur-xl border border-white/20',
            'hover:bg-black/70 hover:border-white/30',
            'text-white text-xs font-medium shadow-lg'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>EXIF 信息</span>
          <svg
            class="w-3.5 h-3.5 transition-transform duration-200"
            :class="{ 'rotate-180': exifExpanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- EXIF 详细信息 - Teleport 到 body -->
      <Teleport to="body">
        <Transition name="exif-modal">
          <div
            v-if="exifExpanded && currentExif && Object.keys(currentExif).length > 0"
            class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            @click="exifExpanded = false"
          >
            <!-- 背景遮罩 -->
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            <!-- EXIF 内容卡片 -->
            <div
              class="relative bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden max-w-md w-full max-h-[85vh]"
              @click.stop
            >
              <!-- Header -->
              <div class="flex items-center justify-between p-4 border-b border-white/10">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span class="font-semibold text-white">EXIF 信息</span>
                </div>
                <button
                  @click="exifExpanded = false"
                  class="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Content -->
              <div class="p-4 space-y-3 text-xs overflow-y-auto custom-scrollbar" style="max-height: calc(85vh - 64px);">
                <!-- 相机信息 -->
                <div class="space-y-2">
                  <div class="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <div class="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span class="font-semibold text-white text-sm">相机信息</span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-white/60">品牌</span>
                    <span :class="currentExif.Make ? 'text-white font-medium' : 'text-white/40'">
                      {{ currentExif.Make || '未找到' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-white/60">型号</span>
                    <span :class="currentExif.Model ? 'text-white font-medium' : 'text-white/40'">
                      {{ currentExif.Model || '未找到' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-white/60">镜头</span>
                    <span :class="currentExif.LensModel ? 'text-white font-medium' : 'text-white/40'">
                      {{ currentExif.LensModel || '未找到' }}
                    </span>
                  </div>
                </div>

                <!-- 拍摄参数 -->
                <div class="space-y-2">
                  <div class="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <div class="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                      <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span class="font-semibold text-white text-sm">拍摄参数</span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-white/60">焦距</span>
                    <span :class="currentExif.FocalLength ? 'text-white font-medium' : 'text-white/40'">
                      {{ currentExif.FocalLength ? `${currentExif.FocalLength}mm` : '未找到' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-white/60">光圈</span>
                    <span :class="currentExif.FNumber ? 'text-white font-medium' : 'text-white/40'">
                      {{ currentExif.FNumber ? `f/${currentExif.FNumber}` : '未找到' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-white/60">快门</span>
                    <span :class="currentExif.ExposureTime ? 'text-white font-medium' : 'text-white/40'">
                      {{ formatShutter(currentExif.ExposureTime) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-white/60">ISO</span>
                    <span :class="currentExif.ISO ? 'text-white font-medium' : 'text-white/40'">
                      {{ currentExif.ISO ? `ISO ${currentExif.ISO}` : '未找到' }}
                    </span>
                  </div>
                </div>

                <!-- 其他信息 -->
                <div class="space-y-2">
                  <div class="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <div class="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span class="font-semibold text-white text-sm">其他信息</span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-white/60">拍摄时间</span>
                    <span :class="currentExif.DateTimeOriginal ? 'text-white font-medium text-[10px]' : 'text-white/40'">
                      {{ formatDateTime(currentExif.DateTimeOriginal) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-white/60">图片尺寸</span>
                    <span :class="(currentExif.ImageWidth && currentExif.ImageHeight) ? 'text-white font-medium' : 'text-white/40'">
                      {{ (currentExif.ImageWidth && currentExif.ImageHeight) ? `${currentExif.ImageWidth} × ${currentExif.ImageHeight}` : '未找到' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>

<!-- Thumbnails Carousel - 优化样式 -->
    <div v-if="files.length > 0" class="border-t border-border/50 bg-background/30" style="height: 96px; flex-shrink: 0; padding: 8px 0;">
      <div class="flex items-center gap-1.5 h-full px-2">
        <!-- Thumbnail List - 无箭头，纯滚动 -->
        <div ref="thumbnailContainer" class="flex-1 overflow-x-auto h-full scrollbar-hide smooth-scroll">
          <div class="flex gap-2 h-full items-center p-1">
            <!-- 添加照片按钮 -->
            <div
              @click="emit('upload')"
              class="relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-200 opacity-100 hover:opacity-100 border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent"
              :style="{
                width: '56px',
                height: '68px'
              }"
            >
              <div class="w-full h-full flex items-center justify-center">
                <svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>

            <!-- 照片缩略图 -->
            <div
              v-for="(file, index) in files"
              :key="index"
              :data-thumbnail="index"
              @click="selectImage(index)"
              :class="[
                'relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-200 group',
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

              <!-- 删除按钮 -->
              <button
                @click.stop="deleteImage(index)"
                class="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                title="删除照片"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
  upload: []
  delete: [index: number]
}>()

// 缩略图容器引用
const thumbnailContainer = ref<HTMLElement | null>(null)

// EXIF 信息展开状态
const exifExpanded = ref(false)

// 当前图片的 EXIF 数据
const currentExif = computed(() => {
  const currentFile = props.files[props.currentIndex]
  if (!currentFile || !props.exifCache) return null
  return props.exifCache.get(currentFile) || null
})

// 格式化快门速度
function formatShutter(exposureTime?: number): string {
  if (!exposureTime) return '未找到'
  if (exposureTime < 1) {
    return `1/${Math.round(1 / exposureTime)}s`
  }
  return `${exposureTime}s`
}

// 格式化日期时间
function formatDateTime(datetime?: string): string {
  if (!datetime) return '未找到'
  try {
    const parts = datetime.split(' ')
    if (parts.length === 2) {
      const date = parts[0].replace(/:/g, '-')
      const time = parts[1].substring(0, 5)
      return `${date} ${time}`
    }
    return datetime
  } catch {
    return datetime
  }
}

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

// 删除照片
function deleteImage(index: number) {
  emit('delete', index)
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

<style scoped>
/* EXIF 模态框动画 */
.exif-modal-enter-active,
.exif-modal-leave-active {
  transition: opacity 0.25s ease;
}

.exif-modal-enter-active > div:last-child,
.exif-modal-leave-active > div:last-child {
  transition: all 0.25s ease;
}

.exif-modal-enter-from,
.exif-modal-leave-to {
  opacity: 0;
}

.exif-modal-enter-from > div:last-child,
.exif-modal-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
