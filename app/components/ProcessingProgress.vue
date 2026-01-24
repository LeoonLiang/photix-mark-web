<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-xl">
      <h3 class="text-lg font-semibold mb-4">正在处理图片...</h3>

      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          :style="{ width: `${progress.percent}%` }"
        ></div>
      </div>

      <!-- Progress Text -->
      <p class="text-sm text-gray-600 text-center">
        {{ progress.current }} / {{ progress.total }} ({{ progress.percent }}%)
      </p>

      <p class="text-xs text-gray-400 text-center mt-4">
        请稍候，处理完成后可导出文件
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  progress: {
    current: number
    total: number
    percent: number
  }
}>()
</script>
