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
          <template v-if="column.key === 'unitType'">
            {{ Array.isArray(record.unitType) ? record.unitType.join(' / ') : (record.unitType || '-') }}
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
  unitName: string
  region: string
  unitType: string | string[]
  industry: string
  // 完整表单数据，用于编辑回显
  creditCode?: string
  country?: string
  address?: string
  longitude?: string
  latitude?: string
  networkDept?: string
  adminDept?: string
  hasLocalPlatform?: string
  hasSituationPlatform?: string
  hasExternalScreen?: string
  unitHead?: string
  unitHeadPhone?: string
  unitHeadEmail?: string
  emergencyContact?: string
  emergencyPhone?: string
  emergencyEmail?: string
  emergencyPosition?: string
  emergencyAddress?: string
  securityLeader?: string
  securityLeaderPhone?: string
  securityLeaderEmail?: string
  securityLeaderPosition?: string
}

// 表格列定义
const columns: TableColumnsType = [
  {
    title: '单位名称',
    dataIndex: 'unitName',
    key: 'unitName',
    width: 300
  },
  {
    title: '所属地区',
    dataIndex: 'region',
    key: 'region',
    width: 300
  },
  {
    title: '单位类型',
    dataIndex: 'unitType',
    key: 'unitType',
    width: 150
  },
  {
    title: '所属行业',
    dataIndex: 'industry',
    key: 'industry',
    width: 150
  },
  {
    title: '是否有本地大型平台',
    dataIndex: 'hasLocalPlatform',
    key: 'hasLocalPlatform',
    width: 180
  },
  {
    title: '是否有本地态势感知平台',
    dataIndex: 'hasSituationPlatform',
    key: 'hasSituationPlatform',
    width: 200
  },
  {
    title: '是否有外电子大屏',
    dataIndex: 'hasExternalScreen',
    key: 'hasExternalScreen',
    width: 160
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
      '单位名称': item.unitName || '-',
      '所属地区': (item.region && item.region !== '-') ? item.region : '-',
      '单位类型': Array.isArray(item.unitType) ? item.unitType.join(' / ') : ((item.unitType && item.unitType !== '-') ? item.unitType : '-'),
      '所属行业': (item.industry && item.industry !== '-') ? item.industry : '-',
      '统一社会信用代码': item.creditCode || '-',
      '所在国家地区': item.country || '-',
      '单位具体地址': item.address || '-',
      '经度': item.longitude || '-',
      '纬度': item.latitude || '-',
      '网络监管部门名称': item.networkDept || '-',
      '行政主管部门名称': item.adminDept || '-',
      '是否有本地大型平台': item.hasLocalPlatform || '-',
      '是否有本地态势感知平台': item.hasSituationPlatform || '-',
      '是否有外电子大屏': item.hasExternalScreen || '-',
      '单位负责人': item.unitHead || '-',
      '单位负责人办公电话': item.unitHeadPhone || '-',
      '单位负责人联系邮箱': item.unitHeadEmail || '-',
      '应急联系人': item.emergencyContact || '-',
      '应急联系人办公电话': item.emergencyPhone || '-',
      '应急联系人联系邮箱': item.emergencyEmail || '-',
      '应急联系人职务职称': item.emergencyPosition || '-',
      '应急联系人详细地址': item.emergencyAddress || '-',
      '网络安全分管领导': item.securityLeader || '-',
      '网络安全分管领导办公电话': item.securityLeaderPhone || '-',
      '网络安全分管领导联系邮箱': item.securityLeaderEmail || '-',
      '网络安全分管领导职务职称': item.securityLeaderPosition || '-'
    }
  })

  // 创建工作簿
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '组织架构信息')

  // 生成文件名（带时间戳）
  const fileName = `组织架构信息_${new Date().getTime()}.xlsx`

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
    unitName: record.unitName,
    unitType: record.unitType === '-' ? '' : record.unitType,
    region: record.region === '-' ? '' : record.region,
    industry: record.industry === '-' ? '' : record.industry,
    creditCode: record.creditCode,
    country: record.country,
    address: record.address,
    longitude: record.longitude,
    latitude: record.latitude,
    networkDept: record.networkDept,
    adminDept: record.adminDept,
    hasLocalPlatform: record.hasLocalPlatform,
    hasSituationPlatform: record.hasSituationPlatform,
    hasExternalScreen: record.hasExternalScreen,
    unitHead: record.unitHead,
    unitHeadPhone: record.unitHeadPhone,
    unitHeadEmail: record.unitHeadEmail,
    emergencyContact: record.emergencyContact,
    emergencyPhone: record.emergencyPhone,
    emergencyEmail: record.emergencyEmail,
    emergencyPosition: record.emergencyPosition,
    emergencyAddress: record.emergencyAddress,
    securityLeader: record.securityLeader,
    securityLeaderPhone: record.securityLeaderPhone,
    securityLeaderEmail: record.securityLeaderEmail,
    securityLeaderPosition: record.securityLeaderPosition
  }
  viewVisible.value = true
}

// 编辑
const handleEdit = (record: OrganizationItem) => {
  modalTitle.value = '编辑'
  // 将字符串类型的 region 转换为数组（供级联选择器使用）
  let regionArray: string[] | undefined = undefined
  if (record.region && record.region !== '-') {
    regionArray = record.region.split(' / ')
  }

  // 将字符串类型的 unitType 转换为数组（供级联选择器使用）
  let unitTypeArray: string[] | undefined = undefined
  if (record.unitType && record.unitType !== '-') {
    unitTypeArray = Array.isArray(record.unitType) ? record.unitType : record.unitType.split(' / ')
  }

  editData.value = {
    unitName: record.unitName,
    unitType: unitTypeArray,
    region: regionArray,
    industry: record.industry === '-' ? undefined : record.industry,
    creditCode: record.creditCode || '',
    country: record.country || 'China',
    address: record.address || '',
    longitude: record.longitude || '',
    latitude: record.latitude || '',
    networkDept: record.networkDept || '',
    adminDept: record.adminDept || '',
    hasLocalPlatform: record.hasLocalPlatform,
    hasSituationPlatform: record.hasSituationPlatform,
    hasExternalScreen: record.hasExternalScreen,
    unitHead: record.unitHead || '',
    unitHeadPhone: record.unitHeadPhone || '',
    unitHeadEmail: record.unitHeadEmail || '',
    emergencyContact: record.emergencyContact || '',
    emergencyPhone: record.emergencyPhone || '',
    emergencyEmail: record.emergencyEmail || '',
    emergencyPosition: record.emergencyPosition || '',
    emergencyAddress: record.emergencyAddress || '',
    securityLeader: record.securityLeader || '',
    securityLeaderPhone: record.securityLeaderPhone || '',
    securityLeaderEmail: record.securityLeaderEmail || '',
    securityLeaderPosition: record.securityLeaderPosition || '',
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
  // 处理区域数据：将数组转换为字符串
  const regionStr = Array.isArray(data.region) ? data.region.join(' / ') : (data.region || '-')
  // 处理单位类型数据：将数组转换为字符串
  const unitTypeStr = Array.isArray(data.unitType) ? data.unitType.join(' / ') : (data.unitType || '-')

  if (editData.value?.key) {
    // 编辑
    const index = allData.value.findIndex(item => item.key === editData.value.key)
    if (index > -1 && allData.value[index]) {
      allData.value[index] = {
        key: editData.value.key,
        unitName: data.unitName,
        region: regionStr,
        unitType: unitTypeStr,
        industry: data.industry || '-',
        // 保存完整表单数据
        creditCode: data.creditCode,
        country: data.country,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
        networkDept: data.networkDept,
        adminDept: data.adminDept,
        hasLocalPlatform: data.hasLocalPlatform,
        hasSituationPlatform: data.hasSituationPlatform,
        hasExternalScreen: data.hasExternalScreen,
        unitHead: data.unitHead,
        unitHeadPhone: data.unitHeadPhone,
        unitHeadEmail: data.unitHeadEmail,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        emergencyEmail: data.emergencyEmail,
        emergencyPosition: data.emergencyPosition,
        emergencyAddress: data.emergencyAddress,
        securityLeader: data.securityLeader,
        securityLeaderPhone: data.securityLeaderPhone,
        securityLeaderEmail: data.securityLeaderEmail,
        securityLeaderPosition: data.securityLeaderPosition
      }
    }
    message.success('编辑成功')
  } else {
    // 新增
    const newItem: OrganizationItem = {
      key: Date.now().toString(),
      unitName: data.unitName,
      region: regionStr,
      unitType: unitTypeStr,
      industry: data.industry || '-',
      // 保存完整表单数据
      creditCode: data.creditCode,
      country: data.country,
      address: data.address,
      longitude: data.longitude,
      latitude: data.latitude,
      networkDept: data.networkDept,
      adminDept: data.adminDept,
      hasLocalPlatform: data.hasLocalPlatform,
      hasSituationPlatform: data.hasSituationPlatform,
      hasExternalScreen: data.hasExternalScreen,
      unitHead: data.unitHead,
      unitHeadPhone: data.unitHeadPhone,
      unitHeadEmail: data.unitHeadEmail,
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      emergencyEmail: data.emergencyEmail,
      emergencyPosition: data.emergencyPosition,
      emergencyAddress: data.emergencyAddress,
      securityLeader: data.securityLeader,
      securityLeaderPhone: data.securityLeaderPhone,
      securityLeaderEmail: data.securityLeaderEmail,
      securityLeaderPosition: data.securityLeaderPosition
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