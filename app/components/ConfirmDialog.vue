<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Dialog -->
        <div
          class="relative bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border max-w-md w-full overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 pt-6 pb-4">
            <div class="flex items-start gap-4">
              <!-- Icon -->
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-foreground mb-2">
                  {{ title }}
                </h3>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 pb-6 flex gap-3 justify-end">
            <button
              @click="handleCancel"
              class="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认操作',
  confirmText: '确定',
  cancelText: '取消'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const visible = ref(false)

function show() {
  visible.value = true
}

function hide() {
  visible.value = false
}

function handleConfirm() {
  emit('confirm')
  hide()
}

function handleCancel() {
  emit('cancel')
  hide()
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-active > div > div,
.dialog-leave-active > div > div {
  transition: all 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div > div,
.dialog-leave-to > div > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
