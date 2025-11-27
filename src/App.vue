<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import HeaderCom from './components/HeaderCom.vue';
import SiderMenu from './components/SiderMenu.vue';
import { RouterView } from 'vue-router';

</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header class="header bg-dark-800 text-white h-52px flex items-center">
      <HeaderCom />
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" class="bg-gray-100">
        <SiderMenu />
      </a-layout-sider>
      <a-layout-content>
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.header {
  height: 52px;
  background-color: #131435;
  color: #fff;
  line-height: 52px;
}
</style>