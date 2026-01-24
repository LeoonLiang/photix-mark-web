<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <header class="glass-effect border-b border-slate-200/50 h-16 flex items-center px-6 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 class="font-bold text-lg text-slate-800 tracking-tight">Photix Mark Web</h1>
          <p class="text-xs text-slate-400">v1.0.0</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-4 h-[calc(100vh-64px)]">
      <div class="grid grid-cols-12 gap-4 h-full">
        <!-- Left: Preview Area (70%) -->
        <div class="col-span-12 lg:col-span-8 h-full">
          <Card class="h-full flex flex-col bg-white/80 backdrop-blur shadow-lg">
            <CardHeader class="border-b bg-gradient-to-r from-slate-50 to-white py-3">
              <CardTitle class="text-lg">预览区</CardTitle>
            </CardHeader>
            <CardContent class="flex-1 p-4 overflow-hidden">
              <ClientOnly>
                <ImagePreview
                  :files="uploadedFiles"
                  :current-index="currentIndex"
                  :preview-mode="previewMode"
                  :processors="selectedTemplate.processors"
                  :user-config="userConfig"
                  @update:current-index="currentIndex = $event"
                  @update:preview-mode="previewMode = $event"
                />
                <template #fallback>
                  <div class="h-full flex items-center justify-center">
                    <div class="text-center text-muted-foreground">
                      <svg class="animate-spin w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <p>加载中...</p>
                    </div>
                  </div>
                </template>
              </ClientOnly>
            </CardContent>
          </Card>
        </div>

        <!-- Right: Control Panel (30%) -->
        <div class="col-span-12 lg:col-span-4 h-full overflow-y-auto space-y-4">
          <!-- Upload Section -->
          <Card class="bg-white/80 backdrop-blur shadow-lg animate-fade-in">
            <CardHeader class="border-b bg-gradient-to-r from-slate-50 to-white flex-row items-center justify-between py-3">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <CardTitle class="text-base">上传图片</CardTitle>
              </div>
              <Badge v-if="uploadedFiles.length > 0" variant="secondary">
                {{ uploadedFiles.length }} 张
              </Badge>
            </CardHeader>
            <CardContent>
              <ImageUploader @upload="handleUpload" />

              <!-- Uploaded Files List -->
              <div v-if="uploadedFiles.length > 0" class="mt-4">
                <p class="text-sm font-medium text-muted-foreground mb-2">已上传文件</p>
                <div class="space-y-1 max-h-32 overflow-y-auto">
                  <div
                    v-for="(file, index) in uploadedFiles"
                    :key="index"
                    class="text-xs text-muted-foreground truncate px-2 py-1.5 hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                  >
                    <svg class="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="truncate">{{ file.name }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Template Selection -->
          <Card class="bg-white/80 backdrop-blur shadow-lg animate-fade-in">
            <CardHeader class="border-b bg-gradient-to-r from-slate-50 to-white py-3">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <CardTitle class="text-base">模板选择</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <TemplateSelector
                :templates="templates"
                :selected-id="selectedTemplate.id"
                @select="handleTemplateSelect"
              />
            </CardContent>
          </Card>

          <!-- Template Configuration -->
          <Card class="bg-white/80 backdrop-blur shadow-lg animate-fade-in">
            <CardHeader class="border-b bg-gradient-to-r from-slate-50 to-white py-3">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <CardTitle class="text-base">模板配置</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <TemplateConfig
                :template="selectedTemplate"
                v-model="userConfig"
              />
            </CardContent>
          </Card>

          <!-- Process Button -->
          <Button
            @click="handleProcess"
            :disabled="uploadedFiles.length === 0 || processing"
            class="w-full h-12 text-base shadow-lg"
            size="lg"
          >
            <svg v-if="!processing" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ processing ? '处理中...' : '开始处理' }}
          </Button>
        </div>
      </div>
    </main>

    <!-- Processing Progress Modal -->
    <ProcessingProgress
      v-if="processing"
      :progress="progress"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTemplates } from '~/composables/useTemplates'
import { useBatchProcessor } from '~/composables/useBatchProcessor'
import { downloadImages } from '~/utils/download'
import { initProcessors } from '~/lib/processors'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Badge from '~/components/ui/Badge.vue'

// 禁用 SSR，避免 hydration 警告
definePageMeta({
  ssr: false
})

// 初始化处理器
onMounted(() => {
  initProcessors()
})

// 模板管理
const { templates, selectedTemplate, selectTemplate } = useTemplates()

// 上传的文件
const uploadedFiles = ref<File[]>([])

// 当前预览索引
const currentIndex = ref(0)

// 预览模式：'grid' | 'carousel'
const previewMode = ref<'grid' | 'carousel'>('grid')

// 用户配置
const userConfig = ref({})

// 批量处理
const { processBatch, processing, progress } = useBatchProcessor()

// 处理上传
function handleUpload(files: File[]) {
  uploadedFiles.value = files
  currentIndex.value = 0
}

// 处理模板选择
function handleTemplateSelect(id: string) {
  selectTemplate(id)
}

// 处理图片
async function handleProcess() {
  if (uploadedFiles.value.length === 0) return

  try {
    // 批量处理
    const results = await processBatch(
      uploadedFiles.value,
      selectedTemplate.value.processors,
      userConfig.value
    )

    // 下载结果
    await downloadImages(results)

    alert(`成功处理 ${results.length} 张图片！`)
  } catch (error) {
    console.error('Processing error:', error)
    alert('处理失败，请查看控制台')
  }
}
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
