<template>
    <div class="upload">
        <h1>文件上传</h1>
        <a-card title="上传说明">
            <p>文件上传模块用于将本地文件上传到平台。</p>
        </a-card>
        <a-card title="上传区域" style="margin-top: 20px;">
            <a-upload-dragger>
                <p class="ant-upload-drag-icon">
                    <UploadOutlined />
                </p>
                <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p class="ant-upload-hint">支持单个或批量上传</p>
            </a-upload-dragger>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue';
</script>

<style scoped>
.upload {
    padding: 20px;
}
</style>