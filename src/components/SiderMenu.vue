<template>
  <div class="sider-menu">
    <a-menu v-model:selected-keys="selectedKeys" mode="inline" theme="light" style="height: 100%"
      @click="handleMenuClick">
      <a-menu-item v-for="route in menuRoutes" :key="route.path">
        <template #icon>
          <component :is="route.meta.icon" />
        </template>
        <span>{{ route.meta.title }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { routes } from '../router';

const router = useRouter();
const route = useRoute();

// 过滤出需要在菜单中显示的路由
const menuRoutes = computed(() => {
  return routes.filter(route => route.meta && !route.meta.hidden);
});

const selectedKeys = ref<string[]>(['/']);

// 根据当前路由设置选中的菜单项
const setCurrentMenu = () => {
  selectedKeys.value = [route.path];
};

// 监听路由变化
watch(
  () => route.path,
  () => {
    setCurrentMenu();
  }
);

// 初始化设置当前菜单
setCurrentMenu();

// 菜单点击处理函数
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key);
};
</script>

<style scoped>
.sider-menu {
  height: 100%;
}
</style>