<template>
  <div class="border-t border-border pt-4 mt-4">
    <button
      @click="expanded = !expanded"
      class="w-full flex items-center justify-between text-sm font-semibold text-foreground hover:text-primary transition-colors group"
    >
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span>当前图片 EXIF 信息</span>
      </div>
      <svg
        class="w-4 h-4 transition-transform duration-200 text-muted-foreground"
        :class="{ 'rotate-180': expanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="expand">
      <div v-if="expanded" class="mt-4 space-y-3 text-xs">
        <!-- 相机信息 -->
        <div class="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-3 space-y-2 border border-border/50">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span class="font-semibold text-foreground">相机信息</span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-muted-foreground">品牌</span>
            <span :class="exif.Make ? 'text-foreground font-medium' : 'text-muted-foreground/50'">
              {{ exif.Make || '未找到' }}
            </span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-muted-foreground">型号</span>
            <span :class="exif.Model ? 'text-foreground font-medium' : 'text-muted-foreground/50'">
              {{ exif.Model || '未找到' }}
            </span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-muted-foreground">镜头</span>
            <span :class="exif.LensModel ? 'text-foreground font-medium' : 'text-muted-foreground/50'">
              {{ exif.LensModel || '未找到' }}
            </span>
          </div>
        </div>

        <!-- 拍摄参数 -->
        <div class="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-3 space-y-2 border border-primary/20">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span class="font-semibold text-foreground">拍摄参数</span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-muted-foreground">焦距</span>
            <span :class="exif.FocalLength ? 'text-foreground font-medium' : 'text-muted-foreground/50'">
              {{ exif.FocalLength ? `${exif.FocalLength}mm` : '未找到' }}
            </span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-muted-foreground">光圈</span>
            <span :class="exif.FNumber ? 'text-foreground font-medium' : 'text-muted-foreground/50'">
              {{ exif.FNumber ? `f/${exif.FNumber}` : '未找到' }}
            </span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-muted-foreground">快门</span>
            <span :class="exif.ExposureTime ? 'text-foreground font-medium' : 'text-muted-foreground/50'">
              {{ formatShutter(exif.ExposureTime) }}
            </span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-muted-foreground">ISO</span>
            <span :class="exif.ISO ? 'text-foreground font-medium' : 'text-muted-foreground/50'">
              {{ exif.ISO ? `ISO ${exif.ISO}` : '未找到' }}
            </span>
          </div>
        </div>

        <!-- 其他信息 -->
        <div class="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-3 space-y-2 border border-border/50">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="font-semibold text-foreground">其他信息</span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-muted-foreground">拍摄时间</span>
            <span :class="exif.DateTimeOriginal ? 'text-foreground font-medium text-[10px]' : 'text-muted-foreground/50'">
              {{ formatDateTime(exif.DateTimeOriginal) }}
            </span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-muted-foreground">图片尺寸</span>
            <span :class="(exif.ImageWidth && exif.ImageHeight) ? 'text-foreground font-medium' : 'text-muted-foreground/50'">
              {{ (exif.ImageWidth && exif.ImageHeight) ? `${exif.ImageWidth} × ${exif.ImageHeight}` : '未找到' }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  exif: Record<string, any>
}>()

const expanded = ref(false)

function formatShutter(exposureTime?: number): string {
  if (!exposureTime) return '未找到'
  if (exposureTime < 1) {
    return `1/${Math.round(1 / exposureTime)}s`
  }
  return `${exposureTime}s`
}

function formatDateTime(datetime?: string): string {
  if (!datetime) return '未找到'
  // EXIF 格式: "2024:01:25 14:30:45"
  // 转换为: "2024-01-25 14:30"
  try {
    const parts = datetime.split(' ')
    if (parts.length === 2) {
      const date = parts[0].replace(/:/g, '-')
      const time = parts[1].substring(0, 5) // 只取小时和分钟
      return `${date} ${time}`
    }
    return datetime
  } catch {
    return datetime
  }
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 600px;
  margin-top: 1rem;
}
</style>
