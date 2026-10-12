import { readonly } from 'vue'
import { createSharedComposable, useStorage } from '@vueuse/core'
import { addSavedDateTimeFormat, parseSavedDateTimeFormats } from '~/lib/editor/savedDateTimeFormats'

// 所有配置面板共享同一份列表，并在当前浏览器中持久保存。
export const useSavedDateTimeFormats = createSharedComposable(() => {
  const formats = useStorage<string[]>('photix-mark:custom-date-time-formats', [], undefined, {
    initOnMounted: true,
    serializer: {
      read: parseSavedDateTimeFormats,
      write: JSON.stringify
    }
  })

  function saveFormat(format: string) {
    formats.value = addSavedDateTimeFormat(formats.value, format)
  }

  return { savedDateTimeFormats: readonly(formats), saveFormat }
})
