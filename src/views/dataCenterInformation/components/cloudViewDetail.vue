<template>
  <a-modal v-model:open="visible" title="查看详情" :width="1100" @cancel="handleCancel" :footer="null">
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 云平台信息 -->
      <div class="form-section-title">云平台信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="云平台名称">
            <span class="detail-text">{{ detailData.cloudName || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="云平台类型">
            <span class="detail-text">{{ detailData.cloudType || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="运营单位">
            <span class="detail-text">{{ detailData.operatingUnit || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="使用主体单位">
            <span class="detail-text">{{ detailData.usingUnit || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否在境内">
            <span class="detail-text">{{ detailData.isDomestic ? '是' : '否' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 联系人信息 -->
      <div class="form-section-title">联系人信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系人">
            <span class="detail-text">{{ detailData.contactPerson || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="联系电话">
            <span class="detail-text">{{ detailData.contactPhone || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="邮箱">
            <span class="detail-text">{{ detailData.contactEmail || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="联系地址">
            <span class="detail-text">{{ detailData.contactAddress || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'

interface DetailData {
  cloudName?: string
  cloudType?: string
  operatingUnit?: string
  usingUnit?: string
  isDomestic?: boolean
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  contactAddress?: string
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
