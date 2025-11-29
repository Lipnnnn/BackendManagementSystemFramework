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

    <!-- Tab切换和表格区域 -->
    <div class="table-section">
      <a-tabs v-model:activeKey="activeTabKey" @change="handleTabChange">
        <!-- 机房信息Tab -->
        <a-tab-pane key="room" tab="机房信息">
          <a-table :columns="columns" :data-source="displayData" :row-selection="rowSelection" :pagination="pagination"
            :scroll="{ x: 1200 }" @change="handleTableChange">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" @click="handleView(record)">查看</a-button>
                  <a-button type="link" @click="handleEdit(record)">编辑</a-button>
                  <a-button type="link" danger @click="handleDeleteRow(record)">删除</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- 云平台信息Tab -->
        <a-tab-pane key="cloud" tab="云平台信息">
          <a-table :columns="cloudColumns" :data-source="displayCloudData" :row-selection="cloudRowSelection"
            :pagination="cloudPagination" :scroll="{ x: 1200 }" @change="handleCloudTableChange">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'isDomestic'">
                {{ record.isDomestic ? '是' : '否' }}
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" @click="handleCloudView(record)">查看</a-button>
                  <a-button type="link" @click="handleCloudEdit(record)">编辑</a-button>
                  <a-button type="link" danger @click="handleCloudDeleteRow(record)">删除</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 新增/编辑弹窗 -->
    <AddOrEdit v-if="activeTabKey === 'room'" v-model:open="modalVisible" :title="modalTitle" :data="editData"
      @ok="handleModalOk" @cancel="handleModalCancel" />

    <!-- 云平台信息新增/编辑弹窗 -->
    <CloudAddOrEdit v-if="activeTabKey === 'cloud'" v-model:open="modalVisible" :title="modalTitle"
      :data="editCloudData" @ok="handleCloudModalOk" @cancel="handleModalCancel" />

    <!-- 查看详情弹窗 -->
    <ViewDetail v-if="activeTabKey === 'room'" v-model:open="viewVisible" :data="viewData" />

    <!-- 云平台信息查看详情弹窗 -->
    <CloudViewDetail v-if="activeTabKey === 'cloud'" v-model:open="viewVisible" :data="viewCloudData" />
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
import CloudAddOrEdit from './components/cloudAddOrEdit.vue'
import CloudViewDetail from './components/cloudViewDetail.vue'

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

// 云平台信息数据类型
interface CloudItem {
  key: string
  cloudName: string
  cloudType: string
  operatingUnit: string
  usingUnit: string
  isDomestic: boolean
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  contactAddress?: string
}

// 机房信息表格列定义
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

// 云平台信息表格列定义
const cloudColumns: TableColumnsType = [
  {
    title: '云平台名称',
    dataIndex: 'cloudName',
    key: 'cloudName',
    width: 200
  },
  {
    title: '云平台类型',
    dataIndex: 'cloudType',
    key: 'cloudType',
    width: 150
  },
  {
    title: '运营单位',
    dataIndex: 'operatingUnit',
    key: 'operatingUnit',
    width: 200
  },
  {
    title: '使用单位',
    dataIndex: 'usingUnit',
    key: 'usingUnit',
    width: 200
  },
  {
    title: '是否在境内',
    dataIndex: 'isDomestic',
    key: 'isDomestic',
    width: 120
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

// 机房信息数据
const allData = ref<OrganizationItem[]>([])

// 云平台信息数据
const allCloudData = ref<CloudItem[]>([])

// 当前激活的Tab
const activeTabKey = ref('room')

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

// 云平台信息分页配置
const cloudPagination = reactive({
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

// 显示的云平台数据（分页后）
const displayCloudData = computed(() => {
  const start = (cloudPagination.current - 1) * cloudPagination.pageSize
  const end = start + cloudPagination.pageSize
  return allCloudData.value.slice(start, end)
})

// 选中的行
const selectedRowKeys = ref<string[]>([])
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  }
}))

// 云平台信息选中的行
const selectedCloudRowKeys = ref<string[]>([])
const cloudRowSelection = computed(() => ({
  selectedRowKeys: selectedCloudRowKeys.value,
  onChange: (keys: string[]) => {
    selectedCloudRowKeys.value = keys
  }
}))

// 弹窗相关
const modalVisible = ref(false)
const modalTitle = ref('新增')
const editData = ref()

// 查看详情相关
const viewVisible = ref(false)
const viewData = ref()

// 云平台信息编辑数据
const editCloudData = ref()

// 云平台信息查看数据
const viewCloudData = ref()

// Tab切换处理
const handleTabChange = (key: string) => {
  activeTabKey.value = key
}

// 批量删除
const handleDelete = () => {
  if (activeTabKey.value === 'room') {
    // 删除机房信息
    if (selectedRowKeys.value.length === 0) {
      message.warning('请选择要删除的数据')
      return
    }

    const newData = allData.value.filter(item => !selectedRowKeys.value.includes(item.key))
    allData.value = newData
    pagination.total = newData.length
    selectedRowKeys.value = []
    message.success(`成功删除 ${selectedRowKeys.value.length} 条数据`)
  } else {
    // 删除云平台信息
    if (selectedCloudRowKeys.value.length === 0) {
      message.warning('请选择要删除的数据')
      return
    }

    const newData = allCloudData.value.filter(item => !selectedCloudRowKeys.value.includes(item.key))
    allCloudData.value = newData
    cloudPagination.total = newData.length
    selectedCloudRowKeys.value = []
    message.success(`成功删除 ${selectedCloudRowKeys.value.length} 条数据`)
  }
}

// 导出
const handleExport = () => {
  if (activeTabKey.value === 'room') {
    // 导出机房信息
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
  } else {
    // 导出云平台信息
    if (allCloudData.value.length === 0) {
      message.warning('暂无数据可导出')
      return
    }

    const exportData = allCloudData.value.map(item => {
      return {
        '云平台名称': item.cloudName || '-',
        '云平台类型': item.cloudType || '-',
        '运营单位': item.operatingUnit || '-',
        '使用单位': item.usingUnit || '-',
        '是否在境内': item.isDomestic ? '是' : '否',
        '联系人': item.contactPerson || '-',
        '联系电话': item.contactPhone || '-',
        '邮箱': item.contactEmail || '-',
        '联系地址': item.contactAddress || '-'
      }
    })

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '云平台信息')

    const fileName = `云平台信息_${new Date().getTime()}.xlsx`
    XLSX.writeFile(wb, fileName)
    message.success('导出成功')
  }
}

// 新增
const handleAdd = () => {
  modalTitle.value = '新增'
  if (activeTabKey.value === 'room') {
    editData.value = undefined
  } else {
    editCloudData.value = undefined
  }
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

// 云平台信息表格变化
const handleCloudTableChange: TableProps['onChange'] = (pag) => {
  cloudPagination.current = pag.current || 1
  cloudPagination.pageSize = pag.pageSize || 10
}

// 云平台信息 - 查看
const handleCloudView = (record: CloudItem) => {
  viewCloudData.value = {
    cloudName: record.cloudName,
    cloudType: record.cloudType,
    operatingUnit: record.operatingUnit,
    usingUnit: record.usingUnit,
    isDomestic: record.isDomestic,
    contactPerson: record.contactPerson,
    contactPhone: record.contactPhone,
    contactEmail: record.contactEmail,
    contactAddress: record.contactAddress
  }
  viewVisible.value = true
}

// 云平台信息 - 编辑
const handleCloudEdit = (record: CloudItem) => {
  modalTitle.value = '编辑'
  editCloudData.value = {
    ...record
  }
  modalVisible.value = true
}

// 云平台信息 - 删除单行
const handleCloudDeleteRow = (record: CloudItem) => {
  const newData = allCloudData.value.filter(item => item.key !== record.key)
  allCloudData.value = newData
  cloudPagination.total = newData.length
  message.success('删除成功')
}

// 云平台信息弹窗确定
const handleCloudModalOk = (data: any) => {
  if (editCloudData.value?.key) {
    // 编辑
    const index = allCloudData.value.findIndex(item => item.key === editCloudData.value.key)
    if (index > -1 && allCloudData.value[index]) {
      allCloudData.value[index] = {
        key: editCloudData.value.key,
        cloudName: data.cloudName,
        cloudType: data.cloudType,
        operatingUnit: data.operatingUnit,
        usingUnit: data.usingUnit,
        isDomestic: data.isDomestic,
        contactPerson: data.contactPerson,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        contactAddress: data.contactAddress
      }
    }
    message.success('编辑成功')
  } else {
    // 新增
    const newItem: CloudItem = {
      key: Date.now().toString(),
      cloudName: data.cloudName,
      cloudType: data.cloudType,
      operatingUnit: data.operatingUnit,
      usingUnit: data.usingUnit,
      isDomestic: data.isDomestic,
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      contactAddress: data.contactAddress
    }
    allCloudData.value.push(newItem)
    message.success('新增成功')
  }

  cloudPagination.total = allCloudData.value.length
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