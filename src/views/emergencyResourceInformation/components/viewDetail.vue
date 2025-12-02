<template>
  <a-modal v-model:open="visible" title="查看详情" :width="1100" @cancel="handleCancel" :footer="null">
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应急资源名称">
            <span class="detail-text">{{ detailData.resourceName || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="资源可用性">
            <span class="detail-text">{{ detailData.resourceAvailability || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位">
            <span class="detail-text">{{ detailData.ownerUnit || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="应急资源类型">
            <span class="detail-text">{{ Array.isArray(detailData.resourceType) ? detailData.resourceType.join('、') :
              (detailData.resourceType || '-') }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12"
          v-if="detailData.resourceType && (Array.isArray(detailData.resourceType) ? detailData.resourceType.includes('应急团队') : detailData.resourceType === '应急团队') && detailData.teamSize">
          <a-form-item label="团队规模">
            <span class="detail-text">{{ detailData.teamSize || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12"
          v-if="detailData.resourceType && (Array.isArray(detailData.resourceType) ? detailData.resourceType.includes('系统工具') : detailData.resourceType === '系统工具') && detailData.systemToolList">
          <a-form-item label="系统工具列表">
            <span class="detail-text">{{ detailData.systemToolList || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 联系人 -->
      <div class="form-section-title">联系人</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应急联系人">
            <span class="detail-text">{{ detailData.emergencyContact || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="应急联系人电话">
            <span class="detail-text">{{ detailData.emergencyContactPhone || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应急联系人邮箱">
            <span class="detail-text">{{ detailData.emergencyContactEmail || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="应急联系人地址">
            <span class="detail-text">{{ detailData.emergencyContactAddress || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="备用应急联系人">
            <span class="detail-text">{{ detailData.backupEmergencyContact || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="备用应急联系人电话">
            <span class="detail-text">{{ detailData.backupEmergencyContactPhone || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="备用应急联系人邮箱">
            <span class="detail-text">{{ detailData.backupEmergencyContactEmail || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="备用应急联系人地址">
            <span class="detail-text">{{ detailData.backupEmergencyContactAddress || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'

interface DetailData {
  resourceName?: string
  resourceAvailability?: string
  ownerUnit?: string
  resourceType?: string | string[]
  teamSize?: string
  systemToolList?: string
  emergencyContact?: string
  emergencyContactPhone?: string
  emergencyContactEmail?: string
  emergencyContactAddress?: string
  backupEmergencyContact?: string
  backupEmergencyContactPhone?: string
  backupEmergencyContactEmail?: string
  backupEmergencyContactAddress?: string
}

interface Props {
  open: boolean
  data?: DetailData
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  data: undefined
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

// 详情数据
const detailData = reactive<DetailData>({})

// 控制显示
const visible = ref(false)

// 监听 props.open 变化
watch(() => props.open, (newVal) => {
  visible.value = newVal
  if (newVal && props.data) {
    // 填充详情数据
    Object.assign(detailData, props.data)
  }
})

// 监听 visible 变化，同步给父组件
watch(visible, (newVal) => {
  emit('update:open', newVal)
})

// 取消
const handleCancel = () => {
  visible.value = false
}
</script>

<style scoped>
.form-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-text {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
}
</style>
