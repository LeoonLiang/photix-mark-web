<template>
  <!-- 未上传状态：欢迎页 -->
  <div v-if="uploadedFiles.length === 0" class="relative min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img src="/demo.jpg" alt="Showcase" class="w-full h-full object-cover blur-sm opacity-20">
      <div class="absolute inset-0 bg-background/50"></div>
    </div>
    
    <div class="relative z-10 max-w-2xl w-full bg-background/50 backdrop-blur-md p-8 rounded-2xl border border-border animate-fade-in-up">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-gradient-to-br from-primary to-amber-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-2xl shadow-primary/20">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="text-5xl font-bold text-foreground mb-2">Photix Mark</h1>
        <p class="text-lg text-muted-foreground">为你的摄影作品，优雅地附上专属水印与参数。</p>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="text-center p-4">
          <div class="w-12 h-12 bg-card/80 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p class="text-sm text-foreground font-medium">隐私安全</p>
          <p class="text-xs text-muted-foreground">本地处理</p>
        </div>
        <div class="text-center p-4">
          <div class="w-12 h-12 bg-card/80 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p class="text-sm text-foreground font-medium">批量处理</p>
          <p class="text-xs text-muted-foreground">一键添加水印</p>
        </div>
        <div class="text-center p-4">
          <div class="w-12 h-12 bg-card/80 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <p class="text-sm text-foreground font-medium">实时预览</p>
          <p class="text-xs text-muted-foreground">即时查看效果</p>
        </div>
      </div>

      <!-- Upload Card -->
      <Card class="bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/10">
            <ImageUploader @upload="handleUpload" />
      </Card>
    </div>
  </div>

  <!-- 已上传状态：编辑器 -->
  <div v-else class="h-screen flex flex-col bg-background overflow-hidden">
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
          <p class="text-xs text-muted-foreground">{{ uploadedFiles.length }} 张图片</p>
        </div>
      </div>

      <div class="ml-auto">
        <Button @click="resetApp" variant="outline" size="sm">
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
      <button @click="resetApp" class="p-2 hover:bg-muted rounded-lg transition-colors">
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
                :files="uploadedFiles"
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
          <Card v-if="uploadedFiles.length > 0" class="bg-card/80 backdrop-blur-xl shadow-lg shadow-primary/5">
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
              :files="uploadedFiles"
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
  </div>

  <!-- Processing Progress Modal -->
  <ProcessingProgress
    v-if="processing || downloading"
    :progress="processing ? progress : downloadProgress"
  />

  <!-- Image Selector Modal -->
  <ImageSelector
    v-if="showImageSelector"
    :files="uploadedFiles"
    @close="showImageSelector = false"
    @confirm="handleApplyToSelected"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed, defineComponent } from 'vue'
import { useTemplates } from '~/composables/useTemplates'
import { useBatchProcessor } from '~/composables/useBatchProcessor'
import { useImageProcessor } from '~/composables/useImageProcessor'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useExif } from '~/composables/useExif'
import { downloadImages } from '~/utils/download'
import { canvasToBlob } from '~/utils/canvas'
import { initProcessors } from '~/lib/processors'
import type { TemplateConfig } from '~/lib/templates/types'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'
import ImageSelector from '~/components/ImageSelector.vue'
import BrandLogoManager from '~/components/BrandLogoManager.vue'

// Toast notifications
const { success, error: showError, info } = useToast()

// Confirm dialog
const { confirm } = useConfirm()

// EXIF 读取
const { readExif } = useExif()

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

// 模板管理
const { templates } = useTemplates()

// 上传的文件
const uploadedFiles = ref<File[]>([])

// 当前预览索引
const currentIndex = ref(0)

// 每张图片的独立状态（模板 + 配置）
const imageStates = ref<Map<File, ImageState>>(new Map())

// 处理结果缓存（用于下载时避免重复处理）
const processedCache = ref<Map<File, ProcessedResult>>(new Map())

// 预览URL缓存（用于快速切换显示）
const previewUrls = ref<Map<File, string>>(new Map())

// EXIF 数据缓存
const exifCache = ref<Map<File, Record<string, any>>>(new Map())

// 当前图片的 EXIF（用于显示）
const currentExif = ref<Record<string, any>>({})

// 品牌统计和Logo管理
const brandStats = ref<Map<string, number>>(new Map())  // 品牌名 -> 图片数量
const noBrandCount = ref(0)  // 没有品牌信息的图片数量
const customLogos = ref<Map<string, string>>(new Map())  // 品牌名 -> 自定义Logo的DataURL

// 当前图片的模板ID（用于UI绑定）
const currentTemplateId = ref('noProcess')

// 当前图片的配置（用于UI绑定）
const currentConfig = ref<Record<string, any>>({})

// 根据ID获取模板对象
const currentTemplate = computed<TemplateConfig>(() => {
  return templates.value.find(t => t.id === currentTemplateId.value) || templates.value[0]
})

// 批量处理
const { processBatch, processing, progress } = useBatchProcessor()
const { processImage } = useImageProcessor()

// 获取Logo URL（优先自定义Logo）
function getLogoUrl(brand: string | undefined): string | undefined {
  // 1. 如果有品牌，检查该品牌的自定义Logo
  if (brand && brand.trim()) {
    const trimmedBrand = brand.trim()
    if (customLogos.value.has(trimmedBrand)) {
      return customLogos.value.get(trimmedBrand)
    }
  }

  // 2. 如果没有品牌或没有该品牌的自定义Logo，检查默认Logo
  if (customLogos.value.has('')) {
    return customLogos.value.get('')
  }

  // 3. 返回 undefined，让 watermark 处理器使用系统默认逻辑
  return undefined
}

// 下载进度（独立于批量处理进度）
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

// 处理上传 - 为每张图片初始化默认状态
async function handleUpload(files: File[]) {
  uploadedFiles.value = files
  currentIndex.value = 0

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

  // 加载第一张图片的状态
  loadCurrentImageState()
}

// 加载当前图片的状态到UI
function loadCurrentImageState() {
  const currentFile = uploadedFiles.value[currentIndex.value]
  if (!currentFile) return

  const state = imageStates.value.get(currentFile)
  if (state) {
    // 只有当状态真的不同时才更新（避免触发不必要的 watch）
    if (currentTemplateId.value !== state.templateId) {
      currentTemplateId.value = state.templateId
    }
    if (JSON.stringify(currentConfig.value) !== JSON.stringify(state.config)) {
      currentConfig.value = { ...state.config }
    }
  }

  // 加载当前图片的 EXIF
  const exif = exifCache.value.get(currentFile)
  if (exif) {
    currentExif.value = exif
  } else {
    currentExif.value = {}
  }
}

// 保存当前UI状态到当前图片
function saveCurrentImageState() {
  const currentFile = uploadedFiles.value[currentIndex.value]
  if (!currentFile) return

  imageStates.value.set(currentFile, {
    templateId: currentTemplateId.value,
    config: { ...currentConfig.value }
  })
}

// 监听索引变化，切换图片时加载该图片的状态
watch(currentIndex, () => {
  loadCurrentImageState()
})

// 监听模板选择变化，保存到当前图片状态
watch(currentTemplateId, () => {
  const currentFile = uploadedFiles.value[currentIndex.value]
  if (currentFile) {
    // 模板变化，清除该图片的缓存
    processedCache.value.delete(currentFile)
    previewUrls.value.delete(currentFile)
  }
  saveCurrentImageState()
})

// 监听配置变化，保存到当前图片状态
watch(currentConfig, () => {
  const currentFile = uploadedFiles.value[currentIndex.value]
  if (currentFile) {
    // 配置变化，清除该图片的缓存
    processedCache.value.delete(currentFile)
    previewUrls.value.delete(currentFile)
  }
  saveCurrentImageState()

  // 🔧 修复：同步配置到所有使用相同模板的其他图片
  const currentTemplateIdValue = currentTemplateId.value
  uploadedFiles.value.forEach(file => {
    if (file === currentFile) return // 跳过当前图片（已保存）

    const state = imageStates.value.get(file)
    if (state && state.templateId === currentTemplateIdValue) {
      // 相同模板的图片，同步配置
      imageStates.value.set(file, {
        templateId: state.templateId,
        config: { ...currentConfig.value }
      })
      // 清除缓存，下次切换时会重新生成
      processedCache.value.delete(file)
      previewUrls.value.delete(file)
    }
  })
}, { deep: true })

// 监听自定义Logo变化，触发预览更新
watch(customLogos, () => {
  // Logo变化时，触发当前图片预览的微小变化，让 ImageCarousel 重新生成预览
  // 注意：不在这里清除缓存，因为 handleLogoUploaded 会处理重新生成
  currentConfig.value = { ...currentConfig.value, _logoUpdateTrigger: Date.now() }
}, { deep: true })

// 处理Logo上传成功
async function handleLogoUploaded(brand: string) {
  const brandName = brand || '无品牌'

  // 找出所有需要重新处理的图片
  const filesToReprocess: File[] = []

  for (const file of uploadedFiles.value) {
    const state = imageStates.value.get(file)
    const exif = exifCache.value.get(file)
    const fileBrand = exif?.Make?.trim()

    // 跳过未处理的图片
    if (!state || state.templateId === 'noProcess') {
      continue
    }

    // 检查是否匹配该品牌
    if (brand === '') {
      // 默认Logo：匹配无品牌的图片
      if (!fileBrand) {
        filesToReprocess.push(file)
      }
    } else {
      // 特定品牌Logo：匹配该品牌的图片
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

  // 逐个重新处理这些图片（因为每个图片可能用不同模板）
  try {
    let processedCount = 0

    for (const file of filesToReprocess) {
      const state = imageStates.value.get(file)
      if (!state) continue

      const template = templates.value.find(t => t.id === state.templateId)
      if (!template) continue

      // 获取自定义Logo配置
      const exif = exifCache.value.get(file)
      const fileBrand = exif?.Make?.trim()

      const configWithLogo = {
        ...state.config,
        customLogoUrl: fileBrand && customLogos.value.has(fileBrand) ? customLogos.value.get(fileBrand) : undefined,
        customDefaultLogoUrl: customLogos.value.get('')
      }

      try {
        const canvas = await processImage(file, template.processors, configWithLogo)
        const blob = await canvasToBlob(canvas)

        // 更新缓存
        processedCache.value.set(file, { canvas, blob })

        // 生成预览 URL
        const previewUrl = canvas.toDataURL('image/jpeg', 0.8)
        previewUrls.value.set(file, previewUrl)

        processedCount++
      } catch (error) {
        console.error(`Failed to reprocess ${file.name}:`, error)
      }
    }

    success(`${brandName} Logo 已应用到 ${processedCount} 张图片`)
  } catch (error) {
    console.error('Reprocess error:', error)
    showError('重新处理失败，请重试')
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
    currentIndex.value = 0
    imageStates.value.clear()
    processedCache.value.clear()
    previewUrls.value.clear()
    exifCache.value.clear()
    brandStats.value.clear()
    noBrandCount.value = 0
    customLogos.value.clear()
    currentTemplateId.value = 'noProcess'
    currentConfig.value = {}
    currentExif.value = {}
  }
}

// 处理模板选择
function handleTemplateSelect(id: string) {
  currentTemplateId.value = id
  // 切换模板时重置配置
  currentConfig.value = {}
}

// 应用到所有图片 - 将当前模板和配置应用到所有图片并立即批量处理
async function applyToAll() {
  const confirmed = await confirm({
    title: '应用到全部图片',
    message: `确定要将当前模板应用到全部 ${uploadedFiles.value.length} 张图片吗？`,
    confirmText: '应用',
    cancelText: '取消'
  })

  if (!confirmed) {
    return
  }

  // 1. 将当前状态应用到所有图片
  uploadedFiles.value.forEach(file => {
    imageStates.value.set(file, {
      templateId: currentTemplateId.value,
      config: { ...currentConfig.value }
    })
  })

  // 2. 如果是"不处理"模板，清除所有处理缓存
  if (currentTemplateId.value === 'noProcess') {
    processedCache.value.clear()
    previewUrls.value.clear()
    success('已应用到所有图片！')
    return
  }

  // 3. 批量处理所有图片并缓存结果
  try {
    const results = await processBatch(
      uploadedFiles.value,
      currentTemplate.value.processors,
      currentConfig.value,
      (file) => {
        // 为每个文件提供自定义Logo配置
        const exif = exifCache.value.get(file)
        const brand = exif?.Make?.trim()

        return {
          // 品牌Logo：仅返回该品牌的自定义Logo（不含默认）
          customLogoUrl: brand && customLogos.value.has(brand) ? customLogos.value.get(brand) : undefined,
          // 默认Logo：用于无品牌时
          customDefaultLogoUrl: customLogos.value.get('')
        }
      }
    )

    // 缓存处理结果和预览URL
    results.forEach(result => {
      processedCache.value.set(result.file, {
        canvas: result.canvas,
        blob: result.blob
      })

      // 生成预览 URL（Data URL）
      const previewUrl = result.canvas.toDataURL('image/jpeg', 0.8)
      previewUrls.value.set(result.file, previewUrl)
    })

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

  if (!confirmed) {
    return
  }

  // 1. 将当前状态应用到选中的图片
  selectedFiles.forEach(file => {
    imageStates.value.set(file, {
      templateId: currentTemplateId.value,
      config: { ...currentConfig.value }
    })
  })

  // 2. 如果是"不处理"模板，清除选中图片的处理缓存
  if (currentTemplateId.value === 'noProcess') {
    selectedFiles.forEach(file => {
      processedCache.value.delete(file)
      previewUrls.value.delete(file)
    })
    success('已应用到选中的图片！')
    return
  }

  // 3. 批量处理选中的图片并缓存结果
  try {
    const results = await processBatch(
      selectedFiles,
      currentTemplate.value.processors,
      currentConfig.value,
      (file) => {
        // 为每个文件提供自定义Logo配置
        const exif = exifCache.value.get(file)
        const brand = exif?.Make?.trim()

        return {
          customLogoUrl: brand && customLogos.value.has(brand) ? customLogos.value.get(brand) : undefined,
          customDefaultLogoUrl: customLogos.value.get('')
        }
      }
    )

    // 缓存处理结果和预览URL
    results.forEach(result => {
      processedCache.value.set(result.file, {
        canvas: result.canvas,
        blob: result.blob
      })

      // 生成预览 URL（Data URL）
      const previewUrl = result.canvas.toDataURL('image/jpeg', 0.8)
      previewUrls.value.set(result.file, previewUrl)
    })

    success(`处理完成！已应用到 ${selectedFiles.length} 张图片。`)
  } catch (error) {
    console.error('Processing error:', error)
    showError('处理失败，请重试')
  }
}

// 下载当前图片
async function downloadCurrent() {
  try {
    const currentFile = uploadedFiles.value[currentIndex.value]
    const state = imageStates.value.get(currentFile)
    if (!state) return

    let blob: Blob

    // 优先使用缓存
    const cached = processedCache.value.get(currentFile)
    if (cached) {
      blob = cached.blob
    } else {
      // 没有缓存则重新处理
      const template = templates.value.find(t => t.id === state.templateId)
      if (!template) return

      // 获取自定义Logo配置
      const exif = exifCache.value.get(currentFile)
      const brand = exif?.Make?.trim()

      const configWithLogo = {
        ...state.config,
        customLogoUrl: brand && customLogos.value.has(brand) ? customLogos.value.get(brand) : undefined,
        customDefaultLogoUrl: customLogos.value.get('')
      }

      const canvas = await processImage(
        currentFile,
        template.processors,
        configWithLogo
      )
      blob = await canvasToBlob(canvas)

      // 缓存结果
      processedCache.value.set(currentFile, { canvas, blob })
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
  if (uploadedFiles.value.length === 0) return

  try {
    downloading.value = true
    const results = []
    let skippedCount = 0
    let processedCount = 0

    // 计算需要处理的图片总数（排除 noProcess）
    const totalToProcess = uploadedFiles.value.filter(file => {
      const state = imageStates.value.get(file)
      return state && state.templateId !== 'noProcess'
    }).length

    downloadProgress.value = { current: 0, total: totalToProcess, percent: 0 }

    for (let i = 0; i < uploadedFiles.value.length; i++) {
      const file = uploadedFiles.value[i]
      const state = imageStates.value.get(file)
      if (!state) continue

      // 跳过未处理的图片
      if (state.templateId === 'noProcess') {
        skippedCount++
        continue
      }

      let blob: Blob

      // 优先使用缓存
      const cached = processedCache.value.get(file)
      if (cached) {
        blob = cached.blob
      } else {
        // 没有缓存则重新处理
        const template = templates.value.find(t => t.id === state.templateId)
        if (!template) continue

        // 获取自定义Logo配置
        const exif = exifCache.value.get(file)
        const brand = exif?.Make?.trim()

        const configWithLogo = {
          ...state.config,
          customLogoUrl: brand && customLogos.value.has(brand) ? customLogos.value.get(brand) : undefined,
          customDefaultLogoUrl: customLogos.value.get('')
        }

        const canvas = await processImage(
          file,
          template.processors,
          configWithLogo
        )
        blob = await canvasToBlob(canvas)

        // 缓存结果
        processedCache.value.set(file, { canvas, blob })
      }

      results.push({ blob, name: file.name })
      processedCount++

      // 更新进度
      downloadProgress.value = {
        current: processedCount,
        total: totalToProcess,
        percent: totalToProcess > 0 ? Math.round((processedCount / totalToProcess) * 100) : 0
      }
    }

    // 如果没有已处理的图片，提示用户
    if (results.length === 0) {
      showError('没有已处理的图片可以导出')
      return
    }

    await downloadImages(results)

    // 根据是否跳过图片显示不同的成功消息
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

