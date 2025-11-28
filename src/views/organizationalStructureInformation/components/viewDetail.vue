<template>
  <a-modal v-model:open="visible" title="查看详情" :width="1100" @cancel="handleCancel" :footer="null">
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="单位名称">
            <span class="detail-text">{{ detailData.unitName || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="单位类型">
            <span class="detail-text">{{ formatUnitType(detailData.unitType) }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属区域">
            <span class="detail-text">{{ detailData.region || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="行业类型">
            <span class="detail-text">{{ detailData.industry || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="统一社会信用代码">
            <span class="detail-text">{{ detailData.creditCode || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所在国家地区">
            <span class="detail-text">{{ detailData.country || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="单位具体地址">
            <span class="detail-text">{{ detailData.address || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="经纬度">
            <span class="detail-text">
              {{ detailData.longitude && detailData.latitude ? `${detailData.longitude}, ${detailData.latitude}` : '-'
              }}
            </span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络监管部门名称">
            <span class="detail-text">{{ detailData.networkDept || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="行政主管部门名称">
            <span class="detail-text">{{ detailData.adminDept || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 补充信息 -->
      <div class="form-section-title">补充信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否有本地大型平台">
            <span class="detail-text">{{ detailData.hasLocalPlatform || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否有本地态势感知平台">
            <span class="detail-text">{{ detailData.hasSituationPlatform || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否有外电子大屏">
            <span class="detail-text">{{ detailData.hasExternalScreen || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 联系人 -->
      <div class="form-section-title">联系人</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="单位负责人">
            <span class="detail-text">{{ detailData.unitHead || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="办公电话">
            <span class="detail-text">{{ detailData.unitHeadPhone || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系邮箱">
            <span class="detail-text">{{ detailData.unitHeadEmail || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应急联系人">
            <span class="detail-text">{{ detailData.emergencyContact || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="办公电话">
            <span class="detail-text">{{ detailData.emergencyPhone || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系邮箱">
            <span class="detail-text">{{ detailData.emergencyEmail || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="职务职称">
            <span class="detail-text">{{ detailData.emergencyPosition || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="详细地址">
            <span class="detail-text">{{ detailData.emergencyAddress || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络安全分管领导">
            <span class="detail-text">{{ detailData.securityLeader || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="办公电话">
            <span class="detail-text">{{ detailData.securityLeaderPhone || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系邮箱">
            <span class="detail-text">{{ detailData.securityLeaderEmail || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="职务职称">
            <span class="detail-text">{{ detailData.securityLeaderPosition || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'

interface DetailData {
  unitName?: string
  unitType?: string | string[]
  region?: string
  industry?: string
  creditCode?: string
  country?: string
  address?: string
  longitude?: string
  latitude?: string
  networkDept?: string
  adminDept?: string
  hasLocalPlatform?: string
  hasSituationPlatform?: string
  hasExternalScreen?: string
  unitHead?: string
  unitHeadPhone?: string
  unitHeadEmail?: string
  emergencyContact?: string
  emergencyPhone?: string
  emergencyEmail?: string
  emergencyPosition?: string
  emergencyAddress?: string
  securityLeader?: string
  securityLeaderPhone?: string
  securityLeaderEmail?: string
  securityLeaderPosition?: string
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

// 格式化单位类型显示
const formatUnitType = (unitType?: string | string[]) => {
  if (!unitType) return '-'
  if (Array.isArray(unitType)) {
    return unitType.join(' / ')
  }
  return unitType
}

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
