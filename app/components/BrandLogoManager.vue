<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between mb-1">
      <h3 class="text-xs font-semibold text-gray-700">品牌 Logo</h3>
      <span class="text-xs text-gray-500">{{ brands.size }} 个品牌</span>
    </div>

    <div v-if="brands.size === 0 && noBrandCount === 0" class="text-xs text-gray-400 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
      暂无品牌信息
    </div>

    <div v-else class="space-y-2 max-h-[400px] overflow-y-auto pr-1">
      <!-- 没有品牌信息的图片 -->
      <div
        v-if="noBrandCount > 0"
        class="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all"
      >
        <div class="flex items-center gap-3 mb-2">
          <!-- Logo 预览 -->
          <div class="relative w-14 h-14 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden group-hover:border-primary/20 transition-colors">
            <img
              v-if="customLogos.has('')"
              :src="customLogos.get('')"
              alt="默认Logo"
              class="max-w-full max-h-full object-contain p-1"
            />
            <div v-else class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <!-- 上传成功小徽章 -->
            <div v-if="customLogos.has('')" class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <!-- 品牌信息 -->
          <div class="flex-1 min-w-0">
            <div class="text-xs font-medium text-gray-700 truncate">无品牌信息</div>
            <div class="text-xs text-gray-500 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ noBrandCount }} 张</span>
            </div>
          </div>

          <!-- 删除按钮 -->
          <button
            v-if="customLogos.has('')"
            @click="removeCustomLogo('')"
            class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="删除自定义Logo"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
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
            'w-full px-3 py-2 text-xs font-medium rounded-lg transition-all',
            customLogos.has('')
              ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
          ]"
        >
          {{ customLogos.has('') ? '更换 Logo' : '上传 Logo' }}
        </button>
      </div>

      <!-- 各品牌 -->
      <div
        v-for="[brand, count] in sortedBrands"
        :key="brand"
        class="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all"
      >
        <div class="flex items-center gap-3 mb-2">
          <!-- Logo 预览 -->
          <div class="relative w-14 h-14 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden group-hover:border-primary/20 transition-colors">
            <img
              v-if="getLogoUrl(brand)"
              :src="getLogoUrl(brand)"
              :alt="brand"
              class="max-w-full max-h-full object-contain p-1"
            />
            <div v-else class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <!-- 自定义标记 -->
            <div v-if="customLogos.has(brand)" class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <!-- 品牌信息 -->
          <div class="flex-1 min-w-0">
            <div class="text-xs font-medium text-gray-700 truncate">{{ brand }}</div>
            <div class="text-xs text-gray-500 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ count }} 张</span>
            </div>
          </div>

          <!-- 删除按钮 -->
          <button
            v-if="customLogos.has(brand)"
            @click="removeCustomLogo(brand)"
            class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="删除自定义Logo"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
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
            'w-full px-3 py-2 text-xs font-medium rounded-lg transition-all',
            customLogos.has(brand)
              ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
          ]"
        >
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
