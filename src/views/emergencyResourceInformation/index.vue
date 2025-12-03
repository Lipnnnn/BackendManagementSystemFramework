<template>
  <div class="organizational-structure">
    <!-- 操作按钮区域 -->
    <div class="action-section">
      <a-space>
        <a-button @click="handleDelete">
          <DeleteOutlined /> 删除
        </a-button>
        <a-button @click="handleExport">
          <DownloadOutlined /> 导出
        </a-button>
      </a-space>
      <a-space>
        <a-button type="primary" @click="handleAdd">
          <PlusOutlined /> 新增
        </a-button>
      </a-space>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <a-table :columns="columns" :data-source="displayData" :row-selection="rowSelection" :pagination="pagination"
        :scroll="{ x: 1200 }" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'resourceType'">
            <span>{{ Array.isArray(record.resourceType) ? record.resourceType.join('、') : (record.resourceType || '-')
              }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleView(record)">查看</a-button>
              <a-button type="link" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" danger @click="handleDeleteRow(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <AddOrEdit v-model:open="modalVisible" :title="modalTitle" :data="editData" @ok="handleModalOk"
      @cancel="handleModalCancel" />

    <!-- 查看详情弹窗 -->
    <ViewDetail v-model:open="viewVisible" :data="viewData" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
import type { TableColumnsType, TableProps } from 'ant-design-vue'
import * as XLSX from 'xlsx'
import AddOrEdit from './components/addOrEdit.vue'
import ViewDetail from './components/viewDetail.vue'

// 数据类型定义
interface OrganizationItem {
  key: string
  resourceName: string
  resourceType: string | string[]
  ownerUnit: string
  resourceAvailability: string
  teamSize?: string
  systemToolList?: string
  // 完整表单数据，用于编辑回显
  emergencyContact?: string
  emergencyContactPhone?: string
  emergencyContactEmail?: string
  emergencyContactAddress?: string
  backupEmergencyContact?: string
  backupEmergencyContactPhone?: string
  backupEmergencyContactEmail?: string
  backupEmergencyContactAddress?: string
}

// 表格列定义
const columns: TableColumnsType = [
  {
    title: '应急资源名称',
    dataIndex: 'resourceName',
    key: 'resourceName',
    width: 200
  },
  {
    title: '应急资源类型',
    dataIndex: 'resourceType',
    key: 'resourceType',
    width: 250
  },
  {
    title: '所属单位',
    dataIndex: 'ownerUnit',
    key: 'ownerUnit',
    width: 200
  },
  {
    title: '资源可用性',
    dataIndex: 'resourceAvailability',
    key: 'resourceAvailability',
    width: 150
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

// 模拟数据
const allData = ref<OrganizationItem[]>([])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100'],
  locale: {
    items_per_page: '条/页'
  }
})

// 显示的数据（分页后）
const displayData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return allData.value.slice(start, end)
})

// 选中的行
const selectedRowKeys = ref<string[]>([])
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  }
}))

// 弹窗相关
const modalVisible = ref(false)
const modalTitle = ref('新增')
const editData = ref()

// 查看详情相关
const viewVisible = ref(false)
const viewData = ref()

// 批量删除
const handleDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的数据')
    return
  }

  const newData = allData.value.filter(item => !selectedRowKeys.value.includes(item.key))
  allData.value = newData
  pagination.total = newData.length
  message.success(`成功删除 ${selectedRowKeys.value.length} 条数据`)
  selectedRowKeys.value = []
}

// 导出
const handleExport = () => {
  if (allData.value.length === 0) {
    message.warning('暂无数据可导出')
    return
  }

  // 准备导出数据
  const exportData = allData.value.map(item => {
    return {
      '应急资源名称': item.resourceName || '-',
      '资源可用性': item.resourceAvailability || '-',
      '所属单位': item.ownerUnit || '-',
      '应急资源类型': Array.isArray(item.resourceType) ? item.resourceType.join('、') : (item.resourceType || '-'),
      '团队规模': item.teamSize || '-',
      '系统工具列表': item.systemToolList || '-',
      '应急联系人': item.emergencyContact || '-',
      '应急联系人电话': item.emergencyContactPhone || '-',
      '应急联系人邮箱': item.emergencyContactEmail || '-',
      '应急联系人地址': item.emergencyContactAddress || '-',
      '备用应急联系人': item.backupEmergencyContact || '-',
      '备用应急联系人电话': item.backupEmergencyContactPhone || '-',
      '备用应急联系人邮箱': item.backupEmergencyContactEmail || '-',
      '备用应急联系人地址': item.backupEmergencyContactAddress || '-'
    }
  })

  // 创建工作簿
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '应急资源信息')

  // 生成文件名（带时间戳）
  const fileName = `应急资源信息_${new Date().getTime()}.xlsx`

  // 导出文件
  XLSX.writeFile(wb, fileName)
  message.success('导出成功')
}

// 新增
const handleAdd = () => {
  modalTitle.value = '新增'
  editData.value = undefined
  modalVisible.value = true
}

// 查看
const handleView = (record: OrganizationItem) => {
  viewData.value = {
    resourceName: record.resourceName,
    resourceAvailability: record.resourceAvailability,
    ownerUnit: record.ownerUnit,
    resourceType: record.resourceType,
    teamSize: record.teamSize,
    systemToolList: record.systemToolList,
    emergencyContact: record.emergencyContact,
    emergencyContactPhone: record.emergencyContactPhone,
    emergencyContactEmail: record.emergencyContactEmail,
    emergencyContactAddress: record.emergencyContactAddress,
    backupEmergencyContact: record.backupEmergencyContact,
    backupEmergencyContactPhone: record.backupEmergencyContactPhone,
    backupEmergencyContactEmail: record.backupEmergencyContactEmail,
    backupEmergencyContactAddress: record.backupEmergencyContactAddress
  }
  viewVisible.value = true
}

// 编辑
const handleEdit = (record: OrganizationItem) => {
  modalTitle.value = '编辑'
  editData.value = {
    resourceName: record.resourceName || '',
    resourceAvailability: record.resourceAvailability || '',
    ownerUnit: record.ownerUnit || '',
    resourceType: record.resourceType || '',
    teamSize: record.teamSize || '',
    systemToolList: record.systemToolList || '',
    emergencyContact: record.emergencyContact || '',
    emergencyContactPhone: record.emergencyContactPhone || '',
    emergencyContactEmail: record.emergencyContactEmail || '',
    emergencyContactAddress: record.emergencyContactAddress || '',
    backupEmergencyContact: record.backupEmergencyContact || '',
    backupEmergencyContactPhone: record.backupEmergencyContactPhone || '',
    backupEmergencyContactEmail: record.backupEmergencyContactEmail || '',
    backupEmergencyContactAddress: record.backupEmergencyContactAddress || '',
    key: record.key
  }
  modalVisible.value = true
}

// 删除单行
const handleDeleteRow = (record: OrganizationItem) => {
  const newData = allData.value.filter(item => item.key !== record.key)
  allData.value = newData
  pagination.total = newData.length
  message.success('删除成功')
}

// 表格变化
const handleTableChange: TableProps['onChange'] = (pag) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
}

// 弹窗确定
const handleModalOk = (data: any) => {
  if (editData.value?.key) {
    // 编辑
    const index = allData.value.findIndex(item => item.key === editData.value.key)
    if (index > -1 && allData.value[index]) {
      allData.value[index] = {
        key: editData.value.key,
        resourceName: data.resourceName,
        resourceAvailability: data.resourceAvailability,
        ownerUnit: data.ownerUnit,
        resourceType: data.resourceType,
        teamSize: data.teamSize,
        systemToolList: data.systemToolList,
        // 保存完整表单数据
        emergencyContact: data.emergencyContact,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactEmail: data.emergencyContactEmail,
        emergencyContactAddress: data.emergencyContactAddress,
        backupEmergencyContact: data.backupEmergencyContact,
        backupEmergencyContactPhone: data.backupEmergencyContactPhone,
        backupEmergencyContactEmail: data.backupEmergencyContactEmail,
        backupEmergencyContactAddress: data.backupEmergencyContactAddress
      }
    }
    message.success('编辑成功')
  } else {
    // 新增
    const newItem: OrganizationItem = {
      key: Date.now().toString(),
      resourceName: data.resourceName,
      resourceAvailability: data.resourceAvailability,
      ownerUnit: data.ownerUnit,
      resourceType: data.resourceType,
      teamSize: data.teamSize,
      systemToolList: data.systemToolList,
      // 保存完整表单数据
      emergencyContact: data.emergencyContact,
      emergencyContactPhone: data.emergencyContactPhone,
      emergencyContactEmail: data.emergencyContactEmail,
      emergencyContactAddress: data.emergencyContactAddress,
      backupEmergencyContact: data.backupEmergencyContact,
      backupEmergencyContactPhone: data.backupEmergencyContactPhone,
      backupEmergencyContactEmail: data.backupEmergencyContactEmail,
      backupEmergencyContactAddress: data.backupEmergencyContactAddress
    }
    allData.value.push(newItem)
    message.success('新增成功')
  }

  pagination.total = allData.value.length
}

// 弹窗取消
const handleModalCancel = () => {
  // 取消操作
}
</script>

<style scoped>
.organizational-structure {
  padding: 20px;
  background: #f0f2f5;
}

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #000;
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-input {
  flex: 1;
  min-width: 150px;
}

.filter-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
}

.action-section {
  background: white;
  padding: 16px 20px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-section {
  background: white;
  padding: 20px;
  border-radius: 4px;
}

:deep(.ant-table) {
  font-size: 14px;
}

:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
}

:deep(.ant-pagination) {
  margin-top: 16px;
  text-align: right;
}
</style>