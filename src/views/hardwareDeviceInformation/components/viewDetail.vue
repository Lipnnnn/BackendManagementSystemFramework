<template>
  <a-modal v-model:open="visible" title="查看详情" :width="1100" @cancel="handleCancel" :footer="null">
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="设备名称">
            <span class="detail-text">{{ detailData.deviceName || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="设备型号">
            <span class="detail-text">{{ detailData.deviceModel || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="设备类型">
            <span class="detail-text">{{ formatDeviceType(detailData.deviceType) }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否国产化">
            <span class="detail-text">{{ detailData.isDomestic || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位">
            <span class="detail-text">{{ detailData.affiliatedUnit || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 详细信息 -->
      <div class="form-section-title">详细信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="cpu型号">
            <span class="detail-text">{{ detailData.cpuModel || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="cpu核数">
            <span class="detail-text">{{ detailData.cpuCores || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="内存型号">
            <span class="detail-text">{{ detailData.memoryModel || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="内存容量">
            <span class="detail-text">{{ detailData.memoryCapacity ? detailData.memoryCapacity + ' MB' : '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="硬盘型号">
            <span class="detail-text">{{ detailData.diskModel || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="硬盘容量">
            <span class="detail-text">{{ detailData.diskCapacity ? detailData.diskCapacity + ' MB' : '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="操作系统">
            <span class="detail-text">{{ detailData.operatingSystem || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="MAC地址">
            <div v-if="detailData.macAddressList && detailData.macAddressList.length > 0">
              <div v-for="(mac, index) in detailData.macAddressList" :key="index" class="detail-text">
                {{ mac || '-' }}
              </div>
            </div>
            <span v-else class="detail-text">-</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否连接互联网">
            <span class="detail-text">{{ detailData.isConnectedInternet || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="采购时间">
            <span class="detail-text">{{ formatDateTime(detailData.purchaseTime) }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="设备状态">
            <span class="detail-text">{{ detailData.deviceStatus || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否虚拟设备">
            <span class="detail-text">{{ detailData.isVirtualDevice || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="设备生产厂商">
            <span class="detail-text">{{ detailData.manufacturer || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所属机房">
            <span class="detail-text">{{ detailData.machineRoom || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属云平台">
            <span class="detail-text">{{ detailData.cloudPlatform || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="系统ip端口">
            <div v-if="detailData.systemIpPortList && detailData.systemIpPortList.length > 0">
              <div v-for="(ipItem, index) in detailData.systemIpPortList" :key="index" class="detail-text">
                {{ ipItem.ip || '-' }}{{ ipItem.port ? ':' + ipItem.port : '' }}
              </div>
            </div>
            <span v-else class="detail-text">-</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import dayjs from 'dayjs'

interface IpPortItem {
  ip: string
  port: string
}

interface DetailData {
  deviceName?: string
  deviceModel?: string
  deviceType?: string[]
  isDomestic?: string
  affiliatedUnit?: string
  cpuModel?: string
  cpuCores?: string
  memoryModel?: string
  memoryCapacity?: string
  diskModel?: string
  diskCapacity?: string
  operatingSystem?: string
  macAddressList?: string[]
  isConnectedInternet?: string
  purchaseTime?: any
  deviceStatus?: string
  isVirtualDevice?: string
  manufacturer?: string
  machineRoom?: string
  cloudPlatform?: string
  systemIpPortList?: IpPortItem[]
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

// 格式化设备类型显示
const formatDeviceType = (deviceType?: string[]) => {
  if (!deviceType || !Array.isArray(deviceType) || deviceType.length === 0) return '-'
  return deviceType.join(' / ')
}

// 格式化日期时间
const formatDateTime = (datetime?: any) => {
  if (!datetime) return '-'
  if (typeof datetime === 'string') return datetime
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
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
