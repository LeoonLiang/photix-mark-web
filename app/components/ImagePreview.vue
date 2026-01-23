<template>
  <div class="h-full flex flex-col">
    <!-- Mode Switcher -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">预览区</h2>
      <div class="flex gap-2">
        <button
          @click="$emit('update:preview-mode', 'grid')"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors',
            previewMode === 'grid'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          🔲 批量预览
        </button>
        <button
          @click="$emit('update:preview-mode', 'carousel')"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors',
            previewMode === 'carousel'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          ▶ 轮播预览
        </button>
      </div>
    </div>

    <!-- Preview Content -->
    <div class="flex-1 overflow-hidden">
      <div v-if="files.length === 0" class="h-full flex items-center justify-center">
        <div class="text-center text-gray-400">
          <div class="text-6xl mb-4">🖼️</div>
          <p>请先上传图片</p>
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
            class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
          >
            <img
              :src="getPreviewUrl(file)"
              :alt="file.name"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Carousel View -->
      <div
        v-else
        class="h-full flex flex-col items-center justify-center"
      >
        <div class="flex-1 flex items-center justify-center w-full">
          <img
            v-if="files[currentIndex]"
            :src="getPreviewUrl(files[currentIndex])"
            :alt="files[currentIndex].name"
            class="max-w-full max-h-full object-contain"
          />
        </div>

        <!-- Navigation -->
        <div class="flex items-center gap-4 mt-4">
          <button
            @click="prevImage"
            :disabled="currentIndex === 0"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ◀
          </button>
          <div class="text-sm text-gray-600">
            {{ currentIndex + 1 }} / {{ files.length }} - {{ files[currentIndex]?.name }}
          </div>
          <button
            @click="nextImage"
            :disabled="currentIndex === files.length - 1"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const props = defineProps<{
  files: File[]
  currentIndex: number
  previewMode: 'grid' | 'carousel'
}>()

const emit = defineEmits<{
  'update:current-index': [index: number]
  'update:preview-mode': [mode: 'grid' | 'carousel']
}>()

// 预览 URL 缓存
const previewUrls = ref<Map<File, string>>(new Map())

function getPreviewUrl(file: File): string {
  if (!previewUrls.value.has(file)) {
    const url = URL.createObjectURL(file)
    previewUrls.value.set(file, url)
  }
  return previewUrls.value.get(file)!
}

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
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
})
</script>
