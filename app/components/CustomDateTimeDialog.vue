<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <button
        type="button"
        class="flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2 text-left text-[11px] text-slate-600 transition hover:border-slate-400"
      >
        <span>＋ 新增自定义格式</span>
        <span>查看格式说明</span>
      </button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <DialogContent class="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl sm:p-6">
        <DialogTitle class="text-lg font-semibold">自定义拍摄时间格式</DialogTitle>
        <DialogDescription class="mt-2 text-sm leading-relaxed text-slate-500">
          用下方符号组合日期和时间。保存后，所有图片和模板都能选用，刷新页面也会保留在当前浏览器中。
        </DialogDescription>
        <form class="mt-4 space-y-4" @submit.prevent="apply">
          <div>
            <label :for="inputId" class="text-sm font-medium">时间格式</label>
            <input
              :id="inputId"
              v-model="draft"
              type="text"
              maxlength="120"
              autocomplete="off"
              spellcheck="false"
              placeholder="YYYY-MM-DD HH:mm:ss"
              class="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
            <div class="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm" aria-live="polite">
              <p class="text-xs text-slate-500">示例：2026 年 3 月 4 日 05:06:07（+08:00）</p>
              <p class="mt-1 break-all font-medium tabular-nums">{{ preview }}</p>
            </div>
          </div>
          <div>
            <h4 class="mb-2 text-sm font-medium">格式符号（区分大小写）</h4>
            <table class="w-full text-left text-xs leading-6">
              <thead class="text-slate-500"><tr><th scope="col">符号</th><th scope="col">含义</th><th scope="col">示例</th></tr></thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="row in tokenRows" :key="row[0]">
                  <td class="font-mono">{{ row[0] }}</td><td>{{ row[1] }}</td><td>{{ row[2] }}</td>
                </tr>
              </tbody>
            </table>
            <p class="mt-2 text-xs leading-relaxed text-slate-500">MM 是月份，mm 是分钟；HH 使用 24 小时制。固定文字用方括号包住，例如 [Shot on] YYYY-MM-DD。</p>
          </div>
          <div class="flex flex-wrap gap-2" role="group" aria-label="常用自定义格式">
            <button v-for="example in examples" :key="example" type="button" class="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 hover:border-slate-400" @click="draft = example">{{ example }}</button>
          </div>
          <p class="text-xs leading-relaxed text-slate-500">照片缺少格式所需的时、分、秒或时区时，会按默认格式保留已有信息。未识别的符号原样显示；格式最多 120 个字符。</p>
          <div class="flex justify-end gap-2">
            <DialogClose as-child><button type="button" class="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">取消</button></DialogClose>
            <button type="submit" :disabled="!draft.trim()" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">保存并应用</button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'radix-vue'
import { DEFAULT_CUSTOM_DATE_TIME_FORMAT, formatDateTimeValue } from '~/lib/editor/exif'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ apply: [format: string] }>()
const open = ref(false)
const draft = ref('')
const inputId = useId()
const preview = computed(() => formatDateTimeValue('2026-03-04T05:06:07+08:00', 'custom', draft.value))
const tokenRows = [
  ['YYYY / YY', '四位 / 两位年份', '2026 / 26'],
  ['MM / M', '月份（补零 / 不补零）', '03 / 3'],
  ['DD / D', '日期（补零 / 不补零）', '04 / 4'],
  ['HH / H', '小时（补零 / 不补零）', '05 / 5'],
  ['mm / m', '分钟（补零 / 不补零）', '06 / 6'],
  ['ss / s', '秒数（补零 / 不补零）', '07 / 7'],
  ['Z', '照片记录的时区', '+08:00'],
  ['[文字]', '原样显示固定文字', '[Shot on] → Shot on']
]
const examples = ['YYYY/MM/DD HH:mm', 'YYYY年M月D日', 'DD.MM.YYYY', '[Shot on] YYYY-MM-DD']

watch(open, (value) => {
  if (value) draft.value = props.modelValue || DEFAULT_CUSTOM_DATE_TIME_FORMAT
})

function apply() {
  if (!draft.value.trim()) return
  emit('apply', draft.value.trim())
  open.value = false
}
</script>
