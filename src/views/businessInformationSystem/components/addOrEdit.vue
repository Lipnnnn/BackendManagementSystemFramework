<template>
  <a-modal v-model:open="visible" :title="title" :width="1100" @ok="handleOk" @cancel="handleCancel" okText="保存"
    cancelText="取消">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="系统名称" name="systemName" :rules="[{ required: true, message: '请输入系统名称' }]">
            <a-input v-model:value="formData.systemName" placeholder="请输入系统名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上线时间" name="onlineTime">
            <a-date-picker v-model:value="formData.onlineTime" :locale="locale" show-time format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择上线时间" style="width: 100%;" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位" name="affiliation" :rules="[{ required: true, message: '请输入所属单位' }]">
            <a-input v-model:value="formData.affiliation" placeholder="请输入所属单位" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="行业类型" name="industry">
            <a-select v-model:value="formData.industry" placeholder="请选择行业类型">
              <a-select-option v-for="item in industryOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="系统类型" name="systemType" :rules="[{ required: true, message: '请选择系统类型' }]">
            <a-select v-model:value="formData.systemType" placeholder="请选择">
              <a-select-option value="公众服务系统">公众服务系统</a-select-option>
              <a-select-option value="业务信息系统">业务信息系统</a-select-option>
              <a-select-option value="办公管理系统">办公管理系统</a-select-option>
              <a-select-option value="网站">网站</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="icp备案" name="icpRecordStatus" :rules="[{ required: true, message: '请选择icp备案' }]">
            <a-input-group compact>
              <a-select v-model:value="formData.icpRecordStatus" placeholder="请选择" style="width: 40%;">
                <a-select-option value="未备案">未备案</a-select-option>
                <a-select-option value="已备案">已备案</a-select-option>
                <a-select-option value="非网站系统">非网站系统</a-select-option>
              </a-select>
              <a-input v-model:value="formData.icpRecordNumber" placeholder="请输入icp备案号" style="width: 60%;"
                :disabled="formData.icpRecordStatus !== '已备案'" />
            </a-input-group>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否为关键基础设施" name="isCritical" :rules="[{ required: true, message: '请选择是否为关键基础设施' }]">
            <a-select v-model:value="formData.isCritical" placeholder="请选择">
              <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="等保级别" name="securityLevel">
            <a-select v-model:value="formData.securityLevel" placeholder="请选择">
              <a-select-option value="未备案">未备案</a-select-option>
              <a-select-option value="等保一级">等保一级</a-select-option>
              <a-select-option value="等保二级">等保二级</a-select-option>
              <a-select-option value="等保三级">等保三级</a-select-option>
              <a-select-option value="等保四级">等保四级</a-select-option>
              <a-select-option value="等保五级">等保五级</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="系统域名" name="systemDomain">
            <a-button @click="addSystemDomain" style="margin-bottom: 8px;">添加域名</a-button>
            <div v-for="(_domain, index) in formData.systemDomainList" :key="index"
              style="margin-bottom: 8px; display: flex; gap: 8px;">
              <a-input v-model:value="formData.systemDomainList[index]" placeholder="请输入域名" />
              <a-button danger @click="removeSystemDomain(index)" style="flex-shrink: 0;">
                <template #icon>
                  <DeleteOutlined />
                </template>
              </a-button>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="系统使用url" name="systemUrl">
            <a-button @click="addSystemUrl" style="margin-bottom: 8px;">添加URL</a-button>
            <div v-for="(_url, index) in formData.systemUrlList" :key="index"
              style="margin-bottom: 8px; display: flex; gap: 8px;">
              <a-input v-model:value="formData.systemUrlList[index]" placeholder="请输入url" />
              <a-button danger @click="removeSystemUrl(index)" style="flex-shrink: 0;">
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
          <a-form-item label="系统IP端口" name="systemIpPort">
            <a-button @click="addSystemIp" style="margin-bottom: 8px;">添加IP</a-button>
            <div v-for="(ipItem, ipIndex) in formData.systemIpPortList" :key="ipIndex" style="margin-bottom: 8px;">
              <div style="display: flex; gap: 8px; align-items: center;">
                <a-input v-model:value="ipItem.ip" placeholder="请输入ip地址" style="flex: 1;" />
                <a-button danger @click="removeSystemIp(ipIndex)" style="flex-shrink: 0;">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
                <a-input v-model:value="ipItem.port" placeholder="端口(可选)" style="width: 120px;" />
              </div>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="dns服务器域名" name="dnsServerDomain">
            <a-button @click="addDnsServerDomain" style="margin-bottom: 8px;">添加域名</a-button>
            <div v-for="(_domain, index) in formData.dnsServerDomainList" :key="index"
              style="margin-bottom: 8px; display: flex; gap: 8px;">
              <a-input v-model:value="formData.dnsServerDomainList[index]" placeholder="请输入dns域名" />
              <a-button danger @click="removeDnsServerDomain(index)" style="flex-shrink: 0;">
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
          <a-form-item label="用户规模" name="userScale">
            <a-select v-model:value="formData.userScale" placeholder="请选择">
              <a-select-option value="1000人以下">1000人以下</a-select-option>
              <a-select-option value="1000-1万">1000-1万</a-select-option>
              <a-select-option value="1万-10万">1万-10万</a-select-option>
              <a-select-option value="10万以上">10万以上</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="关键业务种类" name="keyBusinessComponents">
            <a-cascader v-model:value="formData.keyBusinessComponents" :options="keyBusinessComponentsOptions"
              placeholder="请选择关键业务种类" :show-search="{ filter }" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="重要性" name="importance">
            <a-select v-model:value="formData.importance" placeholder="请选择">
              <a-select-option value="一般">一般</a-select-option>
              <a-select-option value="重要">重要</a-select-option>
              <a-select-option value="非常重要">非常重要</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否连接互联网" name="connectedToInternet">
            <a-select v-model:value="formData.connectedToInternet" placeholder="请选择">
              <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="服务对象" name="serviceTarget">
            <a-select v-model:value="formData.serviceTarget" mode="multiple" placeholder="请选择" :max-tag-count="2">
              <a-select-option value="个人用户">个人用户</a-select-option>
              <a-select-option value="组织机构">组织机构</a-select-option>
              <a-select-option value="支撑其他平台运行">支撑其他平台运行</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="系统简介" name="systemDescription" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <a-textarea v-model:value="formData.systemDescription" placeholder="请输入系统简介" :rows="3" />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 联系人 -->
      <div class="form-section-title">联系人</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="系统负责人" name="systemHead" :rules="[{ required: true, message: '请输入系统负责人姓名' }]">
            <a-input v-model:value="formData.systemHead" placeholder="请输入系统负责人姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="办公电话" name="systemHeadPhone" :rules="[{ required: true, message: '请输入系统负责人办公电话' }]">
            <a-input v-model:value="formData.systemHeadPhone" placeholder="请输入系统负责人办公电话" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系邮箱" name="systemHeadEmail" :rules="[{ required: true, message: '请输入系统负责人联系邮箱' }]">
            <a-input v-model:value="formData.systemHeadEmail" placeholder="请输入系统负责人联系邮箱" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="联系地址" name="systemHeadAddress" :rules="[{ required: true, message: '请输入系统负责人联系地址' }]">
            <a-input v-model:value="formData.systemHeadAddress" placeholder="请输入系统负责人联系地址" />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 系统截图 -->
      <div class="form-section-title">系统截图</div>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="系统截图" name="systemScreenshot" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <a-upload v-model:file-list="fileList" list-type="picture-card" :before-upload="beforeUpload"
              :custom-request="handleUpload" @preview="handlePreview" @remove="handleRemove" accept="image/*"
              :max-count="5">
              <div v-if="(fileList || []).length < 5">
                <plus-outlined />
                <div style="margin-top: 8px;">点击上传文件</div>
              </div>
            </a-upload>
            <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancelPreview">
              <img alt="preview" style="width: 100%" :src="previewImage" />
            </a-modal>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 关联信息 -->
      <div class="form-section-title">关联信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="硬件信息" name="hardwareInfo">
            <a-input v-model:value="formData.hardwareInfo" placeholder="请输入硬件信息" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="软件信息" name="softwareInfo">
            <a-input v-model:value="formData.softwareInfo" placeholder="请输入软件信息" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络信息" name="networkInfo">
            <a-input v-model:value="formData.networkInfo" placeholder="请输入网络信息" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="端口信息" name="portInfo">
            <a-input v-model:value="formData.portInfo" placeholder="请输入端口信息" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="机房信息" name="roomInfo">
            <a-input v-model:value="formData.roomInfo" placeholder="请输入机房信息" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="云平台信息" name="cloudPlatformInfo">
            <a-input v-model:value="formData.cloudPlatformInfo" placeholder="请输入云平台信息" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应急信息" name="emergencyInfo">
            <a-input v-model:value="formData.emergencyInfo" placeholder="请输入应急信息" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="业务信息" name="businessInfo">
            <a-input v-model:value="formData.businessInfo" placeholder="请输入业务信息" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { Dayjs } from 'dayjs'
import 'dayjs/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

interface IpPortItem {
  ip: string
  port: string
}

interface FormData {
  systemName: string
  systemType?: string
  affiliation: string
  isCritical?: string
  onlineTime?: Dayjs | string
  industry?: string
  icpRecordStatus?: string
  icpRecordNumber?: string
  securityLevel?: string
  systemDomainList: string[]
  systemUrlList: string[]
  systemIpPortList: IpPortItem[]
  dnsServerDomainList: string[]
  userScale?: string
  keyBusinessComponents?: string[]
  importance?: string
  connectedToInternet?: string
  serviceTarget?: string[]
  systemDescription?: string
  systemHead: string
  systemHeadPhone: string
  systemHeadEmail: string
  systemHeadAddress: string
  systemScreenshot?: any[] // 存储文件列表
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
const industryOptions = [
  { label: '邮政', value: '邮政' },
  { label: '科技', value: '科技' },
  { label: '电信', value: '电信' },
  { label: '银行', value: '银行' },
  { label: '外交', value: '外交' },
  { label: '证券', value: '证券' },
  { label: '电力', value: '电力' },
  { label: '财政', value: '财政' },
  { label: '海关', value: '海关' },
  { label: '商业贸易', value: '商业贸易' },
  { label: '宣传', value: '宣传' },
  { label: '公安', value: '公安' },
  { label: '工商行政管理', value: '工商行政管理' },
  { label: '其他', value: '其他' },
  { label: '审计', value: '审计' },
  { label: '统计', value: '统计' },
  { label: '农业', value: '农业' },
  { label: '民航', value: '民航' },
  { label: '发展改革', value: '发展改革' },
  { label: '水利', value: '水利' },
  { label: '交通', value: '交通' },
  { label: '质量监督检验检疫', value: '质量监督检验检疫' }
]

const keyBusinessComponentsOptions = [
  {
    value: '工业制造',
    label: '工业制造',
    children: [
      { value: '智能制造系统', label: '智能制造系统' },
      { value: '危化品生产加工和储存管控', label: '危化品生产加工和储存管控' },
      { value: '高风险工业设施运行管控', label: '高风险工业设施运行管控' }
    ]
  },
  {
    value: '能源',
    label: '能源',
    children: [
      { value: '电力生产', label: '电力生产' },
      { value: '电力传输', label: '电力传输' },
      { value: '电力调度', label: '电力调度' },
      { value: '油气开采', label: '油气开采' },
      { value: '炼化加工', label: '炼化加工' },
      { value: '油气输送', label: '油气输送' },
      { value: '油气储储', label: '油气储储' },
      { value: '煤炭开采', label: '煤炭开采' },
      { value: '煤化工', label: '煤化工' }
    ]
  },
  {
    value: '金融',
    label: '金融',
    children: [
      { value: '银行运营', label: '银行运营' },
      { value: '证券期货交易', label: '证券期货交易' },
      { value: '清算支付', label: '清算支付' },
      { value: '保险运营', label: '保险运营' },
      { value: '客运服务', label: '客运服务' },
      { value: '货运服务', label: '货运服务' },
      { value: '运输生产', label: '运输生产' },
      { value: '车站运行', label: '车站运行' },
      { value: '空管通信管控', label: '空管通信管控' }
    ]
  },
  {
    value: '水利',
    label: '水利',
    children: [
      { value: '水库调度运行', label: '水库调度运行' },
      { value: '长距离输水管控', label: '长距离输水管控' },
      { value: '城市水源地管控', label: '城市水源地管控' }
    ]
  },
  {
    value: '医疗卫生',
    label: '医疗卫生',
    children: [
      { value: '医院等卫生机构运行', label: '医院等卫生机构运行' },
      { value: '疫病控制', label: '疫病控制' },
      { value: '应急中心运行', label: '应急中心运行' }
    ]
  },
  {
    value: '环境保护',
    label: '环境保护',
    children: [
      { value: '环境监测及预警', label: '环境监测及预警' },
      { value: '企业运营管理', label: '企业运营管理' }
    ]
  },
  {
    value: '市政',
    label: '市政',
    children: [
      { value: '水、暖、气供应管理', label: '水、暖、气供应管理' },
      { value: '城市轨道交通', label: '城市轨道交通' },
      { value: '污水处理', label: '污水处理' },
      { value: '智慧城市运行及管控', label: '智慧城市运行及管控' }
    ]
  },
  {
    value: '政府部门',
    label: '政府部门',
    children: [
      { value: '政务网站运行', label: '政务网站运行' }
    ]
  },
  {
    value: '电信与互联网',
    label: '电信与互联网',
    children: [
      { value: '语音、数据、互联网基础网络及支撑系统', label: '语音、数据、互联网基础网络及支撑系统' },
      { value: '域名解析服务和国家顶级域名系统管理', label: '域名解析服务和国家顶级域名系统管理' },
      { value: '数据中心/云服务', label: '数据中心/云服务' },
      { value: '广播电视节目制作与播出传输', label: '广播电视节目制作与播出传输' }
    ]
  }
]

// 表单数据
const formRef = ref()
const formData = reactive<FormData>({
  systemName: '',
  systemType: undefined,
  affiliation: '',
  isCritical: undefined,
  onlineTime: undefined,
  industry: undefined,
  icpRecordStatus: undefined,
  icpRecordNumber: '',
  securityLevel: undefined,
  systemDomainList: [],
  systemUrlList: [],
  systemIpPortList: [],
  dnsServerDomainList: [],
  userScale: undefined,
  keyBusinessComponents: undefined,
  importance: undefined,
  connectedToInternet: undefined,
  serviceTarget: [],
  systemDescription: '',
  systemHead: '',
  systemHeadPhone: '',
  systemHeadEmail: '',
  systemHeadAddress: '',
  systemScreenshot: [],
  hardwareInfo: '',
  softwareInfo: '',
  networkInfo: '',
  portInfo: '',
  roomInfo: '',
  cloudPlatformInfo: '',
  emergencyInfo: '',
  businessInfo: ''
})

// 控制显示
const visible = ref(false)

// 文件上传相关
const fileList = ref<UploadProps['fileList']>([])
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')

// 上传前验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片大小不能超过5MB！')
    return false
  }
  return false // 阻止默认上传行为
}

// 自定义上传
const handleUpload: UploadProps['customRequest'] = ({ file, onSuccess }) => {
  // 读取文件为Base64
  const reader = new FileReader()
  reader.readAsDataURL(file as File)
  reader.onload = () => {
    setTimeout(() => {
      onSuccess?.('ok')
      message.success('上传成功')
    }, 500)
  }
}

// 预览图片
const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}

// 关闭预览
const handleCancelPreview = () => {
  previewVisible.value = false
}

// 删除文件
const handleRemove = () => {
  // 文件列表会自动更新
}

// 获取Base64
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// 级联选择器过滤函数
const filter = (inputValue: string, path: any[]) => {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
}

// 监听 props.open 变化
watch(() => props.open, (newVal) => {
  visible.value = newVal
  if (newVal) {
    // 如果有传入数据，填充表单
    if (props.data) {
      Object.assign(formData, props.data)
      // 恢复文件列表
      if (props.data.systemScreenshot && Array.isArray(props.data.systemScreenshot)) {
        fileList.value = props.data.systemScreenshot
      }
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
    systemName: '',
    systemType: undefined,
    affiliation: '',
    isCritical: undefined,
    onlineTime: undefined,
    industry: undefined,
    icpRecordStatus: undefined,
    icpRecordNumber: '',
    securityLevel: undefined,
    systemDomainList: [],
    systemUrlList: [],
    systemIpPortList: [],
    dnsServerDomainList: [],
    userScale: undefined,
    keyBusinessComponents: undefined,
    importance: undefined,
    connectedToInternet: undefined,
    serviceTarget: [],
    systemDescription: '',
    systemHead: '',
    systemHeadPhone: '',
    systemHeadEmail: '',
    systemHeadAddress: '',
    systemScreenshot: [],
    hardwareInfo: '',
    softwareInfo: '',
    networkInfo: '',
    portInfo: '',
    roomInfo: '',
    cloudPlatformInfo: '',
    emergencyInfo: '',
    businessInfo: ''
  })
  fileList.value = []
  formRef.value?.resetFields()
}

// 添加系统域名
const addSystemDomain = () => {
  formData.systemDomainList.push('')
}

// 删除系统域名
const removeSystemDomain = (index: number) => {
  formData.systemDomainList.splice(index, 1)
}

// 添加系统URL
const addSystemUrl = () => {
  formData.systemUrlList.push('')
}

// 删除系统URL
const removeSystemUrl = (index: number) => {
  formData.systemUrlList.splice(index, 1)
}

// 添加系统IP
const addSystemIp = () => {
  formData.systemIpPortList.push({ ip: '', port: '' })
}

// 删除系统IP
const removeSystemIp = (index: number) => {
  formData.systemIpPortList.splice(index, 1)
}

// 添加DNS服务器域名
const addDnsServerDomain = () => {
  formData.dnsServerDomainList.push('')
}

// 删除DNS服务器域名
const removeDnsServerDomain = (index: number) => {
  formData.dnsServerDomainList.splice(index, 1)
}

// 确定
const handleOk = async () => {
  try {
    await formRef.value.validate()
    // 保存文件列表到表单数据
    formData.systemScreenshot = fileList.value
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

.upload-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>
