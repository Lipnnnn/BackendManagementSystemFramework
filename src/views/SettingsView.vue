<template>
    <div class="settings">
        <h1>系统设置</h1>
        <a-card title="功能说明">
            <p>系统设置模块用于配置平台的各项参数。</p>
        </a-card>
        <a-card title="设置项" style="margin-top: 20px;">
            <a-form layout="vertical">
                <a-form-item label="主题设置">
                    <a-select>
                        <a-select-option value="light">浅色主题</a-select-option>
                        <a-select-option value="dark">深色主题</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="语言设置">
                    <a-select>
                        <a-select-option value="zh">中文</a-select-option>
                        <a-select-option value="en">English</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary">保存设置</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.settings {
    padding: 20px;
}
</style>