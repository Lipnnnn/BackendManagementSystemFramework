<template>
  <a-modal v-model:open="visible" title="查看详情" :width="1100" @cancel="handleCancel" :footer="null">
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="系统名称">
            <span class="detail-text">{{ detailData.systemName || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上线时间">
            <span class="detail-text">{{ formatDateTime(detailData.onlineTime) }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位">
            <span class="detail-text">{{ detailData.affiliation || '-' }}</span>
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
          <a-form-item label="系统类型">
            <span class="detail-text">{{ detailData.systemType || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="icp备案">
            <span class="detail-text">{{ formatIcpRecord() }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否为关键基础设施">
            <span class="detail-text">{{ detailData.isCritical || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="等保级别">
            <span class="detail-text">{{ detailData.securityLevel || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="系统域名">
            <div v-if="detailData.systemDomainList && detailData.systemDomainList.length > 0">
              <div v-for="(domain, index) in detailData.systemDomainList" :key="index" class="detail-text">
                {{ domain || '-' }}
              </div>
            </div>
            <span v-else class="detail-text">-</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="系统使用url">
            <div v-if="detailData.systemUrlList && detailData.systemUrlList.length > 0">
              <div v-for="(url, index) in detailData.systemUrlList" :key="index" class="detail-text">
                {{ url || '-' }}
              </div>
            </div>
            <span v-else class="detail-text">-</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="系统IP端口">
            <div v-if="detailData.systemIpPortList && detailData.systemIpPortList.length > 0">
              <div v-for="(ipItem, index) in detailData.systemIpPortList" :key="index" class="detail-text">
                {{ ipItem.ip }}{{ ipItem.port ? ':' + ipItem.port : '' }}
              </div>
            </div>
            <span v-else class="detail-text">-</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="dns服务器域名">
            <div v-if="detailData.dnsServerDomainList && detailData.dnsServerDomainList.length > 0">
              <div v-for="(domain, index) in detailData.dnsServerDomainList" :key="index" class="detail-text">
                {{ domain || '-' }}
              </div>
            </div>
            <span v-else class="detail-text">-</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="用户规模">
            <span class="detail-text">{{ detailData.userScale || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="关键业务种类">
            <span class="detail-text">{{ formatKeyBusinessComponents() }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="重要性">
            <span class="detail-text">{{ detailData.importance || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否连接互联网">
            <span class="detail-text">{{ detailData.connectedToInternet || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="服务对象">
            <span class="detail-text">{{ formatServiceTarget() }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="系统简介" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <span class="detail-text">{{ detailData.systemDescription || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 联系人 -->
      <div class="form-section-title">联系人</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="系统负责人">
            <span class="detail-text">{{ detailData.systemHead || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="办公电话">
            <span class="detail-text">{{ detailData.systemHeadPhone || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系邮箱">
            <span class="detail-text">{{ detailData.systemHeadEmail || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="联系地址">
            <span class="detail-text">{{ detailData.systemHeadAddress || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 系统截图 -->
      <div class="form-section-title">系统截图</div>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="系统截图" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <div
              v-if="detailData.systemScreenshot && Array.isArray(detailData.systemScreenshot) && detailData.systemScreenshot.length > 0"
              class="image-preview-list">
              <div v-for="(file, index) in detailData.systemScreenshot" :key="index" class="image-preview-item">
                <img :src="file.thumbUrl || file.url || file.preview" :alt="`截图${index + 1}`" class="preview-image" />
              </div>
            </div>
            <span v-else class="detail-text">-</span>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 关联信息 -->
      <div class="form-section-title">关联信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="硬件信息">
            <span class="detail-text">{{ detailData.hardwareInfo || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="软件信息">
            <span class="detail-text">{{ detailData.softwareInfo || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络信息">
            <span class="detail-text">{{ detailData.networkInfo || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="端口信息">
            <span class="detail-text">{{ detailData.portInfo || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="机房信息">
            <span class="detail-text">{{ detailData.roomInfo || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="云平台信息">
            <span class="detail-text">{{ detailData.cloudPlatformInfo || '-' }}</span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应急信息">
            <span class="detail-text">{{ detailData.emergencyInfo || '-' }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="业务信息">
            <span class="detail-text">{{ detailData.businessInfo || '-' }}</span>
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
  systemName?: string
  systemType?: string
  affiliation?: string
  isCritical?: string
  onlineTime?: string
  industry?: string
  icpRecordStatus?: string
  icpRecordNumber?: string
  securityLevel?: string
  systemDomainList?: string[]
  systemUrlList?: string[]
  systemIpPortList?: IpPortItem[]
  dnsServerDomainList?: string[]
  userScale?: string
  keyBusinessComponents?: string[]
  importance?: string
  connectedToInternet?: string
  serviceTarget?: string[]
  systemDescription?: string
  systemHead?: string
  systemHeadPhone?: string
  systemHeadEmail?: string
  systemHeadAddress?: string
  systemScreenshot?: any[] // 文件列表
  hardwareInfo?: string
  softwareInfo?: string
  networkInfo?: string
  portInfo?: string
  roomInfo?: string
  cloudPlatformInfo?: string
  emergencyInfo?: string
  businessInfo?: string
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

// 格式化日期时间
const formatDateTime = (dateTime?: string | any) => {
  if (!dateTime) return '-'
  if (dayjs(dateTime).isValid()) {
    return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
  }
  return dateTime
}

// 格式化ICP备案
const formatIcpRecord = () => {
  if (!detailData.icpRecordStatus) return '-'
  if (detailData.icpRecordStatus === '已备案' && detailData.icpRecordNumber) {
    return `${detailData.icpRecordStatus} - ${detailData.icpRecordNumber}`
  }
  return detailData.icpRecordStatus
}

// 格式化关键业务种类
const formatKeyBusinessComponents = () => {
  if (!detailData.keyBusinessComponents || detailData.keyBusinessComponents.length === 0) return '-'
  return detailData.keyBusinessComponents.join(' / ')
}

// 格式化服务对象
const formatServiceTarget = () => {
  if (!detailData.serviceTarget || detailData.serviceTarget.length === 0) return '-'
  return detailData.serviceTarget.join('、')
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

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.image-preview-item {
  width: 104px;
  height: 104px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
