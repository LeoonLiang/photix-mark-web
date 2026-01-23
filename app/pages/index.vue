<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Photix Mark Web</h1>
          <p class="text-sm text-gray-500">纯前端图片水印批量处理工具</p>
        </div>
        <div class="text-sm text-gray-500">v1.0.0</div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex h-[calc(100vh-80px)]">
      <!-- Left: Preview Area (70%) -->
      <div class="w-[70%] p-6 bg-white border-r border-gray-200">
        <ImagePreview
          :files="uploadedFiles"
          :current-index="currentIndex"
          :preview-mode="previewMode"
          @update:current-index="currentIndex = $event"
          @update:preview-mode="previewMode = $event"
        />
      </div>

      <!-- Right: Control Panel (30%) -->
      <div class="w-[30%] p-6 overflow-y-auto">
        <!-- Upload Section -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-3 flex items-center">
            <span class="mr-2">📁</span>
            上传图片
          </h2>
          <ImageUploader @upload="handleUpload" />

          <!-- Uploaded Files List -->
          <div v-if="uploadedFiles.length > 0" class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">
              📋 已上传 ({{ uploadedFiles.length }})
            </h3>
            <div class="space-y-1 max-h-32 overflow-y-auto">
              <div
                v-for="(file, index) in uploadedFiles"
                :key="index"
                class="text-sm text-gray-600 truncate px-2 py-1 hover:bg-gray-50 rounded"
              >
                ✓ {{ file.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Template Selection -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-3 flex items-center">
            <span class="mr-2">🎨</span>
            模板选择
          </h2>
          <TemplateSelector
            :templates="templates"
            :selected-id="selectedTemplate.id"
            @select="handleTemplateSelect"
          />
        </div>

        <!-- Template Configuration -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-3 flex items-center">
            <span class="mr-2">⚙️</span>
            模板配置
          </h2>
          <TemplateConfig
            :template="selectedTemplate"
            v-model="userConfig"
          />
        </div>

        <!-- Process Button -->
        <div class="mt-6">
          <button
            @click="handleProcess"
            :disabled="uploadedFiles.length === 0 || processing"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {{ processing ? '处理中...' : '开始处理' }}
          </button>
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
