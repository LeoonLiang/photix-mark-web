<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-card/95 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl border border-border">
      <!-- Header with Icon -->
      <div class="flex items-center gap-3 mb-6">
        <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">正在处理图片</h3>
          <p class="text-xs text-muted-foreground">请稍候片刻...</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-muted rounded-full h-3 mb-3 overflow-hidden">
        <div
          class="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-300 shadow-lg shadow-primary/20"
          :style="{ width: `${progress.percent}%` }"
        ></div>
      </div>

      <!-- Progress Text -->
      <div class="flex justify-between items-center mb-2">
        <p class="text-sm text-foreground font-medium">
          {{ progress.current }} / {{ progress.total }}
        </p>
        <p class="text-sm text-primary font-semibold">
          {{ progress.percent }}%
        </p>
      </div>

      <p class="text-xs text-muted-foreground text-center mt-4">
        处理完成后可导出文件
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
