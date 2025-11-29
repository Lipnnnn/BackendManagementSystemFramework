<template>
  <a-modal v-model:open="visible" :title="title" :width="1100" @ok="handleOk" @cancel="handleCancel" okText="保存"
    cancelText="取消">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="设备名称" name="deviceName">
            <a-input v-model:value="formData.deviceName" placeholder="请输入设备名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="设备型号" name="deviceModel">
            <a-input v-model:value="formData.deviceModel" placeholder="请输入设备型号" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="设备类型" name="deviceType" :rules="[{ required: true, message: '请选择设备类型' }]">
            <a-cascader v-model:value="formData.deviceType" :options="deviceTypeOptions" placeholder="请选择设备类型"
              change-on-select />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否国产化" name="isDomestic" :rules="[{ required: true, message: '请选择是否国产化' }]">
            <a-select v-model:value="formData.isDomestic" placeholder="请选择">
              <a-select-option value="国产">国产</a-select-option>
              <a-select-option value="非国产">非国产</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位" name="affiliatedUnit" :rules="[{ required: true, message: '请输入所属单位' }]">
            <a-input v-model:value="formData.affiliatedUnit" placeholder="请输入所属单位" />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 详细信息 -->
      <div class="form-section-title">详细信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="cpu型号" name="cpuModel">
            <a-input v-model:value="formData.cpuModel" placeholder="请输入cpu型号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="cpu核数" name="cpuCores">
            <a-input v-model:value="formData.cpuCores" placeholder="请输入cpu核数" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="内存型号" name="memoryModel">
            <a-input v-model:value="formData.memoryModel" placeholder="请输入内存型号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="内存容量" name="memoryCapacity">
            <a-input v-model:value="formData.memoryCapacity" placeholder="请输入内存容量" suffix="MB" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="硬盘型号" name="diskModel">
            <a-input v-model:value="formData.diskModel" placeholder="请输入硬盘型号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="硬盘容量" name="diskCapacity">
            <a-input v-model:value="formData.diskCapacity" placeholder="请输入硬盘容量" suffix="MB" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="操作系统" name="operatingSystem">
            <a-input v-model:value="formData.operatingSystem" placeholder="操作系统" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="MAC地址" name="macAddress">
            <a-button @click="addMacAddress" style="margin-bottom: 8px;">添加MAC地址</a-button>
            <div v-for="(_mac, index) in formData.macAddressList" :key="index"
              style="margin-bottom: 8px; display: flex; gap: 8px;">
              <a-input v-model:value="formData.macAddressList[index]" placeholder="请输入MAC地址" />
              <a-button danger @click="removeMacAddress(index)" style="flex-shrink: 0;">
                <template #icon>
                  <DeleteOutlined />
                </template>
              </a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否连接互联网" name="isConnectedInternet">
            <a-select v-model:value="formData.isConnectedInternet" placeholder="请选择">
              <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="采购时间" name="purchaseTime">
            <a-date-picker v-model:value="formData.purchaseTime" :locale="locale" placeholder="请选择采购时间" show-time
              format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="设备状态" name="deviceStatus">
            <a-select v-model:value="formData.deviceStatus" placeholder="请选择">
              <a-select-option value="在线">在线</a-select-option>
              <a-select-option value="退网">退网</a-select-option>
              <a-select-option value="关闭">关闭</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否虚拟设备" name="isVirtualDevice">
            <a-select v-model:value="formData.isVirtualDevice" placeholder="请选择">
              <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="设备生产厂商" name="manufacturer">
            <a-input v-model:value="formData.manufacturer" placeholder="请输入设备生产厂商" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所属机房" name="machineRoom">
            <a-input v-model:value="formData.machineRoom" placeholder="请输入所属机房" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属云平台" name="cloudPlatform">
            <a-input v-model:value="formData.cloudPlatform" placeholder="请输入所属云平台" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="系统ip端口" name="systemIpPort">
            <a-button @click="addIpPort" style="margin-bottom: 8px;">添加IP</a-button>
            <div v-for="(ipItem, ipIndex) in formData.systemIpPortList" :key="ipIndex" style="margin-bottom: 8px;">
              <div style="display: flex; gap: 8px; align-items: center;">
                <a-input v-model:value="ipItem.ip" placeholder="请输入ip地址" style="flex: 1;" />
                <a-button danger @click="removeIpPort(ipIndex)" style="flex-shrink: 0;">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
                <a-input v-model:value="ipItem.port" placeholder="端口(可选)" style="width: 120px;" />
              </div>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { _areaData } from '@/data/areaData'
import 'dayjs/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

interface IpPortItem {
  ip: string
  port: string
}

interface FormData {
  deviceName: string
  deviceModel: string
  deviceType?: string[]
  isDomestic?: string
  affiliatedUnit: string
  cpuModel: string
  cpuCores: string
  memoryModel: string
  memoryCapacity: string
  diskModel: string
  diskCapacity: string
  operatingSystem: string
  macAddressList: string[]
  isConnectedInternet?: string
  purchaseTime?: any
  deviceStatus?: string
  isVirtualDevice?: string
  manufacturer: string
  machineRoom: string
  cloudPlatform: string
  systemIpPortList: IpPortItem[]
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

// 选项数据
const deviceTypeOptions = [
  {
    value: '网络设备',
    label: '网络设备',
    children: [
      { value: '负载均衡', label: '负载均衡' },
      { value: '其他网络设备', label: '其他网络设备' },
      { value: '防火墙', label: '防火墙' },
      { value: '堡垒机', label: '堡垒机' },
      { value: '抗DDoS', label: '抗DDoS' },
      { value: 'Web应用防火墙', label: 'Web应用防火墙' },
      { value: '入侵检测与防御', label: '入侵检测与防御' },
      { value: 'VPN设备', label: 'VPN设备' },
      { value: '防病毒设备', label: '防病毒设备' }
    ]
  },
  {
    value: '安全设备',
    label: '安全设备',
    children: [
      { value: '安全管理平台', label: '安全管理平台' },
      { value: '监控与审计设备', label: '监控与审计设备' },
      { value: '未知威胁检测设备', label: '未知威胁检测设备' },
      { value: '漏洞扫描', label: '漏洞扫描' },
      { value: '恶意代码检测', label: '恶意代码检测' },
      { value: '入侵检测与防御', label: '入侵检测与防御' },
      { value: 'VPN设备', label: 'VPN设备' },
      { value: '监控与审计设备', label: '监控与审计设备' }
    ]
  },
  {
    value: '终端设备',
    label: '终端设备',
    children: [
      { value: '打印扫描一体机', label: '打印扫描一体机' },
      { value: '摄像头', label: '摄像头' },
      { value: '显示大屏', label: '显示大屏' },
      { value: '其他终端设备', label: '其他终端设备' },
      { value: '工控机', label: '工控机' },
      { value: '其他终端设备', label: '其他终端设备' },
      { value: '工控机', label: '工控机' },
      { value: '智能仪表', label: '智能仪表' },
      { value: 'DCS', label: 'DCS' }
    ]
  },
  {
    value: '工控设备',
    label: '工控设备',
    children: [
      { value: 'PLC', label: 'PLC' },
      { value: 'CNC', label: 'CNC' },
      { value: '变频器', label: '变频器' },
      { value: 'HMI', label: 'HMI' },
      { value: '其他工控设备', label: '其他工控设备' }
    ]
  },
  {
    value: '密码产品',
    label: '密码产品',
    children: [
      { value: '服务器密码机', label: '服务器密码机' },
      { value: '密码卡', label: '密码卡' },
      { value: '数字认证卡', label: '数字认证卡' }
    ]
  },
  {
    value: '其他设备',
    label: '其他设备',
    children: [
      { value: '其他设备', label: '其他设备' }
    ]
  }
]

// 表单数据
const formRef = ref()
const formData = reactive<FormData>({
  deviceName: '',
  deviceModel: '',
  deviceType: undefined,
  isDomestic: undefined,
  affiliatedUnit: '',
  cpuModel: '',
  cpuCores: '',
  memoryModel: '',
  memoryCapacity: '',
  diskModel: '',
  diskCapacity: '',
  operatingSystem: '',
  macAddressList: [],
  isConnectedInternet: undefined,
  purchaseTime: undefined,
  deviceStatus: undefined,
  isVirtualDevice: undefined,
  manufacturer: '',
  machineRoom: '',
  cloudPlatform: '',
  systemIpPortList: []
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
    deviceName: '',
    deviceModel: '',
    deviceType: undefined,
    isDomestic: undefined,
    affiliatedUnit: '',
    cpuModel: '',
    cpuCores: '',
    memoryModel: '',
    memoryCapacity: '',
    diskModel: '',
    diskCapacity: '',
    operatingSystem: '',
    macAddressList: [],
    isConnectedInternet: undefined,
    purchaseTime: undefined,
    deviceStatus: undefined,
    isVirtualDevice: undefined,
    manufacturer: '',
    machineRoom: '',
    cloudPlatform: '',
    systemIpPortList: []
  })
  formRef.value?.resetFields()
}

// 添加MAC地址
const addMacAddress = () => {
  formData.macAddressList.push('')
}

// 删除MAC地址
const removeMacAddress = (index: number) => {
  formData.macAddressList.splice(index, 1)
}

// 添加IP端口
const addIpPort = () => {
  formData.systemIpPortList.push({ ip: '', port: '' })
}

// 删除IP端口
const removeIpPort = (index: number) => {
  formData.systemIpPortList.splice(index, 1)
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
