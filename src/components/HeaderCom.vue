<template>
  <div class="w-full flex justify-between items-center">
    <div class="flex items-center gap-5">
      <img width="40" height="40" :src="logoImg">
      <div class="text-lg font-bold">网络安全协调指挥平台-资产填报工具</div>
    </div>
    <div class="text-red-500 font-medium">已填写内容为缓存数据，关闭工具前请导出数据，直接关闭工具会造成已填写数据丢失！！！</div>
  </div>
</template>

<script setup lang="ts">
import logoImg from '@/assets/logo.png'

</script>

<style scoped>

</style>