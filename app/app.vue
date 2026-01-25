<template>
  <div class="dark">
    <NuxtPage />
    <Toast />
  </div>
</template>

<script setup>
// 导入全局样式
import '~/assets/css/main.css'
// 导入 Toast 组件
import Toast from '~/components/Toast.vue'
</script>
