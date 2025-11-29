<template>
  <a-modal v-model:open="visible" :title="title" :width="1100" @ok="handleOk" @cancel="handleCancel" okText="保存"
    cancelText="取消">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
      <!-- 基本信息 -->
      <div class="form-section-title">基本信息</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="数据名称" name="dataName" :rules="[{ required: true, message: '请输入数据名称' }]">
            <a-input v-model:value="formData.dataName" placeholder="请输入数据名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="数据形态" name="dataFormat">
            <a-select v-model:value="formData.dataFormat" placeholder="请选择数据形态">
              <a-select-option v-for="item in dataFormatOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="数据类型" name="dataType" :rules="[{ required: true, message: '请选择数据类型' }]">
            <a-select v-model:value="formData.dataType" placeholder="请选择数据类型">
              <a-select-option v-for="item in dataTypeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="数据增量（字节）" name="dataIncrement">
            <a-input v-model:value="formData.dataIncrement" placeholder="请输入数据增量" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="数据总量" name="dataTotal" :rules="[{ required: true, message: '请输入数据总量' }]">
            <a-input v-model:value="formData.dataTotal" placeholder="请输入数据总量" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="数据条数目" name="dataCount">
            <a-input v-model:value="formData.dataCount" placeholder="请输入数据条数目" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属单位" name="belongUnit" :rules="[{ required: true, message: '请输入所属单位' }]">
            <a-input v-model:value="formData.belongUnit" placeholder="请输入所属单位" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="数据产生时间" name="dataGenerateTime">
            <a-date-picker v-model:value="formData.dataGenerateTime" :locale="locale" placeholder="选择日期和时间" show-time
              format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="数据重要度" name="dataImportance">
            <a-select v-model:value="formData.dataImportance" placeholder="请选择数据重要度">
              <a-select-option v-for="item in dataImportanceOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 联系人 -->
      <div class="form-section-title">联系人</div>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="负责人" name="principal" :rules="[{ required: true, message: '请输入负责人姓名' }]">
            <a-input v-model:value="formData.principal" placeholder="请输入负责人姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="负责人电话" name="principalPhone" :rules="[{ required: true, message: '请输入负责人电话' }]">
            <a-input v-model:value="formData.principalPhone" placeholder="请输入电话" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="负责人邮箱" name="principalEmail" :rules="[{ required: true, message: '请输入负责人邮箱' }]">
            <a-input v-model:value="formData.principalEmail" placeholder="请输入邮箱" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="负责人联系地址" name="principalAddress">
            <a-input v-model:value="formData.principalAddress" placeholder="请输入联系地址" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

dayjs.locale('zh-cn')

interface FormData {
  dataName: string
  dataFormat?: string
  dataType?: string
  dataIncrement: string
  dataTotal: string
  dataCount: string
  belongUnit: string
  dataGenerateTime: any
  dataImportance?: string
  principal: string
  principalPhone: string
  principalEmail: string
  principalAddress: string
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
const dataFormatOptions = [
  { label: '电子文档', value: '电子文档' },
  { label: '数据库', value: '数据库' },
  { label: '其他', value: '其他' }
]

const dataTypeOptions = [
  { label: '业务数据', value: '业务数据' },
  { label: '办公数据', value: '办公数据' },
  { label: '密码数据', value: '密码数据' },
  { label: '系统维护管理数据', value: '系统维护管理数据' },
  { label: '个人信息数据', value: '个人信息数据' },
  { label: '其他', value: '其他' }
]

const dataImportanceOptions = [
  { label: '一般', value: '一般' },
  { label: '重要', value: '重要' },
  { label: '非常重要', value: '非常重要' },
]

// 表单数据
const formRef = ref()
const formData = reactive<FormData>({
  dataName: '',
  dataFormat: undefined,
  dataType: undefined,
  dataIncrement: '',
  dataTotal: '',
  dataCount: '',
  belongUnit: '',
  dataGenerateTime: undefined,
  dataImportance: undefined,
  principal: '',
  principalPhone: '',
  principalEmail: '',
  principalAddress: ''
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
    dataName: '',
    dataFormat: undefined,
    dataType: undefined,
    dataIncrement: '',
    dataTotal: '',
    dataCount: '',
    belongUnit: '',
    dataGenerateTime: undefined,
    dataImportance: undefined,
    principal: '',
    principalPhone: '',
    principalEmail: '',
    principalAddress: ''
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
