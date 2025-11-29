<template>
  <a-modal v-model:open="visible" title="查看详情" :width="1100" @cancel="handleCancel" :footer="null">
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络名称">
            <span class="detail-text">{{ detailData.networkName || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所属地区">
            <span class="detail-text">{{ formatRegion(detailData.region) }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络服务商">
            <span class="detail-text">{{ detailData.networkProvider || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="网络用途">
            <span class="detail-text">{{ detailData.networkUsage || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位">
            <span class="detail-text">{{ detailData.affiliatedUnit || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="网络资源类型">
            <span class="detail-text">{{ detailData.networkResourceType || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络带宽">
            <span class="detail-text">{{ detailData.networkBandwidth ? detailData.networkBandwidth + ' MB' : '-'
              }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="接入机房">
            <span class="detail-text">{{ detailData.accessMachineRoom || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="接入IP地址范围" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <div
              v-if="detailData.accessIpRangeList && detailData.accessIpRangeList.length > 0 && detailData.accessIpRangeList[0].startIp">
              <div v-for="(ipRange, index) in detailData.accessIpRangeList" :key="index" class="detail-text"
                style="margin-bottom: 8px;">
                {{ ipRange.ipVersion }} {{ ipRange.startIp || '-' }} — {{ ipRange.endIp || '-' }}
              </div>
            </div>
            <span v-else class="detail-text">-</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="详细地址" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <span class="detail-text">{{ detailData.detailedAddress || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="运营商联系人" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
            <span class="detail-text">{{ detailData.providerContact || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="联系电话" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <span class="detail-text">{{ detailData.contactPhone || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="联系邮箱" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <span class="detail-text">{{ detailData.contactEmail || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import dayjs from 'dayjs'

interface IpRangeItem {
  ipVersion: string
  startIp: string
  endIp: string
}

interface DetailData {
  networkName?: string
  region?: string[]
  networkProvider?: string
  networkUsage?: string
  affiliatedUnit?: string
  networkResourceType?: string
  networkBandwidth?: string
  accessMachineRoom?: string
  accessIpRangeList?: IpRangeItem[]
  detailedAddress?: string
  providerContact?: string
  contactPhone?: string
  contactEmail?: string
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



// 格式化地区显示
const formatRegion = (region?: string[]) => {
  if (!region || !Array.isArray(region) || region.length === 0) return '-'
  return region.join(' / ')
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
