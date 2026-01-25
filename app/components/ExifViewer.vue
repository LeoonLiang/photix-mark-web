<template>
  <div class="border-t border-gray-200 pt-3 mt-3">
    <button
      @click="expanded = !expanded"
      class="w-full flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-primary transition-colors"
    >
      <span>当前图片EXIF 信息</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': expanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="expanded" class="mt-3 space-y-2 text-xs">
      <!-- 相机信息 -->
      <div class="bg-gray-50 rounded-lg p-2 space-y-1.5">
        <div class="font-medium text-gray-600 mb-1">相机信息</div>
        <div class="flex justify-between">
          <span class="text-gray-500">品牌</span>
          <span :class="exif.Make ? 'text-gray-900' : 'text-gray-400'">
            {{ exif.Make || '未找到' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">型号</span>
          <span :class="exif.Model ? 'text-gray-900' : 'text-gray-400'">
            {{ exif.Model || '未找到' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">镜头</span>
          <span :class="exif.LensModel ? 'text-gray-900' : 'text-gray-400'">
            {{ exif.LensModel || '未找到' }}
          </span>
        </div>
      </div>

      <!-- 拍摄参数 -->
      <div class="bg-gray-50 rounded-lg p-2 space-y-1.5">
        <div class="font-medium text-gray-600 mb-1">拍摄参数</div>
        <div class="flex justify-between">
          <span class="text-gray-500">焦距</span>
          <span :class="exif.FocalLength ? 'text-gray-900' : 'text-gray-400'">
            {{ exif.FocalLength ? `${exif.FocalLength}mm` : '未找到' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">光圈</span>
          <span :class="exif.FNumber ? 'text-gray-900' : 'text-gray-400'">
            {{ exif.FNumber ? `f/${exif.FNumber}` : '未找到' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">快门</span>
          <span :class="exif.ExposureTime ? 'text-gray-900' : 'text-gray-400'">
            {{ formatShutter(exif.ExposureTime) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">ISO</span>
          <span :class="exif.ISO ? 'text-gray-900' : 'text-gray-400'">
            {{ exif.ISO ? `ISO ${exif.ISO}` : '未找到' }}
          </span>
        </div>
      </div>

      <!-- 其他信息 -->
      <div class="bg-gray-50 rounded-lg p-2 space-y-1.5">
        <div class="font-medium text-gray-600 mb-1">其他信息</div>
        <div class="flex justify-between">
          <span class="text-gray-500">拍摄时间</span>
          <span :class="exif.DateTimeOriginal ? 'text-gray-900 text-[10px]' : 'text-gray-400'">
            {{ formatDateTime(exif.DateTimeOriginal) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">图片尺寸</span>
          <span :class="(exif.ImageWidth && exif.ImageHeight) ? 'text-gray-900' : 'text-gray-400'">
            {{ (exif.ImageWidth && exif.ImageHeight) ? `${exif.ImageWidth} × ${exif.ImageHeight}` : '未找到' }}
          </span>
        </div>
      </div>
    </div>
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
