import { ref, h, render } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

export function useConfirm() {
  const confirm = (options: ConfirmOptions | string): Promise<boolean> => {
    return new Promise((resolve) => {
      const normalizedOptions = typeof options === 'string'
        ? { message: options }
        : options

      // 创建容器
      const container = document.createElement('div')
      document.body.appendChild(container)

      // 创建虚拟节点
      const vnode = h(ConfirmDialog, {
        ...normalizedOptions,
        onConfirm: () => {
          cleanup()
          resolve(true)
        },
        onCancel: () => {
          cleanup()
          resolve(false)
        }
      })

      // 渲染
      render(vnode, container)

      // 显示对话框
      const instance = vnode.component?.exposed as { show: () => void; hide: () => void }
      instance?.show()

      // 清理函数
      function cleanup() {
        setTimeout(() => {
          render(null, container)
          document.body.removeChild(container)
        }, 200) // 等待动画完成
      }
    })
  }

  return {
    confirm
  }
}
