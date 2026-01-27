<template>
  <div class="h-screen flex flex-col bg-background overflow-hidden">
    <!-- Header - 桌面端 -->
    <header class="bg-background/80 backdrop-blur-xl border-b border-border h-16 flex-shrink-0 items-center px-6 shadow-sm hidden lg:flex">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-primary to-amber-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 class="font-bold text-lg text-foreground tracking-tight">Photix Mark</h1>
          <p class="text-xs text-muted-foreground">{{ files.length }} 张图片</p>
        </div>
      </div>

      <div class="ml-auto">
        <Button @click="$emit('reset')" variant="outline" size="sm">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          重新选择
        </Button>
      </div>
    </header>

    <!-- Mobile Header - 移动端简化版 -->
    <header class="bg-background/95 backdrop-blur-xl border-b border-border h-12 flex-shrink-0 flex items-center justify-between px-3 shadow-sm lg:hidden">
      <!-- 返回按钮 -->
      <button @click="$emit('reset')" class="p-2 hover:bg-muted rounded-lg transition-colors">
        <svg class="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- 应用到全部按钮 -->
      <Button
        @click="applyToAll"
        :disabled="processing || currentTemplateId === 'noProcess'"
        variant="secondary"
        size="sm"
        class="text-xs px-3 py-1.5 rounded-full"
      >
        应用到全部
      </Button>

      <!-- 导出按钮 -->
      <Button
        @click="downloadAll"
        variant="default"
        size="sm"
        class="text-xs px-3 py-1.5 font-medium"
      >
        导出全部
      </Button>
    </header>

    <!-- Main Editor - 桌面端 -->
    <main class="flex-1 hidden lg:block" style="min-height: 0; overflow: hidden; padding: 16px;">
      <div class="h-full grid grid-cols-12" style="gap: 16px;">
        <!-- Left: Image Carousel (70%) -->
        <div class="col-span-12 lg:col-span-8" style="min-height: 0;">
          <div class="h-full bg-card/80 backdrop-blur-xl shadow-lg shadow-primary/5 rounded-lg" style="overflow: hidden; padding: 12px;">
            <ClientOnly>
              <ImageCarousel
                :files="files"
                :current-index="currentIndex"
                :processors="currentTemplate.processors"
                :user-config="currentConfig"
                :preview-urls="previewUrls"
                :custom-logos="customLogos"
                :exif-cache="exifCache"
                @update:current-index="currentIndex = $event"
              />
            </ClientOnly>
          </div>
        </div>

        <!-- Right: Control Panel (30%) -->
        <div class="col-span-12 lg:col-span-4" style="min-height: 0; overflow: hidden;">
          <div class="h-full overflow-y-auto space-y-4" style="padding-right: 4px;">
          <!-- Template Selection -->
          <Card class="bg-card/80 backdrop-blur-xl shadow-lg shadow-primary/5">
            <CardHeader class="border-b bg-black/10 py-3">
              <CardTitle class="text-base">模板选择</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateSelector
                :templates="templates"
                :selected-id="currentTemplateId"
                @select="handleTemplateSelect"
              />
            </CardContent>
          </Card>

          <!-- Template Configuration -->
          <Card v-if="currentTemplateId !== 'noProcess'" class="bg-card/80 backdrop-blur-xl shadow-lg shadow-primary/5">
            <CardHeader class="border-b bg-black/10 py-3">
              <CardTitle class="text-base">模板配置</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateConfig
                :template="currentTemplate"
                :exif="currentExif"
                v-model="currentConfig"
              />
            </CardContent>
          </Card>

          <!-- Brand Logo Manager -->
          <Card v-if="files.length > 0" class="bg-card/80 backdrop-blur-xl shadow-lg shadow-primary/5">
            <CardHeader class="border-b bg-black/10 py-3">
              <CardTitle class="text-base">品牌 Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandLogoManager
                :brands="brandStats"
                :no-brand-count="noBrandCount"
                :custom-logos="customLogos"
                @update:custom-logos="customLogos = $event"
                @logo-uploaded="handleLogoUploaded"
              />
            </CardContent>
          </Card>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <!-- Apply Buttons -->
            <div class="space-y-2">
              <Button
                @click="applyToAll"
                :disabled="processing || currentTemplateId === 'noProcess'"
                class="w-full"
                size="lg"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                应用到所有图片
              </Button>

              <Button
                @click="applyToSelected"
                :disabled="processing || currentTemplateId === 'noProcess'"
                variant="outline"
                class="w-full"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                应用到部分图片
              </Button>
            </div>

            <!-- Download Buttons -->
            <div class="space-y-2 pt-2 border-t">
              <Button
                @click="downloadCurrent"
                variant="secondary"
                class="w-full"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出当前图片
              </Button>

              <Button
                @click="downloadAll"
                variant="secondary"
                class="w-full"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                导出全部图片
              </Button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Main - 移动端布局 -->
    <main class="flex-1 lg:hidden flex flex-col relative bg-muted/30" style="min-height: 0; overflow: hidden;">
      <!-- Preview Area -->
      <div class="flex-1" style="min-height: 0; padding: 4px;">
        <div class="h-full bg-card/90 backdrop-blur-xl shadow-lg rounded-lg" style="overflow: hidden; padding: 6px;">
          <ClientOnly>
            <ImageCarousel
              :files="files"
              :current-index="currentIndex"
              :processors="currentTemplate.processors"
              :user-config="currentConfig"
              :preview-urls="previewUrls"
              :custom-logos="customLogos"
              :exif-cache="exifCache"
              @update:current-index="currentIndex = $event"
            />
          </ClientOnly>
        </div>
      </div>

      <!-- Bottom Control Tabs -->
      <div class="flex-shrink-0 bg-background/95 backdrop-blur-xl border-t border-border">
        <!-- Tab Content -->
        <div class="overflow-y-auto" style="max-height: 50vh;">
          <!-- 模板选择 Tab -->
          <div v-show="currentMobileTab === 'template'" class="px-3 pt-2 pb-3 space-y-2">
            <TemplateSelector
              :templates="templates"
              :selected-id="currentTemplateId"
              @select="handleTemplateSelect"
            />

            <!-- Template Configuration -->
            <TemplateConfig
              v-if="currentTemplateId !== 'noProcess'"
              :template="currentTemplate"
              :exif="currentExif"
              v-model="currentConfig"
            />
          </div>

          <!-- 品牌管理 Tab -->
          <div v-show="currentMobileTab === 'brand'" class="px-3 pt-2 pb-3">
            <BrandLogoManager
              :brands="brandStats"
              :no-brand-count="noBrandCount"
              :custom-logos="customLogos"
              @update:custom-logos="customLogos = $event"
              @logo-uploaded="handleLogoUploaded"
            />
          </div>

          <!-- 应用 Tab -->
          <div v-show="currentMobileTab === 'apply'" class="p-3 space-y-2">
            <Button
              @click="applyToAll"
              :disabled="processing || currentTemplateId === 'noProcess'"
              class="w-full"
              size="lg"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              应用到所有图片
            </Button>

            <Button
              @click="applyToSelected"
              :disabled="processing || currentTemplateId === 'noProcess'"
              variant="outline"
              class="w-full"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              应用到部分图片
            </Button>
          </div>

          <!-- 导出 Tab -->
          <div v-show="currentMobileTab === 'export'" class="p-3 space-y-2">
            <Button
              @click="downloadCurrent"
              variant="secondary"
              class="w-full"
              size="lg"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出当前图片
            </Button>

            <Button
              @click="downloadAll"
              variant="secondary"
              class="w-full"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              导出全部图片
            </Button>
          </div>
        </div>

        <!-- Bottom Icon Navigation -->
        <div class="border-t border-border bg-background">
          <div class="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
            <button
              v-for="tab in mobileTabs"
              :key="tab.id"
              @click="currentMobileTab = tab.id"
              :class="[
                'flex flex-col items-center justify-center gap-1 px-4 py-1.5 rounded-lg transition-all min-w-[64px]',
                currentMobileTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5" />
              <span class="text-[10px] font-medium">{{ tab.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Processing Progress Modal -->
    <ProcessingProgress
      v-if="processing || downloading"
      :progress="processing ? progress : downloadProgress"
    />

    <!-- Image Selector Modal -->
    <ImageSelector
      v-if="showImageSelector"
      :files="files"
      @close="showImageSelector = false"
      @confirm="handleApplyToSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineComponent } from 'vue'
import { useTemplates } from '~/composables/useTemplates'
import { useBatchProcessor } from '~/composables/useBatchProcessor'
import { useImageProcessor } from '~/composables/useImageProcessor'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { downloadImages } from '~/utils/download'
import { canvasToBlob } from '~/utils/canvas'
import type { TemplateConfig } from '~/lib/templates/types'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'
import ImageSelector from '~/components/ImageSelector.vue'
import BrandLogoManager from '~/components/BrandLogoManager.vue'

// Props
interface Props {
  files: File[]
  imageStates: Map<File, { templateId: string; config: Record<string, any> }>
  processedCache: Map<File, { canvas: HTMLCanvasElement; blob: Blob }>
  previewUrls: Map<File, string>
  exifCache: Map<File, Record<string, any>>
  brandStats: Map<string, number>
  noBrandCount: number
  customLogos: Map<string, string>
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  reset: []
  'update:imageStates': [value: Map<File, { templateId: string; config: Record<string, any> }>]
  'update:processedCache': [value: Map<File, { canvas: HTMLCanvasElement; blob: Blob }>]
  'update:previewUrls': [value: Map<File, string>]
  'update:customLogos': [value: Map<string, string>]
}>()

// Toast notifications
const { success, error: showError } = useToast()

// Confirm dialog
const { confirm } = useConfirm()

// 模板管理
const { templates } = useTemplates()

// 当前预览索引
const currentIndex = ref(0)

// 当前图片的模板ID（用于UI绑定）
const currentTemplateId = ref('noProcess')

// 当前图片的配置（用于UI绑定）
const currentConfig = ref<Record<string, any>>({})

// 当前图片的 EXIF（用于显示）
const currentExif = ref<Record<string, any>>({})

// 根据ID获取模板对象
const currentTemplate = computed<TemplateConfig>(() => {
  return templates.value.find(t => t.id === currentTemplateId.value) || templates.value[0]
})

// 批量处理
const { processBatch, processing, progress } = useBatchProcessor()
const { processImage } = useImageProcessor()

// 下载进度
const downloading = ref(false)
const downloadProgress = ref({ current: 0, total: 0, percent: 0 })

// 图片选择对话框
const showImageSelector = ref(false)

// 移动端 Tab 状态
const currentMobileTab = ref('template')

// 移动端 Tab 配置
const mobileTabs = [
  {
    id: 'template',
    label: '模板',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>
      `
    })
  },
  {
    id: 'brand',
    label: '品牌',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      `
    })
  },
  {
    id: 'apply',
    label: '应用',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      `
    })
  },
  {
    id: 'export',
    label: '导出',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      `
    })
  }
]

// 加载当前图片的状态到UI
function loadCurrentImageState() {
  const currentFile = props.files[currentIndex.value]
  if (!currentFile) return

  const state = props.imageStates.get(currentFile)
  if (state) {
    if (currentTemplateId.value !== state.templateId) {
      currentTemplateId.value = state.templateId
    }
    if (JSON.stringify(currentConfig.value) !== JSON.stringify(state.config)) {
      currentConfig.value = { ...state.config }
    }
  }

  const exif = props.exifCache.get(currentFile)
  if (exif) {
    currentExif.value = exif
  } else {
    currentExif.value = {}
  }
}

// 保存当前UI状态到当前图片
function saveCurrentImageState() {
  const currentFile = props.files[currentIndex.value]
  if (!currentFile) return

  const newImageStates = new Map(props.imageStates)
  newImageStates.set(currentFile, {
    templateId: currentTemplateId.value,
    config: { ...currentConfig.value }
  })
  emit('update:imageStates', newImageStates)
}

// 监听索引变化
watch(currentIndex, () => {
  loadCurrentImageState()
})

// 监听模板选择变化
watch(currentTemplateId, () => {
  const currentFile = props.files[currentIndex.value]
  if (currentFile) {
    const newProcessedCache = new Map(props.processedCache)
    const newPreviewUrls = new Map(props.previewUrls)
    newProcessedCache.delete(currentFile)
    newPreviewUrls.delete(currentFile)
    emit('update:processedCache', newProcessedCache)
    emit('update:previewUrls', newPreviewUrls)
  }
  saveCurrentImageState()
})

// 监听配置变化
watch(currentConfig, () => {
  const currentFile = props.files[currentIndex.value]
  if (currentFile) {
    const newProcessedCache = new Map(props.processedCache)
    const newPreviewUrls = new Map(props.previewUrls)
    newProcessedCache.delete(currentFile)
    newPreviewUrls.delete(currentFile)
    emit('update:processedCache', newProcessedCache)
    emit('update:previewUrls', newPreviewUrls)
  }
  saveCurrentImageState()

  // 同步配置到所有使用相同模板的其他图片
  const currentTemplateIdValue = currentTemplateId.value
  const newImageStates = new Map(props.imageStates)
  const newProcessedCache = new Map(props.processedCache)
  const newPreviewUrls = new Map(props.previewUrls)

  props.files.forEach(file => {
    if (file === currentFile) return

    const state = newImageStates.get(file)
    if (state && state.templateId === currentTemplateIdValue) {
      newImageStates.set(file, {
        templateId: state.templateId,
        config: { ...currentConfig.value }
      })
      newProcessedCache.delete(file)
      newPreviewUrls.delete(file)
    }
  })

  emit('update:imageStates', newImageStates)
  emit('update:processedCache', newProcessedCache)
  emit('update:previewUrls', newPreviewUrls)
}, { deep: true })

// 监听自定义Logo变化
const customLogos = computed({
  get: () => props.customLogos,
  set: (value) => emit('update:customLogos', value)
})

// 处理模板选择
function handleTemplateSelect(id: string) {
  currentTemplateId.value = id
  currentConfig.value = {}
}

// 处理Logo上传成功
async function handleLogoUploaded(brand: string) {
  const brandName = brand || '无品牌'
  const filesToReprocess: File[] = []

  for (const file of props.files) {
    const state = props.imageStates.get(file)
    const exif = props.exifCache.get(file)
    const fileBrand = exif?.Make?.trim()

    if (!state || state.templateId === 'noProcess') {
      continue
    }

    if (brand === '') {
      if (!fileBrand) {
        filesToReprocess.push(file)
      }
    } else {
      if (fileBrand === brand) {
        filesToReprocess.push(file)
      }
    }
  }

  if (filesToReprocess.length === 0) {
    success(`${brandName} Logo 已更新`)
    return
  }

  success(`${brandName} Logo 已更新，正在重新处理 ${filesToReprocess.length} 张图片...`)

  try {
    let processedCount = 0
    const newProcessedCache = new Map(props.processedCache)
    const newPreviewUrls = new Map(props.previewUrls)

    for (const file of filesToReprocess) {
      const state = props.imageStates.get(file)
      if (!state) continue

      const template = templates.value.find(t => t.id === state.templateId)
      if (!template) continue

      const exif = props.exifCache.get(file)
      const fileBrand = exif?.Make?.trim()

      const configWithLogo = {
        ...state.config,
        customLogoUrl: fileBrand && props.customLogos.has(fileBrand) ? props.customLogos.get(fileBrand) : undefined,
        customDefaultLogoUrl: props.customLogos.get('')
      }

      try {
        const canvas = await processImage(file, template.processors, configWithLogo)
        const blob = await canvasToBlob(canvas)

        newProcessedCache.set(file, { canvas, blob })
        const previewUrl = canvas.toDataURL('image/jpeg', 0.8)
        newPreviewUrls.set(file, previewUrl)

        processedCount++
      } catch (error) {
        console.error(`Failed to reprocess ${file.name}:`, error)
      }
    }

    emit('update:processedCache', newProcessedCache)
    emit('update:previewUrls', newPreviewUrls)

    success(`${brandName} Logo 已应用到 ${processedCount} 张图片`)
  } catch (error) {
    console.error('Reprocess error:', error)
    showError('重新处理失败，请重试')
  }
}

// 应用到所有图片
async function applyToAll() {
  const confirmed = await confirm({
    title: '应用到全部图片',
    message: `确定要将当前模板应用到全部 ${props.files.length} 张图片吗？`,
    confirmText: '应用',
    cancelText: '取消'
  })

  if (!confirmed) return

  const newImageStates = new Map(props.imageStates)
  props.files.forEach(file => {
    newImageStates.set(file, {
      templateId: currentTemplateId.value,
      config: { ...currentConfig.value }
    })
  })
  emit('update:imageStates', newImageStates)

  if (currentTemplateId.value === 'noProcess') {
    emit('update:processedCache', new Map())
    emit('update:previewUrls', new Map())
    success('已应用到所有图片！')
    return
  }

  try {
    const results = await processBatch(
      props.files,
      currentTemplate.value.processors,
      currentConfig.value,
      (file) => {
        const exif = props.exifCache.get(file)
        const brand = exif?.Make?.trim()

        return {
          customLogoUrl: brand && props.customLogos.has(brand) ? props.customLogos.get(brand) : undefined,
          customDefaultLogoUrl: props.customLogos.get('')
        }
      }
    )

    const newProcessedCache = new Map(props.processedCache)
    const newPreviewUrls = new Map(props.previewUrls)

    results.forEach(result => {
      newProcessedCache.set(result.file, {
        canvas: result.canvas,
        blob: result.blob
      })

      const previewUrl = result.canvas.toDataURL('image/jpeg', 0.8)
      newPreviewUrls.set(result.file, previewUrl)
    })

    emit('update:processedCache', newProcessedCache)
    emit('update:previewUrls', newPreviewUrls)

    success('处理完成！所有图片已应用模板。')
  } catch (error) {
    console.error('Processing error:', error)
    showError('处理失败，请重试')
  }
}

// 应用到部分图片
function applyToSelected() {
  showImageSelector.value = true
}

// 处理选中的图片
async function handleApplyToSelected(selectedFiles: File[]) {
  showImageSelector.value = false

  if (selectedFiles.length === 0) return

  const confirmed = await confirm({
    title: '应用到选中图片',
    message: `确定要将当前模板应用到选中的 ${selectedFiles.length} 张图片吗？`,
    confirmText: '应用',
    cancelText: '取消'
  })

  if (!confirmed) return

  const newImageStates = new Map(props.imageStates)
  selectedFiles.forEach(file => {
    newImageStates.set(file, {
      templateId: currentTemplateId.value,
      config: { ...currentConfig.value }
    })
  })
  emit('update:imageStates', newImageStates)

  if (currentTemplateId.value === 'noProcess') {
    const newProcessedCache = new Map(props.processedCache)
    const newPreviewUrls = new Map(props.previewUrls)
    selectedFiles.forEach(file => {
      newProcessedCache.delete(file)
      newPreviewUrls.delete(file)
    })
    emit('update:processedCache', newProcessedCache)
    emit('update:previewUrls', newPreviewUrls)
    success('已应用到选中的图片！')
    return
  }

  try {
    const results = await processBatch(
      selectedFiles,
      currentTemplate.value.processors,
      currentConfig.value,
      (file) => {
        const exif = props.exifCache.get(file)
        const brand = exif?.Make?.trim()

        return {
          customLogoUrl: brand && props.customLogos.has(brand) ? props.customLogos.get(brand) : undefined,
          customDefaultLogoUrl: props.customLogos.get('')
        }
      }
    )

    const newProcessedCache = new Map(props.processedCache)
    const newPreviewUrls = new Map(props.previewUrls)

    results.forEach(result => {
      newProcessedCache.set(result.file, {
        canvas: result.canvas,
        blob: result.blob
      })

      const previewUrl = result.canvas.toDataURL('image/jpeg', 0.8)
      newPreviewUrls.set(result.file, previewUrl)
    })

    emit('update:processedCache', newProcessedCache)
    emit('update:previewUrls', newPreviewUrls)

    success(`处理完成！已应用到 ${selectedFiles.length} 张图片。`)
  } catch (error) {
    console.error('Processing error:', error)
    showError('处理失败，请重试')
  }
}

// 下载当前图片
async function downloadCurrent() {
  try {
    const currentFile = props.files[currentIndex.value]
    const state = props.imageStates.get(currentFile)
    if (!state) return

    let blob: Blob

    const cached = props.processedCache.get(currentFile)
    if (cached) {
      blob = cached.blob
    } else {
      const template = templates.value.find(t => t.id === state.templateId)
      if (!template) return

      const exif = props.exifCache.get(currentFile)
      const brand = exif?.Make?.trim()

      const configWithLogo = {
        ...state.config,
        customLogoUrl: brand && props.customLogos.has(brand) ? props.customLogos.get(brand) : undefined,
        customDefaultLogoUrl: props.customLogos.get('')
      }

      const canvas = await processImage(
        currentFile,
        template.processors,
        configWithLogo
      )
      blob = await canvasToBlob(canvas)

      const newProcessedCache = new Map(props.processedCache)
      newProcessedCache.set(currentFile, { canvas, blob })
      emit('update:processedCache', newProcessedCache)
    }

    await downloadImages([{
      blob,
      name: currentFile.name
    }])

    success('导出成功！')
  } catch (error) {
    console.error('Download error:', error)
    showError('导出失败，请重试')
  }
}

// 下载全部图片
async function downloadAll() {
  if (props.files.length === 0) return

  try {
    downloading.value = true
    const results = []
    let skippedCount = 0
    let processedCount = 0

    const totalToProcess = props.files.filter(file => {
      const state = props.imageStates.get(file)
      return state && state.templateId !== 'noProcess'
    }).length

    downloadProgress.value = { current: 0, total: totalToProcess, percent: 0 }

    const newProcessedCache = new Map(props.processedCache)

    for (let i = 0; i < props.files.length; i++) {
      const file = props.files[i]
      const state = props.imageStates.get(file)
      if (!state) continue

      if (state.templateId === 'noProcess') {
        skippedCount++
        continue
      }

      let blob: Blob

      const cached = newProcessedCache.get(file)
      if (cached) {
        blob = cached.blob
      } else {
        const template = templates.value.find(t => t.id === state.templateId)
        if (!template) continue

        const exif = props.exifCache.get(file)
        const brand = exif?.Make?.trim()

        const configWithLogo = {
          ...state.config,
          customLogoUrl: brand && props.customLogos.has(brand) ? props.customLogos.get(brand) : undefined,
          customDefaultLogoUrl: props.customLogos.get('')
        }

        const canvas = await processImage(
          file,
          template.processors,
          configWithLogo
        )
        blob = await canvasToBlob(canvas)

        newProcessedCache.set(file, { canvas, blob })
      }

      results.push({ blob, name: file.name })
      processedCount++

      downloadProgress.value = {
        current: processedCount,
        total: totalToProcess,
        percent: totalToProcess > 0 ? Math.round((processedCount / totalToProcess) * 100) : 0
      }
    }

    emit('update:processedCache', newProcessedCache)

    if (results.length === 0) {
      showError('没有已处理的图片可以导出')
      return
    }

    await downloadImages(results)

    if (skippedCount > 0) {
      success(`成功导出 ${results.length} 张图片，跳过 ${skippedCount} 张未处理图片`)
    } else {
      success(`成功导出 ${results.length} 张图片`)
    }
  } catch (error) {
    console.error('Download error:', error)
    showError('导出失败，请重试')
  } finally {
    downloading.value = false
  }
}

// 初始化时加载第一张图片的状态
onMounted(() => {
  loadCurrentImageState()
})
</script>
