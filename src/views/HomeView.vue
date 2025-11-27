<template>
    <div class="home">
        <h1>首页</h1>
        <p>欢迎使用资产填报工具</p>
        <a-card title="系统说明" style="width: 100%;">
            <p>本系统用于网络安全协调指挥平台的资产填报工作。</p>
            <p>请通过左侧菜单或顶部导航选择相应功能模块进行操作。</p>
        </a-card>
        <a-card title="使用提示" style="width: 100%; margin-top: 20px;">
            <p>• 已填写内容为缓存数据，关闭工具前请导出数据</p>
            <p>• 直接关闭工具会造成已填写数据丢失</p>
        </a-card>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
    padding: 20px;
}
</style>