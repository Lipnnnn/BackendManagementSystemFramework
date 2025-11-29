<template>
  <a-modal v-model:open="visible" title="查看端口信息" :width="1100" :footer="null" @cancel="handleCancel">
    <div class="view-detail">
      <!-- 基本信息 -->
      <div class="section-title">基本信息</div>
      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <div class="detail-item">
            <span class="label">端口：</span>
            <span class="value">{{ data?.portNumber || '-' }}</span>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="detail-item">
            <span class="label">接入IP地址：</span>
            <span class="value">{{ data?.ipVersion }} {{ data?.ipAddress || '-' }}</span>
          </div>
        </a-col>
      </a-row>

      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <div class="detail-item">
            <span class="label">端口服务：</span>
            <span class="value">{{ data?.portService || '-' }}</span>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="detail-item">
            <span class="label">传输层协议：</span>
            <span class="value">{{ data?.protocol || '-' }}</span>
          </div>
        </a-col>
      </a-row>

      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <div class="detail-item">
            <span class="label">所属单位：</span>
            <span class="value">{{ data?.unitName || '-' }}</span>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="detail-item">
            <span class="label">是否公共端口：</span>
            <span class="value">{{ data?.isPublicPort ? '是' : '否' }}</span>
          </div>
        </a-col>
      </a-row>

      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <div class="detail-item">
            <span class="label">最后检测时间：</span>
            <span class="value">{{ formatDateTime(data?.lastCheckTime) }}</span>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs, { Dayjs } from 'dayjs'

interface ViewData {
  portNumber?: string
  ipAddress?: string
  ipVersion?: string
  portService?: string
  protocol?: string
  unitName?: string
  isPublicPort?: boolean
  lastCheckTime?: Dayjs | string | null
}

interface Props {
  open: boolean
  data?: ViewData
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  data: undefined
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const visible = ref(false)

watch(() => props.open, (newVal) => {
  visible.value = newVal
})

watch(visible, (newVal) => {
  emit('update:open', newVal)
})

const handleCancel = () => {
  visible.value = false
}

// 格式化日期时间
const formatDateTime = (dateTime?: Dayjs | string | null) => {
  if (!dateTime) return '-'
  if (dayjs.isDayjs(dateTime)) {
    return dateTime.format('YYYY-MM-DD HH:mm:ss')
  }
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<style scoped>
.view-detail {
  padding: 20px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.detail-item .label {
  font-size: 14px;
  color: #666;
  min-width: 120px;
  flex-shrink: 0;
}

.detail-item .value {
  font-size: 14px;
  color: #000;
  flex: 1;
}
</style>
