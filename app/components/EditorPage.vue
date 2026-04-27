<template>
  <div class="h-screen flex flex-col bg-background overflow-hidden">
    <!-- Header - 桌面端 -->
    <header class="bg-background/80 backdrop-blur-xl border-b border-border h-16 flex-shrink-0 items-center px-6 shadow-sm hidden lg:flex">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 flex items-center justify-center">
          <img src="/logo.svg" alt="Photix Mark Logo" class="w-full h-full object-contain" />
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
          重新开始
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
          <div class="h-full bg-slate-100 backdrop-blur-xl shadow-lg shadow-primary/5 rounded-lg" style="overflow: hidden; padding: 12px;">
            <ClientOnly>
              <ImageCarousel
                :files="files"
                :current-index="currentIndex"
                :processors="currentTemplate.processors"
                :user-config="currentConfig"
                :preview-urls="localPreviewUrls"
                :custom-logos="customLogos"
                :image-states="localImageStates"
                :exif-cache="localExifCache"
                :current-exif="currentExif"
                @update:current-index="currentIndex = $event"
                @update:exif-overrides="updateCurrentExifOverrides"
                @append-files="handleAppendFiles"
                @remove-file="handleRemoveFile"
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
                :brands="dynamicBrandStats"
                :no-brand-count="dynamicNoBrandCount"
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
              :preview-urls="localPreviewUrls"
              :custom-logos="customLogos"
              :image-states="localImageStates"
              :exif-cache="localExifCache"
              :current-exif="currentExif"
              @update:current-index="currentIndex = $event"
              @update:exif-overrides="updateCurrentExifOverrides"
              @append-files="handleAppendFiles"
              @remove-file="handleRemoveFile"
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
              :brands="dynamicBrandStats"
              :no-brand-count="dynamicNoBrandCount"
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
import { buildCustomLogoConfig } from '~/utils/customLogos'
import { mergeExifWithOverrides } from '~/lib/editor/exif'
import type { ImageState } from '~/lib/editor/types'
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
  imageStates: Map<File, ImageState>
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
  reset: [force?: boolean]
  'update:imageStates': [value: Map<File, ImageState>]
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
const { readExif } = useExif()

const files = ref<File[]>([...props.files])
const localImageStates = ref(new Map(props.imageStates))
const localProcessedCache = ref(new Map(props.processedCache))
const localPreviewUrls = ref(new Map(props.previewUrls))
const localExifCache = ref(new Map(props.exifCache))

// 当前预览索引
const currentIndex = ref(0)

// 当前图片的模板ID（用于UI绑定）
const currentTemplateId = ref('noProcess')

// 当前图片的配置（用于UI绑定）
const currentConfig = ref<Record<string, any>>({})

// 当前图片的 EXIF（用于显示）
const currentExif = ref<Record<string, any>>({})

const currentExifOverrides = ref<Record<string, any>>({})

const currentFile = computed(() => files.value[currentIndex.value])

function syncLocalStateFromProps() {
  files.value = [...props.files]
  localImageStates.value = new Map(props.imageStates)
  localProcessedCache.value = new Map(props.processedCache)
  localPreviewUrls.value = new Map(props.previewUrls)
  localExifCache.value = new Map(props.exifCache)

  if (files.value.length === 0) {
    currentIndex.value = 0
    return
  }

  if (currentIndex.value >= files.value.length) {
    currentIndex.value = files.value.length - 1
  }
}

function emitImageStates(nextStates: Map<File, ImageState>) {
  localImageStates.value = nextStates
  emit('update:imageStates', nextStates)
}

function emitProcessedCache(nextCache: Map<File, { canvas: HTMLCanvasElement; blob: Blob }>) {
  localProcessedCache.value = nextCache
  emit('update:processedCache', nextCache)
}

function emitPreviewUrls(nextUrls: Map<File, string>) {
  localPreviewUrls.value = nextUrls
  emit('update:previewUrls', nextUrls)
}

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

watch(() => props.files, syncLocalStateFromProps, { immediate: true })
watch(() => props.imageStates, (value) => {
  localImageStates.value = new Map(value)
}, { deep: true })
watch(() => props.processedCache, (value) => {
  localProcessedCache.value = new Map(value)
}, { deep: true })
watch(() => props.previewUrls, (value) => {
  localPreviewUrls.value = new Map(value)
}, { deep: true })
watch(() => props.exifCache, (value) => {
  localExifCache.value = new Map(value)
}, { deep: true })

// 加载当前图片的状态到UI
function loadCurrentImageState() {
  const currentFile = files.value[currentIndex.value]
  if (!currentFile) return

  const state = localImageStates.value.get(currentFile)
  if (state) {
    if (currentTemplateId.value !== state.templateId) {
      currentTemplateId.value = state.templateId
    }
    if (JSON.stringify(currentConfig.value) !== JSON.stringify(state.config)) {
      currentConfig.value = { ...state.config }
    }
    currentExifOverrides.value = { ...(state.exifOverrides || {}) }
  } else {
    currentExifOverrides.value = {}
  }

  currentExif.value = getMergedExifForFile(currentFile)
}

// 保存当前UI状态到当前图片
function saveCurrentImageState() {
  const currentFile = files.value[currentIndex.value]
  if (!currentFile) return

  const newImageStates = new Map(localImageStates.value)
  newImageStates.set(currentFile, {
    templateId: currentTemplateId.value,
    config: { ...currentConfig.value },
    exifOverrides: { ...currentExifOverrides.value }
  })
  emitImageStates(newImageStates)
}

function getMergedExifForFile(file: File, overrides?: Record<string, any>): Record<string, any> {
  const state = localImageStates.value.get(file)
  const baseExif = localExifCache.value.get(file)
  return mergeExifWithOverrides(baseExif, overrides ?? state?.exifOverrides)
}

function getEffectiveImageState(file: File): ImageState | undefined {
  const state = localImageStates.value.get(file)

  if (file === currentFile.value) {
    return {
      templateId: currentTemplateId.value,
      config: { ...currentConfig.value },
      exifOverrides: { ...currentExifOverrides.value }
    }
  }

  return state
}

function getConfigWithCustomLogo(file: File, config: Record<string, any>) {
  const exif = getMergedExifForFile(file)
  const brand = exif.Make?.trim()

  return {
    ...config,
    ...buildCustomLogoConfig(brand, props.customLogos)
  }
}

function updateCurrentExifOverrides(overrides: Record<string, any>) {
  currentExifOverrides.value = { ...overrides }
  currentExif.value = getMergedExifForFile(files.value[currentIndex.value], overrides)

  const currentFile = files.value[currentIndex.value]
  if (currentFile) {
    const newProcessedCache = new Map(localProcessedCache.value)
    const newPreviewUrls = new Map(localPreviewUrls.value)
    newProcessedCache.delete(currentFile)
    newPreviewUrls.delete(currentFile)
    emitProcessedCache(newProcessedCache)
    emitPreviewUrls(newPreviewUrls)
  }

  saveCurrentImageState()
}

// 监听索引变化
watch(currentIndex, () => {
  loadCurrentImageState()
})

watch(files, () => {
  if (files.value.length === 0) return
  loadCurrentImageState()
})

watch(
  () => {
    const currentFile = files.value[currentIndex.value]
    return currentFile ? localExifCache.value.get(currentFile) : null
  },
  () => {
    const currentFile = files.value[currentIndex.value]
    if (!currentFile) return
    currentExif.value = getMergedExifForFile(currentFile, currentExifOverrides.value)
  },
  { deep: true }
)

// 监听模板选择变化
watch(currentTemplateId, () => {
  const currentFile = files.value[currentIndex.value]
  if (currentFile) {
    const newProcessedCache = new Map(localProcessedCache.value)
    const newPreviewUrls = new Map(localPreviewUrls.value)
    newProcessedCache.delete(currentFile)
    newPreviewUrls.delete(currentFile)
    emitProcessedCache(newProcessedCache)
    emitPreviewUrls(newPreviewUrls)
  }
  saveCurrentImageState()
})

// 监听配置变化
watch(currentConfig, () => {
  const currentFile = files.value[currentIndex.value]
  if (currentFile) {
    const newProcessedCache = new Map(localProcessedCache.value)
    const newPreviewUrls = new Map(localPreviewUrls.value)
    newProcessedCache.delete(currentFile)
    newPreviewUrls.delete(currentFile)
    emitProcessedCache(newProcessedCache)
    emitPreviewUrls(newPreviewUrls)
  }
  saveCurrentImageState()

  // 同步配置到所有使用相同模板的其他图片
  const currentTemplateIdValue = currentTemplateId.value
  const newImageStates = new Map(localImageStates.value)
  const newProcessedCache = new Map(localProcessedCache.value)
  const newPreviewUrls = new Map(localPreviewUrls.value)

  files.value.forEach(file => {
    if (file === currentFile) return

    const state = newImageStates.get(file)
    if (state && state.templateId === currentTemplateIdValue) {
      newImageStates.set(file, {
        templateId: state.templateId,
        config: { ...currentConfig.value },
        exifOverrides: { ...(state.exifOverrides || {}) }
      })
      newProcessedCache.delete(file)
      newPreviewUrls.delete(file)
    }
  })

  emitImageStates(newImageStates)
  emitProcessedCache(newProcessedCache)
  emitPreviewUrls(newPreviewUrls)
}, { deep: true })

// 监听自定义Logo变化
const customLogos = computed({
  get: () => props.customLogos,
  set: (value) => emit('update:customLogos', value)
})

const dynamicBrandStats = computed(() => {
  const stats = new Map<string, number>()

  for (const file of files.value) {
    const exif = getMergedExifForFile(file)
    const brand = exif.Make?.trim()
    if (brand) {
      stats.set(brand, (stats.get(brand) || 0) + 1)
    }
  }

  return stats
})

const dynamicNoBrandCount = computed(() => {
  let count = 0

  for (const file of files.value) {
    const exif = getMergedExifForFile(file)
    if (!exif.Make?.trim()) {
      count++
    }
  }

  return count
})

// 处理模板选择
function handleTemplateSelect(id: string) {
  currentTemplateId.value = id
  currentConfig.value = {}
}

async function handleAppendFiles(newFiles: File[]) {
  if (newFiles.length === 0) return

  const nextImageStates = new Map(localImageStates.value)
  const nextExifCache = new Map(localExifCache.value)

  for (const file of newFiles) {
    nextImageStates.set(file, {
      templateId: 'noProcess',
      config: {},
      exifOverrides: {}
    })
  }

  files.value = [...files.value, ...newFiles]
  emitImageStates(nextImageStates)

  for (const file of newFiles) {
    try {
      const exif = await readExif(file)
      nextExifCache.set(file, exif)
    } catch (error) {
      console.error('Failed to read EXIF for appended file:', error)
      nextExifCache.set(file, {})
    }
  }

  localExifCache.value = nextExifCache
  emitImageStates(nextImageStates)
}

function handleRemoveFile(index: number) {
  const fileToRemove = files.value[index]
  if (!fileToRemove) return

  const previousIndex = currentIndex.value
  const nextFiles = files.value.filter((_, fileIndex) => fileIndex !== index)
  const nextImageStates = new Map(localImageStates.value)
  const nextProcessedCache = new Map(localProcessedCache.value)
  const nextPreviewUrls = new Map(localPreviewUrls.value)
  const nextExifCache = new Map(localExifCache.value)

  nextImageStates.delete(fileToRemove)
  nextProcessedCache.delete(fileToRemove)
  nextPreviewUrls.delete(fileToRemove)
  nextExifCache.delete(fileToRemove)

  files.value = nextFiles
  localExifCache.value = nextExifCache
  emitImageStates(nextImageStates)
  emitProcessedCache(nextProcessedCache)
  emitPreviewUrls(nextPreviewUrls)

  if (nextFiles.length === 0) {
    emit('reset', true)
    return
  }

  if (index < previousIndex) {
    currentIndex.value = previousIndex - 1
  } else if (index === previousIndex) {
    currentIndex.value = Math.min(index, nextFiles.length - 1)
  }

  loadCurrentImageState()
}

// 处理Logo上传成功
async function handleLogoUploaded(brand: string, updatedLogos: Map<string, string>) {
  const brandName = brand || '无品牌'
  const filesToReprocess: File[] = []

  console.log('[EditorPage] logoUploaded event received', {
    brand,
    updatedLogoKeys: Array.from(updatedLogos.keys()),
    fileCount: files.value.length
  })

  for (const file of files.value) {
    const state = getEffectiveImageState(file)
    const exif = getMergedExifForFile(file)
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

  console.log('[EditorPage] files matched for reprocess', filesToReprocess.map(file => {
    const exif = getMergedExifForFile(file)
    return {
      name: file.name,
      exifBrand: exif?.Make?.trim(),
      templateId: getEffectiveImageState(file)?.templateId
    }
  }))

  if (filesToReprocess.length === 0) {
    success(`${brandName} Logo 已更新`)
    return
  }

  success(`${brandName} Logo 已更新，正在重新处理 ${filesToReprocess.length} 张图片...`)

  try {
    let processedCount = 0
    const newProcessedCache = new Map(localProcessedCache.value)
    const newPreviewUrls = new Map(localPreviewUrls.value)

    for (const file of filesToReprocess) {
      const state = getEffectiveImageState(file)
      if (!state) continue

      const template = templates.value.find(t => t.id === state.templateId)
      if (!template) continue

      const exif = getMergedExifForFile(file)
      const fileBrand = exif?.Make?.trim()
      const configWithLogo = {
        ...state.config,
        ...buildCustomLogoConfig(fileBrand, updatedLogos)
      }

      console.log('[EditorPage] reprocessing file with logo config', {
        file: file.name,
        fileBrand,
        customLogoUrl: configWithLogo.customLogoUrl?.slice?.(0, 48),
        customDefaultLogoUrl: configWithLogo.customDefaultLogoUrl?.slice?.(0, 48)
      })

      try {
        const canvas = await processImage(file, template.processors, configWithLogo, state.exifOverrides)
        const blob = await canvasToBlob(canvas)

        newProcessedCache.set(file, { canvas, blob })
        const previewUrl = canvas.toDataURL('image/jpeg', 0.8)
        newPreviewUrls.set(file, previewUrl)

        processedCount++
      } catch (error) {
        console.error(`Failed to reprocess ${file.name}:`, error)
      }
    }

    emitProcessedCache(newProcessedCache)
    emitPreviewUrls(newPreviewUrls)

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
    message: `确定要将当前模板应用到全部 ${files.value.length} 张图片吗？`,
    confirmText: '应用',
    cancelText: '取消'
  })

  if (!confirmed) return

  const newImageStates = new Map(localImageStates.value)
  files.value.forEach(file => {
    const state = getEffectiveImageState(file)
    newImageStates.set(file, {
      templateId: currentTemplateId.value,
      config: { ...currentConfig.value },
      exifOverrides: { ...(state?.exifOverrides || {}) }
    })
  })
  emitImageStates(newImageStates)

  if (currentTemplateId.value === 'noProcess') {
    emitProcessedCache(new Map())
    emitPreviewUrls(new Map())
    success('已应用到所有图片！')
    return
  }

  try {
    const results = await processBatch(
      files.value,
      currentTemplate.value.processors,
      currentConfig.value,
      (file) => {
        return {
          config: getConfigWithCustomLogo(file, currentConfig.value),
          exifOverride: getEffectiveImageState(file)?.exifOverrides
        }
      }
    )

    const newProcessedCache = new Map(localProcessedCache.value)
    const newPreviewUrls = new Map(localPreviewUrls.value)

    results.forEach(result => {
      newProcessedCache.set(result.file, {
        canvas: result.canvas,
        blob: result.blob
      })

      const previewUrl = result.canvas.toDataURL('image/jpeg', 0.8)
      newPreviewUrls.set(result.file, previewUrl)
    })

    emitProcessedCache(newProcessedCache)
    emitPreviewUrls(newPreviewUrls)

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

  const newImageStates = new Map(localImageStates.value)
  selectedFiles.forEach(file => {
    const state = getEffectiveImageState(file)
    newImageStates.set(file, {
      templateId: currentTemplateId.value,
      config: { ...currentConfig.value },
      exifOverrides: { ...(state?.exifOverrides || {}) }
    })
  })
  emitImageStates(newImageStates)

  if (currentTemplateId.value === 'noProcess') {
    const newProcessedCache = new Map(localProcessedCache.value)
    const newPreviewUrls = new Map(localPreviewUrls.value)
    selectedFiles.forEach(file => {
      newProcessedCache.delete(file)
      newPreviewUrls.delete(file)
    })
    emitProcessedCache(newProcessedCache)
    emitPreviewUrls(newPreviewUrls)
    success('已应用到选中的图片！')
    return
  }

  try {
    const results = await processBatch(
      selectedFiles,
      currentTemplate.value.processors,
      currentConfig.value,
      (file) => {
        return {
          config: getConfigWithCustomLogo(file, currentConfig.value),
          exifOverride: getEffectiveImageState(file)?.exifOverrides
        }
      }
    )

    const newProcessedCache = new Map(localProcessedCache.value)
    const newPreviewUrls = new Map(localPreviewUrls.value)

    results.forEach(result => {
      newProcessedCache.set(result.file, {
        canvas: result.canvas,
        blob: result.blob
      })

      const previewUrl = result.canvas.toDataURL('image/jpeg', 0.8)
      newPreviewUrls.set(result.file, previewUrl)
    })

    emitProcessedCache(newProcessedCache)
    emitPreviewUrls(newPreviewUrls)

    success(`处理完成！已应用到 ${selectedFiles.length} 张图片。`)
  } catch (error) {
    console.error('Processing error:', error)
    showError('处理失败，请重试')
  }
}

// 下载当前图片
async function downloadCurrent() {
  try {
    const activeFile = currentFile.value
    if (!activeFile) return
    const state = getEffectiveImageState(activeFile)
    if (!state) return

    let blob: Blob

    const cached = activeFile === currentFile.value ? undefined : localProcessedCache.value.get(activeFile)
    if (cached) {
      blob = cached.blob
    } else {
      const template = templates.value.find(t => t.id === state.templateId)
      if (!template) return

      const configWithLogo = getConfigWithCustomLogo(activeFile, state.config)

      const canvas = await processImage(
        activeFile,
        template.processors,
        configWithLogo,
        state.exifOverrides
      )
      blob = await canvasToBlob(canvas)

      const newProcessedCache = new Map(localProcessedCache.value)
      newProcessedCache.set(activeFile, { canvas, blob })
      emitProcessedCache(newProcessedCache)
    }

    await downloadImages([{
      blob,
      name: activeFile.name
    }])

    success('导出成功！')
  } catch (error) {
    console.error('Download error:', error)
    showError('导出失败，请重试')
  }
}

// 下载全部图片
async function downloadAll() {
  if (files.value.length === 0) return

  try {
    downloading.value = true
    const results = []
    let skippedCount = 0
    let processedCount = 0

    const totalToProcess = files.value.filter(file => {
      const state = localImageStates.value.get(file)
      return state && state.templateId !== 'noProcess'
    }).length

    downloadProgress.value = { current: 0, total: totalToProcess, percent: 0 }

    const newProcessedCache = new Map(localProcessedCache.value)

    for (let i = 0; i < files.value.length; i++) {
      const file = files.value[i]
      const state = getEffectiveImageState(file)
      if (!state) continue

      if (state.templateId === 'noProcess') {
        skippedCount++
        continue
      }

      let blob: Blob

      const cached = file === currentFile.value ? undefined : newProcessedCache.get(file)
      if (cached) {
        blob = cached.blob
      } else {
        const template = templates.value.find(t => t.id === state.templateId)
        if (!template) continue

        const configWithLogo = getConfigWithCustomLogo(file, state.config)

        const canvas = await processImage(
          file,
          template.processors,
          configWithLogo,
          state.exifOverrides
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

    emitProcessedCache(newProcessedCache)

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
