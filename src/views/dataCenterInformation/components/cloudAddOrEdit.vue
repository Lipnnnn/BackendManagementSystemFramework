<template>
  <a-modal v-model:open="visible" :title="title" :width="1100" @ok="handleOk" @cancel="handleCancel" okText="保存"
    cancelText="取消">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 云平台信息 -->
      <div class="form-section-title">云平台信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="云平台名称" name="cloudName">
            <a-input v-model:value="formData.cloudName" placeholder="请输入云平台名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="云平台类型" name="cloudType">
            <a-select v-model:value="formData.cloudType" placeholder="选择云平台类型">
              <a-select-option value="公有云">公有云</a-select-option>
              <a-select-option value="政务云">政务云</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="运营单位" name="operatingUnit" :rules="[{ required: true, message: '请输入运营单位' }]">
            <a-input v-model:value="formData.operatingUnit" placeholder="请输入运营单位" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="使用主体单位" name="usingUnit" :rules="[{ required: true, message: '请输入使用主体单位' }]">
            <a-input v-model:value="formData.usingUnit" placeholder="请输入使用主体单位" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="是否在境内" name="isDomestic" :rules="[{ required: true, message: '请选择是否在境内' }]">
            <a-select v-model:value="formData.isDomestic" placeholder="是否在境内">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 联系人信息 -->
      <div class="form-section-title">联系人信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系人" name="contactPerson" :rules="[{ required: true, message: '请输入联系人姓名' }]">
            <a-input v-model:value="formData.contactPerson" placeholder="请输入联系人姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="联系电话" name="contactPhone" :rules="[{ required: true, message: '请输入联系电话' }]">
            <a-input v-model:value="formData.contactPhone" placeholder="请输入联系电话" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="邮箱" name="contactEmail" :rules="[{ required: true, message: '请输入邮箱' }]">
            <a-input v-model:value="formData.contactEmail" placeholder="请输入邮箱" />
          </a-form-item>
        </a-col>
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

interface FormData {
  cloudName: string
  cloudType: string | null
  operatingUnit: string
  usingUnit: string
  isDomestic: boolean | null
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

// 表单数据
const formRef = ref()
const formData = reactive<FormData>({
  cloudName: '',
  cloudType: null,
  operatingUnit: '',
  usingUnit: '',
  isDomestic: null,
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
    cloudName: '',
    cloudType: null,
    operatingUnit: '',
    usingUnit: '',
    isDomestic: null,
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
