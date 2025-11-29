<template>
  <a-modal v-model:open="visible" :title="title" :width="1100" @ok="handleOk" @cancel="handleCancel" okText="保存"
    cancelText="取消">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="机房名称" name="roomName" :rules="[{ required: true, message: '请输入机房信息' }]">
            <a-input v-model:value="formData.roomName" placeholder="请输入机房信息" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="使用主体单位" name="mainUnit" :rules="[{ required: true, message: '请输入使用主体单位' }]">
            <a-input v-model:value="formData.mainUnit" placeholder="请输入使用主体单位" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属区域" name="region" :rules="[{ required: true, message: '请选择所属区域' }]">
            <a-cascader v-model:value="formData.region" :options="regionCascaderOptions" placeholder="请选择所属区域"
              :show-search="{ filter }" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="详细地址" name="detailAddress" :rules="[{ required: true, message: '请输入详细地址' }]">
            <a-input v-model:value="formData.detailAddress" placeholder="请输入详细地址" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="经纬度" name="coordinates">
            <a-space>
              <a-input v-model:value="formData.longitude" placeholder="请输入经度" style="width: 120px;" />
              <a-input v-model:value="formData.latitude" placeholder="请输入纬度" style="width: 120px;" />
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 机房联系人 -->
      <div class="form-section-title">机房联系人</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="运营单位" name="operatingUnit" :rules="[{ required: true, message: '请输入运营单位' }]">
            <a-input v-model:value="formData.operatingUnit" placeholder="请输入运营单位" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="机房联系系人" name="contactPerson" :rules="[{ required: true, message: '请输入机房联系系人姓名' }]">
            <a-input v-model:value="formData.contactPerson" placeholder="请输入机房联系系人姓名" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系电话" name="contactPhone" :rules="[{ required: true, message: '请输入联系电话' }]">
            <a-input v-model:value="formData.contactPhone" placeholder="请输入联系电话" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="邮箱" name="contactEmail" :rules="[{ required: true, message: '请输入邮箱' }]">
            <a-input v-model:value="formData.contactEmail" placeholder="请输入邮箱" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系地址" name="contactAddress">
            <a-input v-model:value="formData.contactAddress" placeholder="请输入联系地址" />
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
  roomName: string
  mainUnit: string
  region?: string[]
  detailAddress: string
  longitude: string
  latitude: string
  operatingUnit: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  contactAddress: string
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

// 级联选择器搜索过滤
const filter = (inputValue: string, path: any[]) => {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
}

// 表单数据
const formRef = ref()
const formData = reactive<FormData>({
  roomName: '',
  mainUnit: '',
  region: undefined,
  detailAddress: '',
  longitude: '',
  latitude: '',
  operatingUnit: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: ''
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
    roomName: '',
    mainUnit: '',
    region: undefined,
    detailAddress: '',
    longitude: '',
    latitude: '',
    operatingUnit: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: ''
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
