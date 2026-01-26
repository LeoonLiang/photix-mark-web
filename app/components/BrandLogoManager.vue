<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-foreground">品牌 Logo</h3>
      </div>
      <span class="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
        {{ brands.size }} 个品牌
      </span>
    </div>

    <!-- Empty State -->
    <div v-if="brands.size === 0 && noBrandCount === 0" class="text-xs text-muted-foreground text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
      <svg class="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p>暂无品牌信息</p>
    </div>

    <!-- Brand List -->
    <div v-else class="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
      <!-- 没有品牌信息的图片 -->
      <div
        v-if="noBrandCount > 0"
        class="group bg-gradient-to-br from-card to-muted/30 rounded-xl p-4 border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
      >
        <div class="flex items-center gap-3 mb-3">
          <!-- Logo 预览 -->
          <div class="relative w-16 h-16 bg-background rounded-xl flex items-center justify-center border-2 border-border overflow-hidden group-hover:border-primary/30 group-hover:shadow-md transition-all">
            <img
              v-if="customLogos.has('')"
              :src="customLogos.get('')"
              alt="默认Logo"
              class="max-w-full max-h-full object-contain p-1.5"
            />
            <div v-else class="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <!-- 上传成功徽章 -->
            <Transition name="badge">
              <div v-if="customLogos.has('')" class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </Transition>
          </div>

          <!-- 品牌信息 -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-foreground truncate mb-1">无品牌信息</div>
            <div class="text-xs text-muted-foreground flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ noBrandCount }} 张图片</span>
            </div>
          </div>

          <!-- 删除按钮 -->
          <Transition name="fade">
            <button
              v-if="customLogos.has('')"
              @click="removeCustomLogo('')"
              class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="删除自定义Logo"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </Transition>
        </div>

        <!-- 上传按钮 -->
        <input
          type="file"
          accept="image/*"
          @change="handleLogoUpload('', $event)"
          class="hidden"
          :ref="el => fileInputRefs.set('', el as HTMLInputElement)"
        />
        <button
          @click="triggerUpload('')"
          :class="[
            'w-full px-4 py-2.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2',
            customLogos.has('')
              ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:shadow-md shadow-primary/10'
              : 'bg-background text-foreground border border-border hover:border-primary hover:text-primary hover:bg-primary/5'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {{ customLogos.has('') ? '更换 Logo' : '上传 Logo' }}
        </button>
      </div>

      <!-- 各品牌 -->
      <div
        v-for="[brand, count] in sortedBrands"
        :key="brand"
        class="group bg-gradient-to-br from-card to-muted/30 rounded-xl p-4 border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
      >
        <div class="flex items-center gap-3 mb-3">
          <!-- Logo 预览 -->
          <div class="relative w-16 h-16 bg-background rounded-xl flex items-center justify-center border-2 border-border overflow-hidden group-hover:border-primary/30 group-hover:shadow-md transition-all">
            <img
              v-if="getLogoUrl(brand)"
              :src="getLogoUrl(brand)"
              :alt="brand"
              class="max-w-full max-h-full object-contain p-1.5"
            />
            <div v-else class="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <!-- 自定义标记 -->
            <Transition name="badge">
              <div v-if="customLogos.has(brand)" class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </Transition>
          </div>

          <!-- 品牌信息 -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-foreground truncate mb-1">{{ brand }}</div>
            <div class="text-xs text-muted-foreground flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ count }} 张图片</span>
            </div>
          </div>

          <!-- 删除按钮 -->
          <Transition name="fade">
            <button
              v-if="customLogos.has(brand)"
              @click="removeCustomLogo(brand)"
              class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="删除自定义Logo"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </Transition>
        </div>

        <!-- 上传按钮 -->
        <input
          type="file"
          accept="image/*"
          @change="handleLogoUpload(brand, $event)"
          class="hidden"
          :ref="el => fileInputRefs.set(brand, el as HTMLInputElement)"
        />
        <button
          @click="triggerUpload(brand)"
          :class="[
            'w-full px-4 py-2.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2',
            customLogos.has(brand)
              ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:shadow-md shadow-primary/10'
              : 'bg-background text-foreground border border-border hover:border-primary hover:text-primary hover:bg-primary/5'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {{ customLogos.has(brand) ? '更换 Logo' : (getLogoUrl(brand) ? '替换 Logo' : '上传 Logo') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  brands: Map<string, number>  // 品牌名 -> 图片数量
  noBrandCount: number  // 没有品牌信息的图片数量
  customLogos: Map<string, string>  // 品牌名 -> 自定义Logo的DataURL
}>()

const emit = defineEmits<{
  'update:customLogos': [logos: Map<string, string>]
  'logoUploaded': [brand: string]
}>()

// 文件上传input引用
const fileInputRefs = ref(new Map<string, HTMLInputElement>())

// 按图片数量排序品牌
const sortedBrands = computed(() => {
  return Array.from(props.brands.entries()).sort((a, b) => b[1] - a[1])
})

// 触发文件选择
function triggerUpload(brand: string) {
  const input = fileInputRefs.value.get(brand)
  if (input) {
    input.click()
  }
}

// 处理Logo上传
async function handleLogoUpload(brand: string, event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件')
    return
  }

  // 转换为 Data URL
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string

    // 更新自定义Logo
    const newLogos = new Map(props.customLogos)
    newLogos.set(brand, dataUrl)
    emit('update:customLogos', newLogos)
    emit('logoUploaded', brand)  // 发送上传成功事件

    // 清空input，允许重复上传同一文件
    target.value = ''
  }
  reader.readAsDataURL(file)
}

// 删除自定义Logo
function removeCustomLogo(brand: string) {
  const newLogos = new Map(props.customLogos)
  newLogos.delete(brand)
  emit('update:customLogos', newLogos)
}

// 获取Logo URL（优先自定义，其次系统默认）
function getLogoUrl(brand: string): string | null {
  // 1. 优先使用自定义Logo
  if (props.customLogos.has(brand)) {
    return props.customLogos.get(brand)!
  }

  // 2. 使用系统默认Logo（从 public/logos/ 目录）
  // 品牌名标准化：转小写，去除空格
  const normalizedBrand = brand.toLowerCase().replace(/\s+/g, '').replace(/corporation/gi, '').trim()

  // 常见品牌映射
  const brandMap: Record<string, string> = {
    'canon': 'Canon',
    'nikon': 'Nikon',
    'sony': 'Sony',
    'fujifilm': 'Fujifilm',
    'olympus': 'Olympus',
    'panasonic': 'Panasonic',
    'leica': 'Leica',
    'pentax': 'Pentax',
    'hasselblad': 'Hasselblad',
    'dji': 'DJI',
    'gopro': 'GoPro',
    'apple': 'Apple'
  }

  const mappedBrand = brandMap[normalizedBrand]
  if (mappedBrand) {
    return `/logos/${mappedBrand}.png`
  }

  // 3. 尝试直接使用品牌名
  return `/logos/${brand}.png`
}
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.2);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.3);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Badge Transition */
.badge-enter-active {
  animation: badge-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.badge-leave-active {
  transition: all 0.2s ease;
}

.badge-enter-from,
.badge-leave-to {
  opacity: 0;
  transform: scale(0);
}

@keyframes badge-in {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
