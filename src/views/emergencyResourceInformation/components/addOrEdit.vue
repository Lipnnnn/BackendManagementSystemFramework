<template>
  <a-modal v-model:open="visible" :title="title" :width="1100" @ok="handleOk" @cancel="handleCancel" okText="保存"
    cancelText="取消">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应急资源名称" name="resourceName">
            <a-input v-model:value="formData.resourceName" placeholder="请输入资源名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="资源可用性" name="resourceAvailability">
            <a-select v-model:value="formData.resourceAvailability" placeholder="请选择可用性" allow-clear>
              <a-select-option value="可用">可用</a-select-option>
              <a-select-option value="不可用">不可用</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位" name="ownerUnit" :rules="[{ required: true, message: '请输入所属单位' }]">
            <a-input v-model:value="formData.ownerUnit" placeholder="请输入所属单位" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="应急资源类型" name="resourceType" :rules="[{ required: true, message: '请选择应急资源类型' }]">
            <a-select v-model:value="formData.resourceType" mode="multiple" placeholder="请选择应急资源类型" allow-clear>
              <a-select-option value="网络安全专家">网络安全专家</a-select-option>
              <a-select-option value="应急团队">应急团队</a-select-option>
              <a-select-option value="关键信息基础设施应急相应人">关键信息基础设施应急相应人</a-select-option>
              <a-select-option value="系统工具">系统工具</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12" v-if="formData.resourceType && formData.resourceType.includes('应急团队')">
          <a-form-item label="团队规模" name="teamSize">
            <a-input v-model:value="formData.teamSize" placeholder="请输入团队规模" />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="formData.resourceType && formData.resourceType.includes('系统工具')">
          <a-form-item label="系统工具列表" name="systemToolList">
            <a-input v-model:value="formData.systemToolList" placeholder="请输入系统工具列表" />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 联系人 -->
      <div class="form-section-title">联系人</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应急联系人" name="emergencyContact" :rules="[{ required: true, message: '请输入应急联系人姓名' }]">
            <a-input v-model:value="formData.emergencyContact" placeholder="请输入应急联系人姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="应急联系人电话" name="emergencyContactPhone"
            :rules="[{ required: true, message: '请输入应急联系人电话' }]">
            <a-input v-model:value="formData.emergencyContactPhone" placeholder="请输入应急联系人联系电话" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应急联系人邮箱" name="emergencyContactEmail"
            :rules="[{ required: true, message: '请输入应急联系人邮箱' }]">
            <a-input v-model:value="formData.emergencyContactEmail" placeholder="请输入应急联系人邮箱" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="应急联系人地址" name="emergencyContactAddress">
            <a-input v-model:value="formData.emergencyContactAddress" placeholder="请输入应急联系人联系地址" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="备用应急联系人" name="backupEmergencyContact">
            <a-input v-model:value="formData.backupEmergencyContact" placeholder="请输入联系人姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="备用应急联系人电话" name="backupEmergencyContactPhone">
            <a-input v-model:value="formData.backupEmergencyContactPhone" placeholder="请输入备用应急联系人联系电话" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="备用应急联系人邮箱" name="backupEmergencyContactEmail">
            <a-input v-model:value="formData.backupEmergencyContactEmail" placeholder="请输入备用应急联系人邮箱" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="备用应急联系人地址" name="backupEmergencyContactAddress">
            <a-input v-model:value="formData.backupEmergencyContactAddress" placeholder="请输入备用应急联系人联系地址" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface FormData {
  resourceName: string
  resourceAvailability: string | null
  ownerUnit: string
  resourceType: string[]
  teamSize?: string
  systemToolList?: string
  emergencyContact: string
  emergencyContactPhone: string
  emergencyContactEmail: string
  emergencyContactAddress: string
  backupEmergencyContact: string
  backupEmergencyContactPhone: string
  backupEmergencyContactEmail: string
  backupEmergencyContactAddress: string
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
  resourceName: '',
  resourceAvailability: null,
  ownerUnit: '',
  resourceType: [],
  teamSize: '',
  systemToolList: '',
  emergencyContact: '',
  emergencyContactPhone: '',
  emergencyContactEmail: '',
  emergencyContactAddress: '',
  backupEmergencyContact: '',
  backupEmergencyContactPhone: '',
  backupEmergencyContactEmail: '',
  backupEmergencyContactAddress: ''
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
    resourceName: '',
    resourceAvailability: null,
    ownerUnit: '',
    resourceType: [],
    teamSize: '',
    systemToolList: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    emergencyContactAddress: '',
    backupEmergencyContact: '',
    backupEmergencyContactPhone: '',
    backupEmergencyContactEmail: '',
    backupEmergencyContactAddress: ''
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
