import type { TemplateConfig } from '~/lib/templates/types'
import { standard1 } from '~/lib/templates/standard1'

/**
 * 模板管理 Composable
 */
export function useTemplates() {
  /**
   * 所有可用的模板
   */
  const templates = ref<TemplateConfig[]>([
    standard1
    // 其他模板将陆续添加
  ])

  /**
   * 当前选中的模板
   */
  const selectedTemplate = ref<TemplateConfig>(templates.value[0])

  /**
   * 根据 ID 获取模板
   */
  function getTemplateById(id: string): TemplateConfig | undefined {
    return templates.value.find(t => t.id === id)
  }

  /**
   * 选择模板
   */
  function selectTemplate(id: string) {
    const template = getTemplateById(id)
    if (template) {
      selectedTemplate.value = template
    }
  }

  return {
    templates: readonly(templates),
    selectedTemplate,
    getTemplateById,
    selectTemplate
  }
}
