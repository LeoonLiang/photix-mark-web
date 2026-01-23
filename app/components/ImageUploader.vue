<template>
  <div>
    <div
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="triggerFileInput"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      ]"
    >
      <div class="text-4xl mb-2">📁</div>
      <p class="text-sm text-gray-600 mb-1">
        拖拽图片到这里或点击上传
      </p>
      <p class="text-xs text-gray-400">
        支持 JPG, PNG, HEIC 格式
      </p>
    </div>

    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      @change="handleFileSelect"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  upload: [files: File[]]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    processFiles(Array.from(target.files))
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false

  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

function processFiles(files: File[]) {
  // 过滤出图片文件
  const imageFiles = files.filter(file =>
    file.type.startsWith('image/')
  )

  if (imageFiles.length > 0) {
    emit('upload', imageFiles)
  } else {
    alert('请选择有效的图片文件')
  }
}
</script>
