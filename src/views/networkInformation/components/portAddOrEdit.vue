<template>
  <a-modal v-model:open="visible" :title="title" :width="1100" @ok="handleOk" @cancel="handleCancel" okText="保存"
    cancelText="取消">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 8, style: { textAlign: 'right' } }"
      :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="端口" name="portNumber" :rules="[{ required: true, message: '请输入端口号' }]">
            <a-input v-model:value="formData.portNumber" placeholder="请输入端口号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="接入IP地址" name="ipAddress">
            <div style="display: flex; gap: 8px; align-items: center;">
              <a-select v-model:value="formData.ipVersion" placeholder="IPv4" style="width: 120px;">
                <a-select-option value="IPv4">IPv4</a-select-option>
                <a-select-option value="IPv6">IPv6</a-select-option>
              </a-select>
              <a-input v-model:value="formData.ipAddress" placeholder="请输入IP地址" style="flex: 1;" />
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="端口服务" name="portService" :rules="[{ required: true, message: '请输入端口服务' }]">
            <a-input v-model:value="formData.portService" placeholder="请输入端口服务" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="传输层协议" name="protocol">
            <a-select v-model:value="formData.protocol" placeholder="请选择传输层协议">
              <a-select-option value="TCP">TCP</a-select-option>
              <a-select-option value="UDP">UDP</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位" name="unitName" :rules="[{ required: true, message: '请输入单位名称' }]">
            <a-input v-model:value="formData.unitName" placeholder="请输入单位名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否公共端口" name="isPublicPort">
            <a-select v-model:value="formData.isPublicPort" placeholder="请选择是否公共端口">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="最后检测时间" name="lastCheckTime">
            <a-date-picker v-model:value="formData.lastCheckTime" placeholder="请选择日期" style="width: 100%;"
              :locale="locale" format="YYYY-MM-DD HH:mm:ss"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

interface FormData {
  portNumber: string
  ipAddress: string
  ipVersion: string
  portService: string
  protocol?: string
  unitName: string
  isPublicPort?: boolean
  lastCheckTime?: Dayjs | null
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
  portNumber: '',
  ipAddress: '',
  ipVersion: 'IPv4',
  portService: '',
  protocol: undefined,
  unitName: '',
  isPublicPort: undefined,
  lastCheckTime: null
})

// 控制显示
const visible = ref(false)

// 监听 props.open 变化
watch(() => props.open, (newVal) => {
  visible.value = newVal
  if (newVal) {
    // 如果有传入数据，填充表单
    if (props.data) {
      Object.assign(formData, {
        ...props.data,
        lastCheckTime: props.data.lastCheckTime ? dayjs(props.data.lastCheckTime) : null
      })
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
    portNumber: '',
    ipAddress: '',
    ipVersion: 'IPv4',
    portService: '',
    protocol: undefined,
    unitName: '',
    isPublicPort: undefined,
    lastCheckTime: null
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
