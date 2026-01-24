<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl">
      <!-- Header -->
      <div class="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">选择图片</h3>
          <p class="text-sm text-gray-500 mt-1">
            已选择 <span class="font-medium text-primary">{{ selectedFiles.size }}</span> / {{ files.length }} 张图片
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Image Grid -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            v-for="(file, index) in files"
            :key="index"
            @click="toggleSelection(file)"
            :class="[
              'relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all',
              selectedFiles.has(file)
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <!-- Image -->
            <img
              v-if="getThumbnailUrl(file)"
              :src="getThumbnailUrl(file)"
              :alt="file.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
              <svg class="animate-spin w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>

            <!-- Selected Indicator -->
            <div
              v-if="selectedFiles.has(file)"
              class="absolute inset-0 bg-primary/20 flex items-center justify-center"
            >
              <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <!-- File Name -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
              <p class="text-xs text-white truncate">{{ file.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 border-t flex items-center justify-between bg-gray-50">
        <div class="flex gap-2">
          <button
            @click="selectAll"
            class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            全选
          </button>
          <button
            @click="selectNone"
            class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            清空
          </button>
        </div>

        <div class="flex gap-2">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            @click="confirm"
            :disabled="selectedFiles.size === 0"
            class="px-4 py-2 text-sm text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            确定 ({{ selectedFiles.size }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  files: File[]
}>()

const emit = defineEmits<{
  close: []
  confirm: [files: File[]]
}>()

// 选中的文件
const selectedFiles = ref<Set<File>>(new Set())

// 缩略图 URL
const thumbnailUrls = ref<Map<File, string>>(new Map())

// 生成缩略图
function generateThumbnails() {
  for (const file of props.files) {
    if (!thumbnailUrls.value.has(file)) {
      const url = URL.createObjectURL(file)
      thumbnailUrls.value.set(file, url)
    }
  }
}

// 获取缩略图 URL
function getThumbnailUrl(file: File): string | null {
  return thumbnailUrls.value.get(file) || null
}

// 切换选择
function toggleSelection(file: File) {
  if (selectedFiles.value.has(file)) {
    selectedFiles.value.delete(file)
  } else {
    selectedFiles.value.add(file)
  }
}

// 全选
function selectAll() {
  selectedFiles.value = new Set(props.files)
}

// 清空
function selectNone() {
  selectedFiles.value.clear()
}

// 确认
function confirm() {
  if (selectedFiles.value.size === 0) return
  emit('confirm', Array.from(selectedFiles.value))
}

// 初始化
onMounted(() => {
  generateThumbnails()
})

// 清理
onUnmounted(() => {
  thumbnailUrls.value.forEach(url => URL.revokeObjectURL(url))
})
</script>
