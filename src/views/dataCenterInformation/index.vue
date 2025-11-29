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
        <template #bodyCell="{ column, record, index }">
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
  roomName: string
  roomLocation: string
  mainUnit: string
  operatingUnit: string
  // 完整表单数据，用于编辑回显
  region?: string[]
  detailAddress?: string
  longitude?: string
  latitude?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  contactAddress?: string
}

// 表格列定义
const columns: TableColumnsType = [
  {
    title: '机房名称',
    dataIndex: 'roomName',
    key: 'roomName',
    width: 200
  },
  {
    title: '机房位置',
    dataIndex: 'roomLocation',
    key: 'roomLocation',
    width: 300
  },
  {
    title: '使用主体单位',
    dataIndex: 'mainUnit',
    key: 'mainUnit',
    width: 200
  },
  {
    title: '运营单位',
    dataIndex: 'operatingUnit',
    key: 'operatingUnit',
    width: 200
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
  selectedRowKeys.value = []
  message.success(`成功删除 ${selectedRowKeys.value.length} 条数据`)
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
      '机房名称': item.roomName || '-',
      '使用主体单位': item.mainUnit || '-',
      '所属区域': Array.isArray(item.region) ? item.region.join(' / ') : '-',
      '详细地址': item.detailAddress || '-',
      '经度': item.longitude || '-',
      '纬度': item.latitude || '-',
      '运营单位': item.operatingUnit || '-',
      '机房联系系人': item.contactPerson || '-',
      '联系电话': item.contactPhone || '-',
      '邮箱': item.contactEmail || '-',
      '联系地址': item.contactAddress || '-'
    }
  })

  // 创建工作簿
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '机房信息')

  // 生成文件名（带时间戳）
  const fileName = `机房信息_${new Date().getTime()}.xlsx`

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
    roomName: record.roomName,
    mainUnit: record.mainUnit,
    region: record.region,
    detailAddress: record.detailAddress,
    longitude: record.longitude,
    latitude: record.latitude,
    operatingUnit: record.operatingUnit,
    contactPerson: record.contactPerson,
    contactPhone: record.contactPhone,
    contactEmail: record.contactEmail,
    contactAddress: record.contactAddress
  }
  viewVisible.value = true
}

// 编辑
const handleEdit = (record: OrganizationItem) => {
  modalTitle.value = '编辑'
  editData.value = {
    roomName: record.roomName,
    mainUnit: record.mainUnit,
    region: record.region,
    detailAddress: record.detailAddress || '',
    longitude: record.longitude || '',
    latitude: record.latitude || '',
    operatingUnit: record.operatingUnit || '',
    contactPerson: record.contactPerson || '',
    contactPhone: record.contactPhone || '',
    contactEmail: record.contactEmail || '',
    contactAddress: record.contactAddress || '',
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
  // 处理区域数据：将数组转换为字符串用于表格显示
  const regionStr = Array.isArray(data.region) ? data.region.join(' / ') : '-'

  if (editData.value?.key) {
    // 编辑
    const index = allData.value.findIndex(item => item.key === editData.value.key)
    if (index > -1 && allData.value[index]) {
      allData.value[index] = {
        key: editData.value.key,
        roomName: data.roomName,
        roomLocation: regionStr,
        mainUnit: data.mainUnit,
        operatingUnit: data.operatingUnit,
        // 保存完整表单数据
        region: data.region,
        detailAddress: data.detailAddress,
        longitude: data.longitude,
        latitude: data.latitude,
        contactPerson: data.contactPerson,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        contactAddress: data.contactAddress
      }
    }
    message.success('编辑成功')
  } else {
    // 新增
    const newItem: OrganizationItem = {
      key: Date.now().toString(),
      roomName: data.roomName,
      roomLocation: regionStr,
      mainUnit: data.mainUnit,
      operatingUnit: data.operatingUnit,
      // 保存完整表单数据
      region: data.region,
      detailAddress: data.detailAddress,
      longitude: data.longitude,
      latitude: data.latitude,
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      contactAddress: data.contactAddress
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