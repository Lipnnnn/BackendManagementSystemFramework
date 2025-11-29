<template>
  <a-modal v-model:open="visible" :title="title" :width="1100" @ok="handleOk" @cancel="handleCancel" okText="保存"
    cancelText="取消">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络名称" name="networkName">
            <a-input v-model:value="formData.networkName" placeholder="请输入网络名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所属地区" name="region">
            <a-cascader v-model:value="formData.region" :options="areaOptions" placeholder="请选择所属地区" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络服务商" name="networkProvider" :rules="[{ required: true, message: '请选择网络服务商' }]">
            <a-select v-model:value="formData.networkProvider" placeholder="选择网络服务商">
              <a-select-option value="移动">移动</a-select-option>
              <a-select-option value="联通">联通</a-select-option>
              <a-select-option value="电信">电信</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="网络用途" name="networkUsage">
            <a-input v-model:value="formData.networkUsage" placeholder="请输入网络用途" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位" name="affiliatedUnit" :rules="[{ required: true, message: '请输入所属单位' }]">
            <a-input v-model:value="formData.affiliatedUnit" placeholder="请输入单位名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="网络资源类型" name="networkResourceType">
            <a-select v-model:value="formData.networkResourceType" placeholder="选择网络资源类型">
              <a-select-option value="移动网">移动网</a-select-option>
              <a-select-option value="ADSL拨号">ADSL拨号</a-select-option>
              <a-select-option value="企业专线">企业专线</a-select-option>
              <a-select-option value="电子政务内网">电子政务内网</a-select-option>
              <a-select-option value="电子政务外网">电子政务外网</a-select-option>
              <a-select-option value="专网">专网</a-select-option>
              <a-select-option value="互联网">互联网</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络带宽" name="networkBandwidth">
            <a-input v-model:value="formData.networkBandwidth" placeholder="请输入网络带宽" suffix="MB" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="接入机房" name="accessMachineRoom">
            <a-input v-model:value="formData.accessMachineRoom" placeholder="请输入接入机房" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="接入IP地址范围" name="accessIpRange" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <div v-for="(ipRange, index) in formData.accessIpRangeList" :key="index" style="margin-bottom: 12px;">
              <div style="display: flex; gap: 8px; align-items: center;">
                <a-select v-model:value="ipRange.ipVersion" placeholder="IPv4" style="width: 120px;">
                  <a-select-option value="IPv4">IPv4</a-select-option>
                  <a-select-option value="IPv6">IPv6</a-select-option>
                </a-select>
                <a-input v-model:value="ipRange.startIp" placeholder="请输入起始地址" style="flex: 1;" />
                <span style="padding: 0 8px;">—</span>
                <a-input v-model:value="ipRange.endIp" placeholder="请输入终止地址" style="flex: 1;" />
                <a-button v-if="index === formData.accessIpRangeList.length - 1" type="text" @click="addIpRange"
                  style="flex-shrink: 0;">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                </a-button>
                <a-button v-if="formData.accessIpRangeList.length > 1" type="text" danger @click="removeIpRange(index)"
                  style="flex-shrink: 0;">
                  <template #icon>
                    <MinusOutlined />
                  </template>
                </a-button>
              </div>
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="详细地址" name="detailedAddress" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <a-input v-model:value="formData.detailedAddress" placeholder="请输入详细地址" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="运营商联系人" name="providerContact" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
            <a-input v-model:value="formData.providerContact" placeholder="请输入运营商联系人" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="联系电话" name="contactPhone" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-input v-model:value="formData.contactPhone" placeholder="请输入联系电话" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="联系邮箱" name="contactEmail" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-input v-model:value="formData.contactEmail" placeholder="请输入联系邮箱" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'
import { _areaData } from '@/data/areaData'

interface IpRangeItem {
  ipVersion: string
  startIp: string
  endIp: string
}

interface FormData {
  networkName: string
  region?: string[]
  networkProvider?: string
  networkUsage: string
  affiliatedUnit: string
  networkResourceType?: string
  networkBandwidth: string
  accessMachineRoom: string
  accessIpRangeList: IpRangeItem[]
  detailedAddress: string
  providerContact: string
  contactPhone: string
  contactEmail: string
}

interface Props {
  open: boolean
  title: string
  data?: FormData
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: '新增',
  data: undefined
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'ok', data: FormData): void
  (e: 'cancel'): void
}>()

// 地区选项数据
const areaOptions = _areaData



// 表单数据
const formRef = ref()
const formData = reactive<FormData>({
  networkName: '',
  region: undefined,
  networkProvider: undefined,
  networkUsage: '',
  affiliatedUnit: '',
  networkResourceType: undefined,
  networkBandwidth: '',
  accessMachineRoom: '',
  accessIpRangeList: [{ ipVersion: 'IPv4', startIp: '', endIp: '' }],
  detailedAddress: '',
  providerContact: '',
  contactPhone: '',
  contactEmail: ''
})

// 控制显示
const visible = ref(false)

// 监听 props.open 变化
watch(() => props.open, (newVal) => {
  visible.value = newVal
  if (newVal) {
    // 如果有传入数据，填充表单
    if (props.data) {
      Object.assign(formData, props.data)
    } else {
      // 重置表单
      resetForm()
    }
  }
})

// 监听 visible 变化，同步给父组件
watch(visible, (newVal) => {
  emit('update:open', newVal)
})

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    networkName: '',
    region: undefined,
    networkProvider: undefined,
    networkUsage: '',
    affiliatedUnit: '',
    networkResourceType: undefined,
    networkBandwidth: '',
    accessMachineRoom: '',
    accessIpRangeList: [{ ipVersion: 'IPv4', startIp: '', endIp: '' }],
    detailedAddress: '',
    providerContact: '',
    contactPhone: '',
    contactEmail: ''
  })
  formRef.value?.resetFields()
}

// 添加IP地址范围
const addIpRange = () => {
  formData.accessIpRangeList.push({ ipVersion: 'IPv4', startIp: '', endIp: '' })
}

// 删除IP地址范围
const removeIpRange = (index: number) => {
  formData.accessIpRangeList.splice(index, 1)
}

// 确定
const handleOk = async () => {
  try {
    await formRef.value.validate()
    emit('ok', { ...formData })
    visible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消
const handleCancel = () => {
  emit('cancel')
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
</style>
