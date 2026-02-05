<template>
  <!-- 欢迎页 -->
  <div class="relative min-h-screen bg-background overflow-y-auto">
    <!-- Hero Section -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
      <div class="max-w-2xl w-full animate-fade-in-up">
        <!-- Logo & Title -->
        <div class="text-center mb-6 md:mb-12">
          <div class="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 md:mb-6">
            <img src="/logo.svg" alt="Photix Mark Logo" class="w-full h-full object-contain" />
          </div>
          <h1 class="text-3xl md:text-6xl font-bold text-foreground mb-2 md:mb-4">Photix Mark</h1>
          <div class="flex items-center justify-center gap-2 mb-3 md:mb-4">
            <a
              href="https://github.com/LeoonLiang/photix-mark-web"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-full text-xs md:text-sm text-foreground transition-colors border border-border"
            >
              <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium">开源项目</span>
              <svg class="w-3 h-3 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </a>
          </div>
          <p class="text-base md:text-xl text-muted-foreground mb-3 md:mb-6">为你的摄影作品，优雅地附上专属水印与参数</p>
          <p class="text-sm md:text-base text-muted-foreground/80 hidden md:block">相机水印包含相机品牌 / 型号 / 拍摄时间 / 光圈 / 快门 / ISO 等信息</p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-12">
          <div class="text-center p-3 md:p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div class="w-10 h-10 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-4">
              <svg class="w-5 h-5 md:w-7 md:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p class="text-sm md:text-base text-foreground font-medium mb-1 md:mb-2">隐私安全</p>
            <p class="text-xs md:text-sm text-muted-foreground hidden md:block">本地处理，数据不上传</p>
          </div>
          <div class="text-center p-3 md:p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div class="w-10 h-10 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-4">
              <svg class="w-5 h-5 md:w-7 md:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p class="text-sm md:text-base text-foreground font-medium mb-1 md:mb-2">批量处理</p>
            <p class="text-xs md:text-sm text-muted-foreground hidden md:block">一次处理多张图片</p>
          </div>
          <div class="text-center p-3 md:p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div class="w-10 h-10 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-4">
              <svg class="w-5 h-5 md:w-7 md:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <p class="text-sm md:text-base text-foreground font-medium mb-1 md:mb-2">实时预览</p>
            <p class="text-xs md:text-sm text-muted-foreground hidden md:block">即时查看水印效果</p>
          </div>
        </div>

        <!-- Upload Card -->
        <Card class="shadow-2xl shadow-primary/5">
          <ImageUploader @upload="handleUpload" />
        </Card>

        <!-- Additional Info -->
        <div class="mt-6 md:mt-8 text-center">
          <p class="text-xs md:text-sm text-muted-foreground">
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

    <!-- Demo Showcase Section -->
    <div class="relative z-10 py-12 md:py-24 bg-muted/70">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <!-- 左侧文字 -->
          <div>
            <h2 class="text-2xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">效果展示</h2>
            <p class="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
              多种专业水印模板，水印一加就是大师作品。超过 10 种风格，总有一款适合你的摄影风格。
            </p>
          </div>

          <!-- 右侧图片展示 - 2x2错落网格 -->
          <div class="grid grid-cols-2 gap-4 md:gap-6">
            <div
              v-for="(demo, index) in demoImages.slice(0, 4)"
              :key="demo.id"
              class="group"
              :class="index % 2 === 1 ? 'mt-8 md:mt-12' : ''"
            >
              <div class="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <img
                  :src="demo.src"
                  :alt="demo.alt"
                  class="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <p class="text-white text-xs md:text-sm font-semibold">{{ demo.title }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features-section" class="relative z-10 py-12 md:py-24 px-4 bg-muted/30">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-4xl font-bold text-center text-foreground mb-8 md:mb-16">强大的功能特性</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          <!-- Feature 1 -->
          <div class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-6">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">多种水印模板</h3>
            <p class="text-sm md:text-base text-muted-foreground">提供多种专业水印模板，匹配不同的摄影风格和需求</p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-6">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">自动识别 EXIF</h3>
            <p class="text-sm md:text-base text-muted-foreground">自动读取照片的拍摄参数，也支持手动自定义信息</p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-6">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">完全免费导出</h3>
            <p class="text-sm md:text-base text-muted-foreground">导出照片没有任何限制，支持 JPEG、PNG、WEBP 格式</p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-6">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">自定义配置</h3>
            <p class="text-sm md:text-base text-muted-foreground">颜色、字体、Logo、布局等都可以自由调整</p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-6">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">广泛设备支持</h3>
            <p class="text-sm md:text-base text-muted-foreground">支持相机、手机、无人机等多种设备品牌</p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-6">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">快速高效</h3>
            <p class="text-sm md:text-base text-muted-foreground">纯前端处理，无需等待上传下载，即时生成水印</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="relative z-10 py-12 md:py-24 px-4 bg-background">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl md:text-4xl font-bold text-center text-foreground mb-3 md:mb-6">常见问题</h2>
        <p class="text-center text-sm md:text-lg text-muted-foreground mb-8 md:mb-16">关于水印生成器的常见疑问</p>

        <div class="space-y-3 md:space-y-6">
          <!-- FAQ 1 -->
          <details class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border group shadow-sm hover:shadow-md transition-shadow">
            <summary class="text-base md:text-lg font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>如何开始使用？</span>
              <svg class="w-6 h-6 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-3 md:mt-6 text-sm md:text-base text-muted-foreground">
              使用非常简单！只需点击上传按钮或直接拖拽图片到指定区域，系统会自动识别图片的 EXIF 信息。然后选择您喜欢的水印模板，调整参数后即可导出带有水印的图片。整个过程无需注册，完全免费。
            </p>
          </details>

          <!-- FAQ 2 -->
          <details class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border group shadow-sm hover:shadow-md transition-shadow">
            <summary class="text-sm md:text-base font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>支持哪些图片格式和设备品牌？</span>
              <svg class="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-3 md:mt-6 text-sm md:text-base text-muted-foreground">
              我们支持 JPEG、PNG 等主流图片格式。设备品牌涵盖佳能、尼康、索尼、富士等主流相机品牌，以及苹果、三星、华为、小米等手机品牌，还支持大疆、GoPro 等运动相机和无人机设备。
            </p>
          </details>

          <!-- FAQ 3 -->
          <details class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border group shadow-sm hover:shadow-md transition-shadow">
            <summary class="text-sm md:text-base font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>图片数据是否安全？</span>
              <svg class="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-3 md:mt-6 text-sm md:text-base text-muted-foreground">
              您的隐私和数据安全是我们的首要关注。所有图片处理都在您的浏览器本地完成，我们不会上传或保存您的任何图片数据。处理完成后，您可以选择保存或删除图片，完全由您掌控。
            </p>
          </details>

          <!-- FAQ 4 -->
          <details class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border group shadow-sm hover:shadow-md transition-shadow">
            <summary class="text-sm md:text-base font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>如果图片没有 EXIF 信息怎么办？</span>
              <svg class="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-3 md:mt-6 text-sm md:text-base text-muted-foreground">
              如果图片缺少 EXIF 信息或信息不完整，您可以手动填写相机型号、拍摄参数等信息。我们提供了直观的自定义界面，让您能够添加光圈、快门速度、ISO、焦距等拍摄参数，创建个性化的相机水印。
            </p>
          </details>

          <!-- FAQ 5 -->
          <details class="bg-card backdrop-blur-md p-4 md:p-8 rounded-xl border border-border group shadow-sm hover:shadow-md transition-shadow">
            <summary class="text-sm md:text-base font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>导出的图片有限制吗？</span>
              <svg class="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-3 md:mt-6 text-sm md:text-base text-muted-foreground">
              完全没有限制！像素大小、分辨率、颜色空间等都不受任何限制， 完全原图导出。
            </p>
          </details>
        </div>
      </div>
    </div>

    <!-- Related Tools Section -->
    <div class="relative z-10 py-12 md:py-20 px-4 bg-primary/5">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-center text-foreground mb-6 md:mb-12">更多实用工具</h2>

        <div class="bg-gradient-to-br from-primary/10 to-amber-600/10 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
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
    <div class="relative z-10 py-6 md:py-10 px-4 text-center border-t border-border bg-muted/50">
      <div class="space-y-3 md:space-y-6">
        <!-- GitHub Star 按钮 -->
        <div class="flex justify-center mb-4">
          <a
            href="https://github.com/LeoonLiang/photix-mark-web"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <span>Star on GitHub</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </a>
        </div>

        <div class="flex justify-center gap-4 md:gap-6 text-xs md:text-sm">
          <a href="https://github.com/LeoonLiang/photix-mark-web" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            GitHub
          </a>
          <a href="https://crop.photix.cc" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-colors">
            Photix Crop
          </a>
          <span class="text-muted-foreground">•</span>
          <span class="text-muted-foreground flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            开源 MIT
          </span>
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

// Demo图片数据
const demoImages = [
  {
    id: 1,
    src: '/demo/1_背景模糊.JPG',
    alt: '背景模糊效果',
    title: '背景模糊',
    description: '突出主体，模糊背景更专业'
  },
  {
    id: 2,
    src: '/demo/2_logo居中.JPG',
    alt: 'Logo居中效果',
    title: 'Logo 居中',
    description: '品牌标识更加醒目'
  },
  {
    id: 3,
    src: '/demo/3_标准水印2.JPG',
    alt: '标准水印效果',
    title: '标准水印',
    description: '经典布局，适合大多数场景'
  },
  {
    id: 4,
    src: '/demo/8_居中样式.JPG',
    alt: '居中样式效果',
    title: '居中样式',
    description: '对称美学，平衡感强'
  },
  {
    id: 5,
    src: '/demo/6_尼康专用背景模糊.JPG',
    alt: '尼康专用背景模糊',
    title: '品牌定制',
    description: '专属品牌风格，独具特色'
  },
  {
    id: 6,
    src: '/demo/9_侧边栏样式.JPG',
    alt: '侧边栏样式效果',
    title: '侧边栏样式',
    description: '信息丰富，细节完整'
  },
  {
    id: 7,
    src: '/demo/4_标准水印.JPG',
    alt: '标准水印效果',
    title: '经典标准',
    description: '简洁大方，专业优雅'
  },
  {
    id: 8,
    src: '/demo/5_时间戳参数.JPG',
    alt: '时间戳参数效果',
    title: '时间戳参数',
    description: '详细记录，完整信息'
  },
  {
    id: 9,
    src: '/demo/7_居中样式2.JPG',
    alt: '居中样式2效果',
    title: '居中样式 2',
    description: '多样选择，随心搭配'
  }
]
</script>
