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
import JSZip from 'jszip'
import dayjs from 'dayjs'
import AddOrEdit from './components/addOrEdit.vue'
import ViewDetail from './components/viewDetail.vue'

// IP端口数据结构
interface IpPortItem {
  ip: string
  port: string
}

// 数据类型定义
interface BusinessSystemItem {
  key: string
  systemName: string
  systemType?: string
  affiliation: string
  isCritical?: string
  onlineTime?: string | any
  industry?: string
  icpRecordStatus?: string
  icpRecordNumber?: string
  securityLevel?: string
  systemDomainList: string[]
  systemUrlList: string[]
  systemIpPortList: IpPortItem[]
  dnsServerDomainList: string[]
  userScale?: string
  keyBusinessComponents?: string[]
  importance?: string
  connectedToInternet?: string
  serviceTarget?: string[]
  systemDescription?: string
  systemHead: string
  systemHeadPhone: string
  systemHeadEmail: string
  systemHeadAddress: string
  systemScreenshot?: any[] // 文件列表
  hardwareInfo?: string
  softwareInfo?: string
  networkInfo?: string
  portInfo?: string
  roomInfo?: string
  cloudPlatformInfo?: string
  emergencyInfo?: string
  businessInfo?: string
}

// 表格列定义
const columns: TableColumnsType = [
  {
    title: '系统名称',
    dataIndex: 'systemName',
    key: 'systemName',
    width: 200
  },
  {
    title: '系统类型',
    dataIndex: 'systemType',
    key: 'systemType',
    width: 150
  },
  {
    title: '所属单位',
    dataIndex: 'affiliation',
    key: 'affiliation',
    width: 200
  },
  {
    title: '是否为关键基础设施',
    dataIndex: 'isCritical',
    key: 'isCritical',
    width: 150
  },
  {
    title: '行业类型',
    dataIndex: 'industry',
    key: 'industry',
    width: 120
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

// 模拟数据
const allData = ref<BusinessSystemItem[]>([])

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
const handleExport = async () => {
  if (allData.value.length === 0) {
    message.warning('暂无数据可导出')
    return
  }

  try {
    // 准备导出Excel数据
    const exportData = allData.value.map((item, index) => {
      return {
        '序号': index + 1,
        '系统名称': item.systemName || '-',
        '上线时间': item.onlineTime ? (dayjs(item.onlineTime).isValid() ? dayjs(item.onlineTime).format('YYYY-MM-DD HH:mm:ss') : item.onlineTime) : '-',
        '所属单位': item.affiliation || '-',
        '行业类型': item.industry || '-',
        '系统类型': item.systemType || '-',
        'icp备案': item.icpRecordStatus === '已备案' && item.icpRecordNumber ? `${item.icpRecordStatus} - ${item.icpRecordNumber}` : (item.icpRecordStatus || '-'),
        '是否为关键基础设施': item.isCritical || '-',
        '等保级别': item.securityLevel || '-',
        '系统域名': item.systemDomainList && item.systemDomainList.length > 0 ? item.systemDomainList.join('\n') : '-',
        '系统使用url': item.systemUrlList && item.systemUrlList.length > 0 ? item.systemUrlList.join('\n') : '-',
        '系统IP端口': item.systemIpPortList && item.systemIpPortList.length > 0 ? item.systemIpPortList.map(ip => `${ip.ip}${ip.port ? ':' + ip.port : ''}`).join('\n') : '-',
        'dns服务器域名': item.dnsServerDomainList && item.dnsServerDomainList.length > 0 ? item.dnsServerDomainList.join('\n') : '-',
        '用户规模': item.userScale || '-',
        '关键业务种类': item.keyBusinessComponents && item.keyBusinessComponents.length > 0 ? item.keyBusinessComponents.join(' / ') : '-',
        '重要性': item.importance || '-',
        '是否连接互联网': item.connectedToInternet || '-',
        '服务对象': item.serviceTarget && item.serviceTarget.length > 0 ? item.serviceTarget.join('、') : '-',
        '系统简介': item.systemDescription || '-',
        '系统负责人': item.systemHead || '-',
        '系统负责人办公电话': item.systemHeadPhone || '-',
        '系统负责人联系邮箱': item.systemHeadEmail || '-',
        '系统负责人联系地址': item.systemHeadAddress || '-',
        '系统截图': item.systemScreenshot && Array.isArray(item.systemScreenshot) && item.systemScreenshot.length > 0 ? `见附件-${item.systemName}系统截图` : '-',
        '硬件信息': item.hardwareInfo || '-',
        '软件信息': item.softwareInfo || '-',
        '网络信息': item.networkInfo || '-',
        '端口信息': item.portInfo || '-',
        '机房信息': item.roomInfo || '-',
        '云平台信息': item.cloudPlatformInfo || '-',
        '应急信息': item.emergencyInfo || '-',
        '业务信息': item.businessInfo || '-'
      }
    })

    // 创建Excel工作簿
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '业务信息系统')

    // 将Excel转换为Blob
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

    // 创建ZIP压缩包
    const zip = new JSZip()

    // 添加Excel文件
    zip.file('业务信息系统.xlsx', excelBuffer)

    // 添加系统截图
    let imageCount = 0
    for (let i = 0; i < allData.value.length; i++) {
      const item = allData.value[i]
      if (!item) continue

      if (item.systemScreenshot && Array.isArray(item.systemScreenshot)) {
        for (let j = 0; j < item.systemScreenshot.length; j++) {
          const file = item.systemScreenshot[j]
          if (!file) continue

          // 获取图片数据
          let imageData = null
          if (file.thumbUrl) {
            // Base64数据
            imageData = file.thumbUrl
          } else if (file.url) {
            imageData = file.url
          } else if (file.preview) {
            imageData = file.preview
          }

          if (imageData) {
            // 处理Base64数据
            const base64Data = imageData.split(',')[1] || imageData
            const fileName = `${item.systemName || '系统' + (i + 1)}_截图${j + 1}.${getImageExtension(imageData)}`
            zip.file(`系统截图/${fileName}`, base64Data, { base64: true })
            imageCount++
          }
        }
      }
    }

    // 生成ZIP文件
    const zipBlob = await zip.generateAsync({ type: 'blob' })

    // 下载文件
    const link = document.createElement('a')
    link.href = URL.createObjectURL(zipBlob)
    link.download = `业务信息系统_${new Date().getTime()}.zip`
    link.click()

    URL.revokeObjectURL(link.href)
    message.success(`导出成功！包含1个Excel文件${imageCount > 0 ? `和${imageCount}张图片` : ''}`)
  } catch (error) {
    console.error('导出失败:', error)
    message.error('导出失败，请重试')
  }
}

// 获取图片扩展名
const getImageExtension = (base64: string): string => {
  if (base64.includes('data:image/png')) return 'png'
  if (base64.includes('data:image/jpeg') || base64.includes('data:image/jpg')) return 'jpg'
  if (base64.includes('data:image/gif')) return 'gif'
  if (base64.includes('data:image/webp')) return 'webp'
  return 'png' // 默认
}

// 新增
const handleAdd = () => {
  modalTitle.value = '新增'
  editData.value = undefined
  modalVisible.value = true
}

// 查看
const handleView = (record: BusinessSystemItem) => {
  viewData.value = { ...record }
  viewVisible.value = true
}

// 编辑
const handleEdit = (record: BusinessSystemItem) => {
  modalTitle.value = '编辑'
  // 转换日期格式
  const formattedData = { ...record }
  if (formattedData.onlineTime && typeof formattedData.onlineTime === 'string') {
    formattedData.onlineTime = dayjs(formattedData.onlineTime)
  }
  editData.value = formattedData
  modalVisible.value = true
}

// 删除单行
const handleDeleteRow = (record: BusinessSystemItem) => {
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
  // 转换日期格式为字符串
  const formattedData = { ...data }
  if (formattedData.onlineTime && dayjs.isDayjs(formattedData.onlineTime)) {
    formattedData.onlineTime = formattedData.onlineTime.format('YYYY-MM-DD HH:mm:ss')
  }

  if (editData.value?.key) {
    // 编辑
    const index = allData.value.findIndex(item => item.key === editData.value.key)
    if (index > -1 && allData.value[index]) {
      allData.value[index] = {
        ...formattedData,
        key: editData.value.key
      }
    }
    message.success('编辑成功')
  } else {
    // 新增
    const newItem: BusinessSystemItem = {
      ...formattedData,
      key: Date.now().toString()
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