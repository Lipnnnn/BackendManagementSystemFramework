<template>
  <a-modal v-model:open="visible" title="查看详情" :width="1100" @cancel="handleCancel" :footer="null">
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="软件名称">
            <span class="detail-text">{{ detailData.softwareName || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="软件生产厂商">
            <span class="detail-text">{{ detailData.softwareManufacturer || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="软件分类">
            <span class="detail-text">{{ formatSoftwareCategory(detailData.softwareCategory) }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="软件版本">
            <span class="detail-text">{{ detailData.softwareVersion || '-' }}</span>
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
          <a-form-item label="是否国产化">
            <span class="detail-text">{{ detailData.isDomestic || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属设备">
            <span class="detail-text">{{ detailData.affiliatedDevice || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否连接互联网">
            <span class="detail-text">{{ detailData.isConnectedInternet || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="软件标准化命名方法">
            <span class="detail-text">{{ detailData.softwareStandardName || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="系统IP端口">
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
  softwareName?: string
  softwareManufacturer?: string
  softwareCategory?: string[]
  softwareVersion?: string
  affiliatedUnit?: string
  isDomestic?: string
  affiliatedDevice?: string
  isConnectedInternet?: string
  softwareStandardName?: string
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



// 格式化软件分类显示
const formatSoftwareCategory = (category?: string[]) => {
  if (!category || !Array.isArray(category) || category.length === 0) return '-'
  return category.join(' / ')
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
