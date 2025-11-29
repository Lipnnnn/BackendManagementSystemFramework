<template>
  <a-modal v-model:open="visible" :title="title" :width="1100" @ok="handleOk" @cancel="handleCancel" okText="保存"
    cancelText="取消">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="软件名称" name="softwareName">
            <a-input v-model:value="formData.softwareName" placeholder="请输入软件名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="软件生产厂商" name="softwareManufacturer">
            <a-input v-model:value="formData.softwareManufacturer" placeholder="请输入软件生产厂商" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="软件分类" name="softwareCategory" :rules="[{ required: true, message: '请选择软件分类' }]">
            <a-cascader v-model:value="formData.softwareCategory" :options="softwareCategoryOptions"
              placeholder="请选择软件分类" change-on-select />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="软件版本" name="softwareVersion">
            <a-input v-model:value="formData.softwareVersion" placeholder="请输入软件版本" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位" name="affiliatedUnit" :rules="[{ required: true, message: '请输入所属单位' }]">
            <a-input v-model:value="formData.affiliatedUnit" placeholder="请输入所属单位" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否国产化" name="isDomestic">
            <a-select v-model:value="formData.isDomestic" placeholder="请选择">
              <a-select-option value="国产">国产</a-select-option>
              <a-select-option value="非国产">非国产</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属设备" name="affiliatedDevice" :rules="[{ required: true, message: '请输入所属设备' }]">
            <a-input v-model:value="formData.affiliatedDevice" placeholder="请输入所属设备" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否连接互联网" name="isConnectedInternet">
            <a-select v-model:value="formData.isConnectedInternet" placeholder="请选择">
              <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="软件标准化命名方法" name="softwareStandardName">
            <a-input v-model:value="formData.softwareStandardName" placeholder="请输入软件标准化命名方法" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="系统IP端口" name="systemIpPort">
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
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

interface IpPortItem {
  ip: string
  port: string
}

interface FormData {
  softwareName: string
  softwareManufacturer: string
  softwareCategory?: string[]
  softwareVersion: string
  affiliatedUnit: string
  isDomestic?: string
  affiliatedDevice: string
  isConnectedInternet?: string
  softwareStandardName: string
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

// 软件分类选项数据
const softwareCategoryOptions = [
  {
    value: '操作系统',
    label: '操作系统',
    children: [
      {
        value: 'Windows',
        label: 'Windows',
        children: [
          { value: 'WindowsXP', label: 'WindowsXP' },
          { value: 'Windows7', label: 'Windows7' },
          { value: 'Windows8', label: 'Windows8' },
          { value: 'Windows10', label: 'Windows10' }
        ]
      },
      {
        value: 'Linux',
        label: 'Linux',
        children: [
          { value: 'Kylin OS中标麒麟', label: 'Kylin OS中标麒麟' },
          { value: '统信', label: '统信' },
          { value: '中科方德', label: '中科方德' },
          { value: '普华', label: '普华' },
          { value: '凝思', label: '凝思' },
          { value: 'Centos', label: 'Centos' },
          { value: 'Ubuntu', label: 'Ubuntu' },
          { value: 'Fedora', label: 'Fedora' },
          { value: 'Debian', label: 'Debian' },
          { value: 'ClearLinux', label: 'ClearLinux' }
        ]
      },
      {
        value: 'Unix',
        label: 'Unix',
        children: [
          { value: 'Solaris', label: 'Solaris' },
          { value: 'IBM AIX', label: 'IBM AIX' },
          { value: 'BSD', label: 'BSD' },
          { value: 'HP-UX', label: 'HP-UX' },
          { value: 'MINIX', label: 'MINIX' }
        ]
      },
      {
        value: 'MacOS',
        label: 'MacOS',
        children: [
          { value: 'OS X', label: 'OS X' },
          { value: 'Classic Mac OS', label: 'Classic Mac OS' }
        ]
      },
      {
        value: '网络操作系统',
        label: '网络操作系统',
        children: [
          { value: 'Comware', label: 'Comware' },
          { value: 'JUN OS', label: 'JUN OS' },
          { value: 'Cisco-iOS', label: 'Cisco-iOS' }
        ]
      },
      {
        value: '嵌入式操作系统',
        label: '嵌入式操作系统',
        children: [
          { value: 'Android', label: 'Android' },
          { value: 'VxWorks', label: 'VxWorks' },
          { value: 'eCos', label: 'eCos' },
          { value: 'Symbian OS', label: 'Symbian OS' },
          { value: 'Palm OS', label: 'Palm OS' }
        ]
      },
      { value: '其他操作系统', label: '其他操作系统' }
    ]
  },
  {
    value: '数据库管理软件',
    label: '数据库管理软件',
    children: [
      { value: 'Classic Mac OS', label: 'Classic Mac OS' },
      { value: 'Comware', label: 'Comware' },
      { value: 'Android', label: 'Android' },
      { value: 'VxWorks', label: 'VxWorks' },
      { value: '华为Gause', label: '华为Gause' },
      { value: '浪潮K-DB', label: '浪潮K-DB' },
      { value: 'Oracle', label: 'Oracle' },
      { value: 'SQL Server', label: 'SQL Server' },
      { value: 'Mysql', label: 'Mysql' },
      { value: 'MongoDB', label: 'MongoDB' },
      { value: 'PostgreSQL', label: 'PostgreSQL' },
      { value: 'Hbase', label: 'Hbase' },
      { value: 'ES', label: 'ES' }
    ]
  },
  {
    value: '数据库中间件',
    label: '数据库中间件',
    children: [
      { value: 'Redis', label: 'Redis' },
      { value: 'Mysql', label: 'Mysql' },
      { value: 'MongoDB', label: 'MongoDB' },
      { value: 'PostgreSQL', label: 'PostgreSQL' },
      { value: 'Hbase', label: 'Hbase' },
      { value: 'ES', label: 'ES' },
      { value: 'Hbase', label: 'Hbase' },
      { value: 'ES', label: 'ES' },
      { value: 'Redis', label: 'Redis' },
      { value: '图数据库', label: '图数据库' },
      { value: '其他数据库', label: '其他数据库' }
    ]
  },
  {
    value: 'Web中间件',
    label: 'Web中间件',
    children: [
      { value: 'WebSphere', label: 'WebSphere' },
      { value: 'Weblogic', label: 'Weblogic' },
      { value: '其他web中间件', label: '其他web中间件' }
    ]
  },
  {
    value: '应用软件',
    label: '应用软件',
    children: [
      { value: '办公系统', label: '办公系统' },
      { value: '浏览器', label: '浏览器' },
      { value: '下载工具', label: '下载工具' },
      { value: '解压缩工具', label: '解压缩工具' },
      { value: '其他应用软件', label: '其他应用软件' },
      { value: 'Struts2', label: 'Struts2' }
    ]
  }
]



// 表单数据
const formRef = ref()
const formData = reactive<FormData>({
  softwareName: '',
  softwareManufacturer: '',
  softwareCategory: undefined,
  softwareVersion: '',
  affiliatedUnit: '',
  isDomestic: undefined,
  affiliatedDevice: '',
  isConnectedInternet: undefined,
  softwareStandardName: '',
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
    softwareName: '',
    softwareManufacturer: '',
    softwareCategory: undefined,
    softwareVersion: '',
    affiliatedUnit: '',
    isDomestic: undefined,
    affiliatedDevice: '',
    isConnectedInternet: undefined,
    softwareStandardName: '',
    systemIpPortList: []
  })
  formRef.value?.resetFields()
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
