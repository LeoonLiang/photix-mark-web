<template>
  <!-- 欢迎页 -->
  <div class="relative min-h-screen bg-background overflow-y-auto">
    <!-- Background Image -->
    <div class="fixed inset-0 z-0">
      <img src="/demo.jpg" alt="Showcase" class="w-full h-full object-cover blur-sm opacity-20">
      <div class="absolute inset-0 bg-background/50"></div>
    </div>

    <!-- Hero Section -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
      <div class="max-w-2xl w-full bg-background/50 backdrop-blur-md p-4 md:p-8 rounded-2xl border border-border animate-fade-in-up">
        <!-- Logo & Title -->
        <div class="text-center mb-4 md:mb-8">
          <div class="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-primary to-amber-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-2 md:mb-4 shadow-2xl shadow-primary/20">
            <svg class="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-2xl md:text-5xl font-bold text-foreground mb-1 md:mb-2">Photix Mark</h1>
          <p class="text-sm md:text-lg text-muted-foreground mb-2 md:mb-4">为你的摄影作品，优雅地附上专属水印与参数</p>
          <p class="text-xs md:text-sm text-muted-foreground/80 hidden md:block">相机水印包含相机品牌 / 型号 / 拍摄时间 / 光圈 / 快门 / ISO 等信息</p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-8">
          <div class="text-center p-2 md:p-4 bg-card/50 rounded-lg border border-border/50">
            <div class="w-8 h-8 md:w-12 md:h-12 bg-card/80 rounded-lg flex items-center justify-center mx-auto mb-1 md:mb-3">
              <svg class="w-4 h-4 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p class="text-xs md:text-sm text-foreground font-medium mb-0.5 md:mb-1">隐私安全</p>
            <p class="text-xs text-muted-foreground hidden md:block">本地处理，数据不上传</p>
          </div>
          <div class="text-center p-2 md:p-4 bg-card/50 rounded-lg border border-border/50">
            <div class="w-8 h-8 md:w-12 md:h-12 bg-card/80 rounded-lg flex items-center justify-center mx-auto mb-1 md:mb-3">
              <svg class="w-4 h-4 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p class="text-xs md:text-sm text-foreground font-medium mb-0.5 md:mb-1">批量处理</p>
            <p class="text-xs text-muted-foreground hidden md:block">一次处理多张图片</p>
          </div>
          <div class="text-center p-2 md:p-4 bg-card/50 rounded-lg border border-border/50">
            <div class="w-8 h-8 md:w-12 md:h-12 bg-card/80 rounded-lg flex items-center justify-center mx-auto mb-1 md:mb-3">
              <svg class="w-4 h-4 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <p class="text-xs md:text-sm text-foreground font-medium mb-0.5 md:mb-1">实时预览</p>
            <p class="text-xs text-muted-foreground hidden md:block">即时查看水印效果</p>
          </div>
        </div>

        <!-- Upload Card -->
        <Card class="bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/10">
          <ImageUploader @upload="handleUpload" />
        </Card>

        <!-- Additional Info -->
        <div class="mt-4 md:mt-6 text-center hidden md:block">
          <p class="text-xs text-muted-foreground">
            支持佳能、尼康、索尼、富士等主流相机品牌，以及 iPhone、华为、小米等手机
          </p>
        </div>
      </div>

      <!-- Scroll Down Indicator -->
      <div class="absolute bottom-8 inset-x-0 flex justify-center animate-bounce">
        <button
          @click="scrollToFeatures"
          class="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          aria-label="向下滚动查看更多内容"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features-section" class="relative z-10 py-8 md:py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-xl md:text-3xl font-bold text-center text-foreground mb-6 md:mb-12">强大的功能特性</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          <!-- Feature 1 -->
          <div class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 md:mb-4">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">多种水印模板</h3>
            <p class="text-sm text-muted-foreground">提供多种专业水印模板，匹配不同的摄影风格和需求</p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 md:mb-4">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">自动识别 EXIF</h3>
            <p class="text-sm text-muted-foreground">自动读取照片的拍摄参数，也支持手动自定义信息</p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 md:mb-4">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 class="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">完全免费导出</h3>
            <p class="text-sm text-muted-foreground">导出照片没有任何限制，支持 JPEG、PNG、WEBP 格式</p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 md:mb-4">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">自定义配置</h3>
            <p class="text-sm text-muted-foreground">颜色、字体、Logo、布局等都可以自由调整</p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 md:mb-4">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <h3 class="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">广泛设备支持</h3>
            <p class="text-sm text-muted-foreground">支持相机、手机、无人机等多种设备品牌</p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 md:mb-4">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">快速高效</h3>
            <p class="text-sm text-muted-foreground">纯前端处理，无需等待上传下载，即时生成水印</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="relative z-10 py-8 md:py-20 px-4 bg-muted/20">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-xl md:text-3xl font-bold text-center text-foreground mb-2 md:mb-4">常见问题</h2>
        <p class="text-center text-sm md:text-base text-muted-foreground mb-6 md:mb-12">关于水印生成器的常见疑问</p>

        <div class="space-y-2 md:space-y-4">
          <!-- FAQ 1 -->
          <details class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border group">
            <summary class="text-sm md:text-base font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>如何开始使用？</span>
              <svg class="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-2 md:mt-4 text-xs md:text-sm text-muted-foreground">
              使用非常简单！只需点击上传按钮或直接拖拽图片到指定区域，系统会自动识别图片的 EXIF 信息。然后选择您喜欢的水印模板，调整参数后即可导出带有水印的图片。整个过程无需注册，完全免费。
            </p>
          </details>

          <!-- FAQ 2 -->
          <details class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border group">
            <summary class="text-sm md:text-base font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>支持哪些图片格式和设备品牌？</span>
              <svg class="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-2 md:mt-4 text-xs md:text-sm text-muted-foreground">
              我们支持 JPEG、PNG 等主流图片格式。设备品牌涵盖佳能、尼康、索尼、富士等主流相机品牌，以及苹果、三星、华为、小米等手机品牌，还支持大疆、GoPro 等运动相机和无人机设备。
            </p>
          </details>

          <!-- FAQ 3 -->
          <details class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border group">
            <summary class="text-sm md:text-base font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>图片数据是否安全？</span>
              <svg class="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-2 md:mt-4 text-xs md:text-sm text-muted-foreground">
              您的隐私和数据安全是我们的首要关注。所有图片处理都在您的浏览器本地完成，我们不会上传或保存您的任何图片数据。处理完成后，您可以选择保存或删除图片，完全由您掌控。
            </p>
          </details>

          <!-- FAQ 4 -->
          <details class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border group">
            <summary class="text-sm md:text-base font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>如果图片没有 EXIF 信息怎么办？</span>
              <svg class="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-2 md:mt-4 text-xs md:text-sm text-muted-foreground">
              如果图片缺少 EXIF 信息或信息不完整，您可以手动填写相机型号、拍摄参数等信息。我们提供了直观的自定义界面，让您能够添加光圈、快门速度、ISO、焦距等拍摄参数，创建个性化的相机水印。
            </p>
          </details>

          <!-- FAQ 5 -->
          <details class="bg-card/80 backdrop-blur-md p-3 md:p-6 rounded-xl border border-border group">
            <summary class="text-sm md:text-base font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>导出的图片有限制吗？</span>
              <svg class="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-2 md:mt-4 text-xs md:text-sm text-muted-foreground">
              完全没有限制！像素大小、分辨率、颜色空间等都不受任何限制， 完全原图导出。
            </p>
          </details>
        </div>
      </div>
    </div>

    <!-- Related Tools Section -->
    <div class="relative z-10 py-8 md:py-16 px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-xl md:text-2xl font-bold text-center text-foreground mb-4 md:mb-8">更多实用工具</h2>

        <div class="bg-gradient-to-br from-primary/10 to-amber-600/10 backdrop-blur-md p-4 md:p-8 rounded-2xl border border-primary/20">
          <div class="flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div class="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-primary to-amber-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30">
                <svg class="w-7 h-7 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 text-center md:text-left">
              <h3 class="text-lg md:text-2xl font-bold text-foreground mb-1 md:mb-2">Photix Crop</h3>
              <p class="text-xs md:text-base text-muted-foreground mb-2 md:mb-4">
                专业的在线图片裁剪工具，支持小红书3:5、朋友圈9宫格等多种尺寸比例。100%本地处理，保护隐私安全。支持批量裁剪、实时预览、一键保存，让图片完美适配各大社交平台。
              </p>
              <div class="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start mb-2 md:mb-4">
                <span class="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">免费使用</span>
                <span class="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">本地处理</span>
                <span class="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">多种比例</span>
                <span class="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">高质量输出</span>
              </div>
            </div>

            <!-- CTA Button -->
            <div class="flex-shrink-0">
              <a
                href="https://crop.photix.cc"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-primary hover:bg-primary/90 text-white text-sm md:text-base font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <span>立即使用</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="relative z-10 py-4 md:py-8 px-4 text-center border-t border-border/50">
      <div class="space-y-2 md:space-y-4">
        <div class="flex justify-center gap-4 md:gap-6 text-xs md:text-sm">
          <a href="https://crop.photix.cc" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-colors">
            Photix Crop
          </a>
          <!-- <a href="https://github.com/dsleoon/photix-mark-web" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-colors">
            GitHub
          </a> -->
        </div>
        <p class="text-xs md:text-sm text-muted-foreground">
          © 2025 Photix Mark • 免费的相机水印生成工具 • Leoonliang
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue'
import ImageUploader from '~/components/ImageUploader.vue'

// 定义 emits
const emit = defineEmits<{
  upload: [files: File[]]
}>()

// 处理上传
function handleUpload(files: File[]) {
  emit('upload', files)
}

// 平滑滚动到功能特性区域
function scrollToFeatures() {
  const featuresSection = document.getElementById('features-section')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
