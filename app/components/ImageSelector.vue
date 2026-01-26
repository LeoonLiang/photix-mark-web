<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Dialog -->
        <div
          class="relative bg-card/95 backdrop-blur-xl rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl border border-border overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 py-5 border-b border-border bg-muted/30">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <!-- Icon -->
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-foreground">选择要应用的图片</h3>
                  <p class="text-sm text-muted-foreground mt-0.5">
                    已选择 <span class="font-semibold text-primary">{{ selectedFiles.size }}</span> / {{ files.length }} 张
                  </p>
                </div>
              </div>

              <!-- Close Button -->
              <button
                @click="$emit('close')"
                class="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Image Grid -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <div
                v-for="(file, index) in files"
                :key="index"
                @click="toggleSelection(file)"
                :class="[
                  'group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200',
                  selectedFiles.has(file)
                    ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/20 scale-[0.98]'
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                ]"
              >
                <!-- Image -->
                <img
                  v-if="getThumbnailUrl(file)"
                  :src="getThumbnailUrl(file)"
                  :alt="file.name"
                  class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div v-else class="w-full h-full bg-muted flex items-center justify-center">
                  <svg class="animate-spin w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>

                <!-- Selected Overlay -->
                <Transition name="fade">
                  <div
                    v-if="selectedFiles.has(file)"
                    class="absolute inset-0 bg-primary/30 flex items-center justify-center"
                  >
                    <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </Transition>

                <!-- File Name Badge -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent px-2 py-2">
                  <p class="text-xs text-white truncate font-medium">{{ file.name }}</p>
                </div>

                <!-- Index Badge -->
                <div class="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
                  <p class="text-xs text-white font-medium">{{ index + 1 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 border-t border-border bg-muted/30">
            <div class="flex items-center justify-between">
              <!-- Quick Actions -->
              <div class="flex gap-2">
                <button
                  @click="selectAll"
                  class="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  全选
                </button>
                <button
                  @click="selectNone"
                  class="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  清空
                </button>
              </div>

              <!-- Main Actions -->
              <div class="flex gap-3">
                <button
                  @click="$emit('close')"
                  class="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  @click="confirm"
                  :disabled="selectedFiles.size === 0"
                  class="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  确定应用 ({{ selectedFiles.size }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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

<style scoped>
/* Dialog Animations */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-active > div > div,
.dialog-leave-active > div > div {
  transition: all 0.25s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div > div,
.dialog-leave-to > div > div {
  transform: scale(0.95);
  opacity: 0;
}

/* Fade Transition for Selection Overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale Animation for Checkmark */
@keyframes scale-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>
