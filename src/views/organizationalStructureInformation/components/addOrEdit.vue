<template>
  <a-modal v-model:open="visible" :title="title" :width="1100" @ok="handleOk" @cancel="handleCancel" okText="保存"
    cancelText="取消">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="单位名称" name="unitName" :rules="[{ required: true, message: '请输入单位名称' }]">
            <a-input v-model:value="formData.unitName" placeholder="请输入单位名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="单位类型" name="unitType">
            <a-cascader v-model:value="formData.unitType" :options="unitTypeOptions" placeholder="请选择单位类型"
              :show-search="{ filter }" change-on-select />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属区域" name="region">
            <a-cascader v-model:value="formData.region" :options="regionCascaderOptions" placeholder="请选择所属区域"
              :show-search="{ filter }" />
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
          <a-form-item label="统一社会信用代码" name="creditCode" :rules="[{ required: true, message: '请输入统一社会信用代码' }]">
            <a-input v-model:value="formData.creditCode" placeholder="请输入统一社会信用代码" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所在国家地区" name="country">
            <a-input v-model:value="formData.country" disabled />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="单位具体地址" name="address" :rules="[{ required: true, message: '请输入单位具体地址' }]">
            <a-input v-model:value="formData.address" placeholder="请输入单位具体地址" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="经纬度" name="coordinates">
            <a-space>
              <a-input v-model:value="formData.longitude" placeholder="请输入经度" style="width: 120px;" />
              <a-input v-model:value="formData.latitude" placeholder="请输入纬度" style="width: 120px;" />
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络监管部门名称" name="networkDept">
            <a-input v-model:value="formData.networkDept" placeholder="请输入网络监管部门名称" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="行政主管部门名称" name="adminDept">
            <a-input v-model:value="formData.adminDept" placeholder="请输入行政主管部门名称" />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 补充信息 -->
      <div class="form-section-title">补充信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否有本地大型平台" name="hasLocalPlatform" :rules="[{ required: true, message: '请选择是否有本地大型平台' }]">
            <a-select v-model:value="formData.hasLocalPlatform" placeholder="请选择">
              <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否有本地态势感知平台" name="hasSituationPlatform"
            :rules="[{ required: true, message: '请选择是否有本地态势感知平台' }]">
            <a-select v-model:value="formData.hasSituationPlatform" placeholder="请选择">
              <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否有外电子大屏" name="hasExternalScreen" :rules="[{ required: true, message: '请选择是否有外电子大屏' }]">
            <a-select v-model:value="formData.hasExternalScreen" placeholder="请选择">
              <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 联系人 -->
      <div class="form-section-title">联系人</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="单位负责人" name="unitHead">
            <a-input v-model:value="formData.unitHead" placeholder="请输入单位负责人姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="办公电话" name="unitHeadPhone">
            <a-input v-model:value="formData.unitHeadPhone" placeholder="请输入单位负责人办公电话" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系邮箱" name="unitHeadEmail">
            <a-input v-model:value="formData.unitHeadEmail" placeholder="请输入单位负责人联系邮箱" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应急联系人" name="emergencyContact" :rules="[{ required: true, message: '请输入应急联系人姓名' }]">
            <a-input v-model:value="formData.emergencyContact" placeholder="请输入应急联系人姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="办公电话" name="emergencyPhone" :rules="[{ required: true, message: '请输入应急联系人办公电话' }]">
            <a-input v-model:value="formData.emergencyPhone" placeholder="请输入应急联系人办公电话" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系邮箱" name="emergencyEmail" :rules="[{ required: true, message: '请输入应急联系人联系邮箱' }]">
            <a-input v-model:value="formData.emergencyEmail" placeholder="请输入应急联系人联系邮箱" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="职务职称" name="emergencyPosition">
            <a-input v-model:value="formData.emergencyPosition" placeholder="请输入应急联系人职务职称" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="详细地址" name="emergencyAddress" :rules="[{ required: true, message: '请输入应急联系人详细地址' }]">
            <a-input v-model:value="formData.emergencyAddress" placeholder="请输入应急联系人详细地址" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="网络安全分管领导" name="securityLeader">
            <a-input v-model:value="formData.securityLeader" placeholder="请输入网络安全分管领导姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="办公电话" name="securityLeaderPhone">
            <a-input v-model:value="formData.securityLeaderPhone" placeholder="请输入网络安全分管领导办公电话" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系邮箱" name="securityLeaderEmail">
            <a-input v-model:value="formData.securityLeaderEmail" placeholder="请输入网络安全分管领导联系邮箱" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="职务职称" name="securityLeaderPosition">
            <a-input v-model:value="formData.securityLeaderPosition" placeholder="请输入网络安全分管领导职务职称" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { _areaData } from '@/data/areaData'

interface FormData {
  unitName: string
  unitType?: string[]
  region?: string[]
  industry?: string
  creditCode: string
  country: string
  address: string
  longitude: string
  latitude: string
  networkDept: string
  adminDept: string
  hasLocalPlatform?: string
  hasSituationPlatform?: string
  hasExternalScreen?: string
  unitHead: string
  unitHeadPhone: string
  unitHeadEmail: string
  emergencyContact: string
  emergencyPhone: string
  emergencyEmail: string
  emergencyPosition: string
  emergencyAddress: string
  securityLeader: string
  securityLeaderPhone: string
  securityLeaderEmail: string
  securityLeaderPosition: string
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
const regionCascaderOptions = _areaData

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
const unitTypeOptions = [
  {
    value: '企业',
    label: '企业',
    children: [
      { value: '公司', label: '公司' },
      { value: '非公司制企业法人', label: '非公司制企业法人' },
      { value: '企业分支机构', label: '企业分支机构' },
      { value: '个人独资企业、合伙企业', label: '个人独资企业、合伙企业' },
      { value: '其他企业', label: '其他企业' }
    ]
  },
  {
    value: '机关',
    label: '机关',
    children: [
      { value: '中国共产党', label: '中国共产党' },
      { value: '国家权力机关法人', label: '国家权力机关法人' },
      { value: '国家行政机关法人', label: '国家行政机关法人' },
      { value: '国家司法机关法人', label: '国家司法机关法人' },
      { value: '政协组织', label: '政协组织' },
      { value: '民主党派', label: '民主党派' },
      { value: '人民解放军、武警部队', label: '人民解放军、武警部队' },
      { value: '其他机关', label: '其他机关' }
    ]
  },
  {
    value: '社会团体',
    label: '社会团体',
    children: [
      { value: '社会团体法人', label: '社会团体法人' },
      { value: '社会团体分支、代表机构', label: '社会团体分支、代表机构' },
      { value: '其他社会团体', label: '其他社会团体' }
    ]
  },
  {
    value: '其他组织机构',
    label: '其他组织机构',
    children: [
      { value: '民办非企业单位', label: '民办非企业单位' },
      { value: '基金会', label: '基金会' },
      { value: '宗教活动场所', label: '宗教活动场所' },
      { value: '农村村民委员会', label: '农村村民委员会' },
      { value: '城市居民委员会', label: '城市居民委员会' },
      { value: '自定义区', label: '自定义区' },
      { value: '其他组织机构', label: '其他组织机构' }
    ]
  }
]

// 级联选择器搜索过滤
const filter = (inputValue: string, path: any[]) => {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
}

// 表单数据
const formRef = ref()
const formData = reactive<FormData>({
  unitName: '',
  unitType: undefined,
  region: undefined,
  industry: undefined,
  creditCode: '',
  country: 'China',
  address: '',
  longitude: '',
  latitude: '',
  networkDept: '',
  adminDept: '',
  hasLocalPlatform: undefined,
  hasSituationPlatform: undefined,
  hasExternalScreen: undefined,
  unitHead: '',
  unitHeadPhone: '',
  unitHeadEmail: '',
  emergencyContact: '',
  emergencyPhone: '',
  emergencyEmail: '',
  emergencyPosition: '',
  emergencyAddress: '',
  securityLeader: '',
  securityLeaderPhone: '',
  securityLeaderEmail: '',
  securityLeaderPosition: ''
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
    unitName: '',
    unitType: undefined,
    region: undefined,
    industry: undefined,
    creditCode: '',
    country: 'China',
    address: '',
    longitude: '',
    latitude: '',
    networkDept: '',
    adminDept: '',
    hasLocalPlatform: undefined,
    hasSituationPlatform: undefined,
    hasExternalScreen: undefined,
    unitHead: '',
    unitHeadPhone: '',
    unitHeadEmail: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyEmail: '',
    emergencyPosition: '',
    emergencyAddress: '',
    securityLeader: '',
    securityLeaderPhone: '',
    securityLeaderEmail: '',
    securityLeaderPosition: ''
  })
  formRef.value?.resetFields()
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
