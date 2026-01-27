<template>
  <!-- 未上传状态：欢迎页 -->
  <HomePage v-if="uploadedFiles.length === 0" @upload="handleUpload" />

  <!-- 已上传状态：编辑器 -->
  <EditorPage
    v-else
    :files="uploadedFiles"
    :image-states="imageStates"
    :processed-cache="processedCache"
    :preview-urls="previewUrls"
    :exif-cache="exifCache"
    :brand-stats="brandStats"
    :no-brand-count="noBrandCount"
    :custom-logos="customLogos"
    @reset="resetApp"
    @update:image-states="imageStates = $event"
    @update:processed-cache="processedCache = $event"
    @update:preview-urls="previewUrls = $event"
    @update:custom-logos="customLogos = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useExif } from '~/composables/useExif'
import { useConfirm } from '~/composables/useConfirm'
import { initProcessors } from '~/lib/processors'
import HomePage from '~/components/HomePage.vue'
import EditorPage from '~/components/EditorPage.vue'

// 图片状态接口
interface ImageState {
  templateId: string
  config: Record<string, any>
}

// 处理结果缓存接口
interface ProcessedResult {
  canvas: HTMLCanvasElement
  blob: Blob
}

// 禁用 SSR
definePageMeta({
  ssr: false
})

// 初始化处理器
onMounted(() => {
  initProcessors()
})

// EXIF 读取
const { readExif } = useExif()

// Confirm dialog
const { confirm } = useConfirm()

// 上传的文件
const uploadedFiles = ref<File[]>([])

// 每张图片的独立状态（模板 + 配置）
const imageStates = ref<Map<File, ImageState>>(new Map())

// 处理结果缓存（用于下载时避免重复处理）
const processedCache = ref<Map<File, ProcessedResult>>(new Map())

// 预览URL缓存（用于快速切换显示）
const previewUrls = ref<Map<File, string>>(new Map())

// EXIF 数据缓存
const exifCache = ref<Map<File, Record<string, any>>>(new Map())

// 品牌统计和Logo管理
const brandStats = ref<Map<string, number>>(new Map())  // 品牌名 -> 图片数量
const noBrandCount = ref(0)  // 没有品牌信息的图片数量
const customLogos = ref<Map<string, string>>(new Map())  // 品牌名 -> 自定义Logo的DataURL

// 处理上传 - 为每张图片初始化默认状态
async function handleUpload(files: File[]) {
  uploadedFiles.value = files

  // 清除旧的状态和缓存
  imageStates.value.clear()
  processedCache.value.clear()
  previewUrls.value.clear()
  exifCache.value.clear()
  brandStats.value.clear()
  noBrandCount.value = 0

  // 为所有新图片初始化默认状态并读取 EXIF
  for (const file of files) {
    imageStates.value.set(file, {
      templateId: 'noProcess',
      config: {}
    })

    // 异步读取 EXIF
    try {
      const exif = await readExif(file)
      exifCache.value.set(file, exif)

      // 统计品牌
      if (exif.Make && exif.Make.trim()) {
        const brand = exif.Make.trim()
        brandStats.value.set(brand, (brandStats.value.get(brand) || 0) + 1)
      } else {
        noBrandCount.value++
      }
    } catch (error) {
      console.error('Failed to read EXIF:', error)
      exifCache.value.set(file, {})
      noBrandCount.value++
    }
  }
}

// 重置应用
async function resetApp() {
  const confirmed = await confirm({
    title: '重新开始',
    message: '确定要重新开始吗？当前的编辑将丢失。',
    confirmText: '重新开始',
    cancelText: '取消'
  })

  if (confirmed) {
    uploadedFiles.value = []
    imageStates.value.clear()
    processedCache.value.clear()
    previewUrls.value.clear()
    exifCache.value.clear()
    brandStats.value.clear()
    noBrandCount.value = 0
    customLogos.value.clear()
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}
</style>
