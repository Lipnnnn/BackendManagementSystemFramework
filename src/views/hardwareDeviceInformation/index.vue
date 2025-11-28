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
          <template v-if="column.key === 'deviceType'">
            {{ Array.isArray(record.deviceType) ? record.deviceType.join(' / ') : (record.deviceType || '-') }}
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
interface IpPortItem {
  ip: string
  port: string
}

interface DeviceItem {
  key: string
  deviceName: string
  deviceType: string | string[]
  affiliatedUnit: string
  isDomestic: string
  // 完整表单数据，用于编辑回显
  deviceModel?: string
  cpuModel?: string
  cpuCores?: string
  memoryModel?: string
  memoryCapacity?: string
  diskModel?: string
  diskCapacity?: string
  operatingSystem?: string
  macAddressList?: string[]
  isConnectedInternet?: string
  purchaseTime?: any
  deviceStatus?: string
  isVirtualDevice?: string
  manufacturer?: string
  machineRoom?: string
  cloudPlatform?: string
  systemIpPortList?: IpPortItem[]
}

// 表格列定义
const columns: TableColumnsType = [
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    key: 'deviceType',
    width: 200
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
    width: 300
  },
  {
    title: '所属单位',
    dataIndex: 'affiliatedUnit',
    key: 'affiliatedUnit',
    width: 300
  },
  {
    title: '是否国产化',
    dataIndex: 'isDomestic',
    key: 'isDomestic',
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
const allData = ref<DeviceItem[]>([])

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

  // 准备导出数据（字段顺序与新增页面一致）
  const exportData = allData.value.map(item => {
    return {
      '设备名称': item.deviceName || '-',
      '设备型号': item.deviceModel || '-',
      '设备类型': Array.isArray(item.deviceType) ? item.deviceType.join(' / ') : (item.deviceType || '-'),
      '是否国产化': item.isDomestic || '-',
      '所属单位': item.affiliatedUnit || '-',
      'cpu型号': item.cpuModel || '-',
      'cpu核数': item.cpuCores || '-',
      '内存型号': item.memoryModel || '-',
      '内存容量': item.memoryCapacity ? item.memoryCapacity + ' MB' : '-',
      '硬盘型号': item.diskModel || '-',
      '硬盘容量': item.diskCapacity ? item.diskCapacity + ' MB' : '-',
      '操作系统': item.operatingSystem || '-',
      'MAC地址': item.macAddressList && item.macAddressList.length > 0 ? item.macAddressList.join(', ') : '-',
      '是否连接互联网': item.isConnectedInternet || '-',
      '采购时间': item.purchaseTime || '-',
      '设备状态': item.deviceStatus || '-',
      '是否虚拟设备': item.isVirtualDevice || '-',
      '设备生产厂商': item.manufacturer || '-',
      '所属机房': item.machineRoom || '-',
      '所属云平台': item.cloudPlatform || '-',
      '系统ip端口': item.systemIpPortList && item.systemIpPortList.length > 0
        ? item.systemIpPortList.map(ip => `${ip.ip}${ip.port ? ':' + ip.port : ''}`).join(', ')
        : '-'
    }
  })

  // 创建工作簿
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '硬件设备信息')

  // 生成文件名（带时间戳）
  const fileName = `硬件设备信息_${new Date().getTime()}.xlsx`

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
const handleView = (record: DeviceItem) => {
  // 将字符串类型的 deviceType 转换为数组（供查看页面显示）
  let deviceTypeArray: string[] = []
  if (record.deviceType && record.deviceType !== '-') {
    deviceTypeArray = Array.isArray(record.deviceType) ? record.deviceType : record.deviceType.split(' / ')
  }

  viewData.value = {
    deviceName: record.deviceName,
    deviceModel: record.deviceModel,
    deviceType: deviceTypeArray,
    isDomestic: record.isDomestic === '-' ? '' : record.isDomestic,
    affiliatedUnit: record.affiliatedUnit,
    cpuModel: record.cpuModel,
    cpuCores: record.cpuCores,
    memoryModel: record.memoryModel,
    memoryCapacity: record.memoryCapacity,
    diskModel: record.diskModel,
    diskCapacity: record.diskCapacity,
    operatingSystem: record.operatingSystem,
    macAddressList: record.macAddressList || [],
    isConnectedInternet: record.isConnectedInternet,
    purchaseTime: record.purchaseTime,
    deviceStatus: record.deviceStatus,
    isVirtualDevice: record.isVirtualDevice,
    manufacturer: record.manufacturer,
    machineRoom: record.machineRoom,
    cloudPlatform: record.cloudPlatform,
    systemIpPortList: record.systemIpPortList || []
  }
  viewVisible.value = true
}

// 编辑
const handleEdit = (record: DeviceItem) => {
  modalTitle.value = '编辑'

  // 将字符串类型的 deviceType 转换为数组（供级联选择器使用）
  let deviceTypeArray: string[] | undefined = undefined
  if (record.deviceType && record.deviceType !== '-') {
    deviceTypeArray = Array.isArray(record.deviceType) ? record.deviceType : record.deviceType.split(' / ')
  }

  editData.value = {
    deviceName: record.deviceName,
    deviceModel: record.deviceModel || '',
    deviceType: deviceTypeArray,
    isDomestic: record.isDomestic === '-' ? undefined : record.isDomestic,
    affiliatedUnit: record.affiliatedUnit,
    cpuModel: record.cpuModel || '',
    cpuCores: record.cpuCores || '',
    memoryModel: record.memoryModel || '',
    memoryCapacity: record.memoryCapacity || '',
    diskModel: record.diskModel || '',
    diskCapacity: record.diskCapacity || '',
    operatingSystem: record.operatingSystem || '',
    macAddressList: record.macAddressList || [],
    isConnectedInternet: record.isConnectedInternet,
    purchaseTime: record.purchaseTime,
    deviceStatus: record.deviceStatus,
    isVirtualDevice: record.isVirtualDevice,
    manufacturer: record.manufacturer || '',
    machineRoom: record.machineRoom || '',
    cloudPlatform: record.cloudPlatform || '',
    systemIpPortList: record.systemIpPortList || [],
    key: record.key
  }
  modalVisible.value = true
}

// 删除单行
const handleDeleteRow = (record: DeviceItem) => {
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
  // 处理设备类型数据：将数组转换为字符串
  const deviceTypeStr = Array.isArray(data.deviceType) ? data.deviceType.join(' / ') : (data.deviceType || '-')

  if (editData.value?.key) {
    // 编辑
    const index = allData.value.findIndex(item => item.key === editData.value.key)
    if (index > -1 && allData.value[index]) {
      allData.value[index] = {
        key: editData.value.key,
        deviceName: data.deviceName,
        deviceType: deviceTypeStr,
        affiliatedUnit: data.affiliatedUnit,
        isDomestic: data.isDomestic || '-',
        // 保存完整表单数据
        deviceModel: data.deviceModel,
        cpuModel: data.cpuModel,
        cpuCores: data.cpuCores,
        memoryModel: data.memoryModel,
        memoryCapacity: data.memoryCapacity,
        diskModel: data.diskModel,
        diskCapacity: data.diskCapacity,
        operatingSystem: data.operatingSystem,
        macAddressList: data.macAddressList || [],
        isConnectedInternet: data.isConnectedInternet,
        purchaseTime: data.purchaseTime,
        deviceStatus: data.deviceStatus,
        isVirtualDevice: data.isVirtualDevice,
        manufacturer: data.manufacturer,
        machineRoom: data.machineRoom,
        cloudPlatform: data.cloudPlatform,
        systemIpPortList: data.systemIpPortList || []
      }
    }
    message.success('编辑成功')
  } else {
    // 新增
    const newItem: DeviceItem = {
      key: Date.now().toString(),
      deviceName: data.deviceName,
      deviceType: deviceTypeStr,
      affiliatedUnit: data.affiliatedUnit,
      isDomestic: data.isDomestic || '-',
      // 保存完整表单数据
      deviceModel: data.deviceModel,
      cpuModel: data.cpuModel,
      cpuCores: data.cpuCores,
      memoryModel: data.memoryModel,
      memoryCapacity: data.memoryCapacity,
      diskModel: data.diskModel,
      diskCapacity: data.diskCapacity,
      operatingSystem: data.operatingSystem,
      macAddressList: data.macAddressList || [],
      isConnectedInternet: data.isConnectedInternet,
      purchaseTime: data.purchaseTime,
      deviceStatus: data.deviceStatus,
      isVirtualDevice: data.isVirtualDevice,
      manufacturer: data.manufacturer,
      machineRoom: data.machineRoom,
      cloudPlatform: data.cloudPlatform,
      systemIpPortList: data.systemIpPortList || []
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