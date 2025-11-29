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
        <!-- 网络信息Tab -->
        <a-tab-pane key="network" tab="网络信息">
          <a-table :columns="columns" :data-source="displayData" :row-selection="rowSelection" :pagination="pagination"
            :scroll="{ x: 1200 }" @change="handleTableChange">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'region'">
                {{ Array.isArray(record.region) ? record.region.join(' / ') : (record.region || '-') }}
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
        </a-tab-pane>

        <!-- 端口信息Tab -->
        <a-tab-pane key="port" tab="端口信息">
          <a-table :columns="portColumns" :data-source="displayPortData" :row-selection="portRowSelection"
            :pagination="portPagination" :scroll="{ x: 1200 }" @change="handlePortTableChange">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'ipAddress'">
                {{ record.ipVersion || 'IPv4' }} {{ record.ipAddress || '-' }}
              </template>
              <template v-if="column.key === 'isPublicPort'">
                {{ record.isPublicPort ? '是' : '否' }}
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" @click="handlePortView(record)">查看</a-button>
                  <a-button type="link" @click="handlePortEdit(record)">编辑</a-button>
                  <a-button type="link" danger @click="handlePortDeleteRow(record)">删除</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 新增/编辑弹窗 -->
    <AddOrEdit v-if="activeTabKey === 'network'" v-model:open="modalVisible" :title="modalTitle" :data="editData"
      @ok="handleModalOk" @cancel="handleModalCancel" />

    <!-- 端口信息新增/编辑弹窗 -->
    <PortAddOrEdit v-if="activeTabKey === 'port'" v-model:open="modalVisible" :title="modalTitle" :data="editPortData"
      @ok="handlePortModalOk" @cancel="handleModalCancel" />

    <!-- 查看详情弹窗 -->
    <ViewDetail v-if="activeTabKey === 'network'" v-model:open="viewVisible" :data="viewData" />

    <!-- 端口信息查看详情弹窗 -->
    <PortViewDetail v-if="activeTabKey === 'port'" v-model:open="viewVisible" :data="viewPortData" />
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
import dayjs, { Dayjs } from 'dayjs'
import AddOrEdit from './components/addOrEdit.vue'
import ViewDetail from './components/viewDetail.vue'
import PortAddOrEdit from './components/portAddOrEdit.vue'
import PortViewDetail from './components/portViewDetail.vue'

// 数据类型定义
interface IpRangeItem {
  ipVersion: string
  startIp: string
  endIp: string
}

interface NetworkItem {
  key: string
  networkName: string
  region: string | string[]
  affiliatedUnit: string
  accessMachineRoom: string
  networkProvider: string
  // 完整表单数据，用于编辑回显
  networkUsage?: string
  networkResourceType?: string
  networkBandwidth?: string
  accessIpRangeList?: IpRangeItem[]
  detailedAddress?: string
  providerContact?: string
  contactPhone?: string
  contactEmail?: string
}

// 端口信息数据类型
interface PortItem {
  key: string
  ipAddress: string
  ipVersion?: string
  portNumber: string
  protocol: string
  portService: string
  isPublicPort: boolean
  unitName: string
  lastCheckTime?: Dayjs | string | null
}

// 表格列定义
const columns: TableColumnsType = [
  {
    title: '网络名称',
    dataIndex: 'networkName',
    key: 'networkName',
    width: 200
  },
  {
    title: '所属地区',
    dataIndex: 'region',
    key: 'region',
    width: 200
  },
  {
    title: '所属单位',
    dataIndex: 'affiliatedUnit',
    key: 'affiliatedUnit',
    width: 200
  },
  {
    title: '接入机房',
    dataIndex: 'accessMachineRoom',
    key: 'accessMachineRoom',
    width: 200
  },
  {
    title: '网络运营商',
    dataIndex: 'networkProvider',
    key: 'networkProvider',
    width: 150
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

// 端口信息表格列定义
const portColumns: TableColumnsType = [
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 150
  },
  {
    title: '端口号',
    dataIndex: 'portNumber',
    key: 'portNumber',
    width: 120
  },
  {
    title: '传输层协议',
    dataIndex: 'protocol',
    key: 'protocol',
    width: 120
  },
  {
    title: '端口服务',
    dataIndex: 'portService',
    key: 'portService',
    width: 150
  },
  {
    title: '是否公共端口',
    dataIndex: 'isPublicPort',
    key: 'isPublicPort',
    width: 120
  },
  {
    title: '单位名称',
    dataIndex: 'unitName',
    key: 'unitName',
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
const allData = ref<NetworkItem[]>([])

// 端口信息数据
const allPortData = ref<PortItem[]>([])

// 当前激活的Tab
const activeTabKey = ref('network')

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

// 端口信息分页配置
const portPagination = reactive({
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

// 显示的端口数据（分页后）
const displayPortData = computed(() => {
  const start = (portPagination.current - 1) * portPagination.pageSize
  const end = start + portPagination.pageSize
  return allPortData.value.slice(start, end)
})

// 选中的行
const selectedRowKeys = ref<string[]>([])
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  }
}))

// 端口信息选中的行
const selectedPortRowKeys = ref<string[]>([])
const portRowSelection = computed(() => ({
  selectedRowKeys: selectedPortRowKeys.value,
  onChange: (keys: string[]) => {
    selectedPortRowKeys.value = keys
  }
}))

// 弹窗相关
const modalVisible = ref(false)
const modalTitle = ref('新增')
const editData = ref()

// 端口信息编辑数据
const editPortData = ref()

// 查看详情相关
const viewVisible = ref(false)
const viewData = ref()

// 端口信息查看数据
const viewPortData = ref()

// Tab切换处理
const handleTabChange = (key: string) => {
  activeTabKey.value = key
}

// 批量删除
const handleDelete = () => {
  if (activeTabKey.value === 'network') {
    // 删除网络信息
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
    // 删除端口信息
    if (selectedPortRowKeys.value.length === 0) {
      message.warning('请选择要删除的数据')
      return
    }

    const newData = allPortData.value.filter(item => !selectedPortRowKeys.value.includes(item.key))
    allPortData.value = newData
    portPagination.total = newData.length
    selectedPortRowKeys.value = []
    message.success(`成功删除 ${selectedPortRowKeys.value.length} 条数据`)
  }
}

// 导出
const handleExport = () => {
  if (activeTabKey.value === 'network') {
    // 导出网络信息
    if (allData.value.length === 0) {
      message.warning('暂无数据可导出')
      return
    }

    // 准备导出数据（字段顺序与新增页面一致）
    const exportData = allData.value.map(item => {
      return {
        '网络名称': item.networkName || '-',
        '所属地区': Array.isArray(item.region) ? item.region.join(' / ') : (item.region || '-'),
        '网络服务商': item.networkProvider || '-',
        '网络用途': item.networkUsage || '-',
        '所属单位': item.affiliatedUnit || '-',
        '网络资源类型': item.networkResourceType || '-',
        '网络带宽': item.networkBandwidth ? `${item.networkBandwidth}MB` : '-',
        '接入机房': item.accessMachineRoom || '-',
        '接入IP地址范围': item.accessIpRangeList && item.accessIpRangeList.length > 0
          ? item.accessIpRangeList.map(ip => `${ip.ipVersion} ${ip.startIp}-${ip.endIp}`).join(', ')
          : '-',
        '详细地址': item.detailedAddress || '-',
        '运营商联系人': item.providerContact || '-',
        '联系电话': item.contactPhone || '-',
        '联系邮箱': item.contactEmail || '-'
      }
    })

    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '网络信息')

    // 生成文件名（带时间戳）
    const fileName = `网络信息_${new Date().getTime()}.xlsx`

    // 导出文件
    XLSX.writeFile(wb, fileName)
    message.success('导出成功')
  } else {
    // 导出端口信息
    if (allPortData.value.length === 0) {
      message.warning('暂无数据可导出')
      return
    }

    const exportData = allPortData.value.map(item => {
      return {
        '端口': item.portNumber || '-',
        '接入IP地址': `${item.ipVersion || 'IPv4'} ${item.ipAddress || '-'}`,
        '端口服务': item.portService || '-',
        '传输层协议': item.protocol || '-',
        '所属单位': item.unitName || '-',
        '是否公共端口': item.isPublicPort ? '是' : '否',
        '最后检测时间': item.lastCheckTime
          ? (dayjs.isDayjs(item.lastCheckTime)
            ? item.lastCheckTime.format('YYYY-MM-DD HH:mm:ss')
            : dayjs(item.lastCheckTime).format('YYYY-MM-DD HH:mm:ss'))
          : '-'
      }
    })

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '端口信息')

    const fileName = `端口信息_${new Date().getTime()}.xlsx`
    XLSX.writeFile(wb, fileName)
    message.success('导出成功')
  }
}

// 新增
const handleAdd = () => {
  modalTitle.value = '新增'
  if (activeTabKey.value === 'network') {
    editData.value = undefined
  } else {
    editPortData.value = undefined
  }
  modalVisible.value = true
}

// 查看
const handleView = (record: NetworkItem) => {
  // 将字符串类型的 region 转换为数组（供查看页面显示）
  let regionArray: string[] = []
  if (record.region && record.region !== '-') {
    regionArray = Array.isArray(record.region) ? record.region : record.region.split(' / ')
  }

  viewData.value = {
    networkName: record.networkName,
    region: regionArray,
    networkProvider: record.networkProvider,
    networkUsage: record.networkUsage,
    affiliatedUnit: record.affiliatedUnit,
    networkResourceType: record.networkResourceType,
    networkBandwidth: record.networkBandwidth,
    accessMachineRoom: record.accessMachineRoom,
    accessIpRangeList: record.accessIpRangeList || [{ ipVersion: 'IPv4', startIp: '', endIp: '' }],
    detailedAddress: record.detailedAddress,
    providerContact: record.providerContact,
    contactPhone: record.contactPhone,
    contactEmail: record.contactEmail
  }
  viewVisible.value = true
}

// 编辑
const handleEdit = (record: NetworkItem) => {
  modalTitle.value = '编辑'

  // 将字符串类型的 region 转换为数组（供级联选择器使用）
  let regionArray: string[] | undefined = undefined
  if (record.region && record.region !== '-') {
    regionArray = Array.isArray(record.region) ? record.region : record.region.split(' / ')
  }

  editData.value = {
    networkName: record.networkName,
    region: regionArray,
    networkProvider: record.networkProvider === '-' ? undefined : record.networkProvider,
    networkUsage: record.networkUsage || '',
    affiliatedUnit: record.affiliatedUnit,
    networkResourceType: record.networkResourceType === '-' ? undefined : record.networkResourceType,
    networkBandwidth: record.networkBandwidth || '',
    accessMachineRoom: record.accessMachineRoom || '',
    accessIpRangeList: record.accessIpRangeList || [{ ipVersion: 'IPv4', startIp: '', endIp: '' }],
    detailedAddress: record.detailedAddress || '',
    providerContact: record.providerContact || '',
    contactPhone: record.contactPhone || '',
    contactEmail: record.contactEmail || '',
    key: record.key
  }
  modalVisible.value = true
}

// 删除单行
const handleDeleteRow = (record: NetworkItem) => {
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
  // 处理地区数据：将数组转换为字符串
  const regionStr = Array.isArray(data.region) ? data.region.join(' / ') : (data.region || '-')

  if (editData.value?.key) {
    // 编辑
    const index = allData.value.findIndex(item => item.key === editData.value.key)
    if (index > -1 && allData.value[index]) {
      allData.value[index] = {
        key: editData.value.key,
        networkName: data.networkName,
        region: regionStr,
        affiliatedUnit: data.affiliatedUnit,
        accessMachineRoom: data.accessMachineRoom,
        networkProvider: data.networkProvider || '-',
        // 保存完整表单数据
        networkUsage: data.networkUsage,
        networkResourceType: data.networkResourceType,
        networkBandwidth: data.networkBandwidth,
        accessIpRangeList: data.accessIpRangeList || [{ ipVersion: 'IPv4', startIp: '', endIp: '' }],
        detailedAddress: data.detailedAddress,
        providerContact: data.providerContact,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail
      }
    }
    message.success('编辑成功')
  } else {
    // 新增
    const newItem: NetworkItem = {
      key: Date.now().toString(),
      networkName: data.networkName,
      region: regionStr,
      affiliatedUnit: data.affiliatedUnit,
      accessMachineRoom: data.accessMachineRoom,
      networkProvider: data.networkProvider || '-',
      // 保存完整表单数据
      networkUsage: data.networkUsage,
      networkResourceType: data.networkResourceType,
      networkBandwidth: data.networkBandwidth,
      accessIpRangeList: data.accessIpRangeList || [{ ipVersion: 'IPv4', startIp: '', endIp: '' }],
      detailedAddress: data.detailedAddress,
      providerContact: data.providerContact,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail
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

// 端口信息表格变化
const handlePortTableChange: TableProps['onChange'] = (pag) => {
  portPagination.current = pag.current || 1
  portPagination.pageSize = pag.pageSize || 10
}

// 端口信息 - 查看
const handlePortView = (record: PortItem) => {
  viewPortData.value = {
    portNumber: record.portNumber,
    ipAddress: record.ipAddress,
    ipVersion: record.ipVersion || 'IPv4',
    portService: record.portService,
    protocol: record.protocol,
    unitName: record.unitName,
    isPublicPort: record.isPublicPort,
    lastCheckTime: record.lastCheckTime
  }
  viewVisible.value = true
}

// 端口信息 - 编辑
const handlePortEdit = (record: PortItem) => {
  modalTitle.value = '编辑'
  editPortData.value = {
    ...record
  }
  modalVisible.value = true
}

// 端口信息 - 删除单行
const handlePortDeleteRow = (record: PortItem) => {
  const newData = allPortData.value.filter(item => item.key !== record.key)
  allPortData.value = newData
  portPagination.total = newData.length
  message.success('删除成功')
}

// 端口信息弹窗确定
const handlePortModalOk = (data: any) => {
  if (editPortData.value?.key) {
    // 编辑
    const index = allPortData.value.findIndex(item => item.key === editPortData.value.key)
    if (index > -1 && allPortData.value[index]) {
      allPortData.value[index] = {
        key: editPortData.value.key,
        ipAddress: data.ipAddress,
        ipVersion: data.ipVersion,
        portNumber: data.portNumber,
        protocol: data.protocol || '-',
        portService: data.portService,
        isPublicPort: data.isPublicPort,
        unitName: data.unitName,
        lastCheckTime: data.lastCheckTime
      }
    }
    message.success('编辑成功')
  } else {
    // 新增
    const newItem: PortItem = {
      key: Date.now().toString(),
      ipAddress: data.ipAddress,
      ipVersion: data.ipVersion,
      portNumber: data.portNumber,
      protocol: data.protocol || '-',
      portService: data.portService,
      isPublicPort: data.isPublicPort,
      unitName: data.unitName,
      lastCheckTime: data.lastCheckTime
    }
    allPortData.value.push(newItem)
    message.success('新增成功')
  }

  portPagination.total = allPortData.value.length
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