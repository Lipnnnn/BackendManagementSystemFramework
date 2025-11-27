/**
 * 全国省市区三级联动数据
 * 数据来源: src/assets/pca-code.json
 */

import pcaCodeData from '../assets/pca-code.json'

export interface AreaNode {
  value: string
  label: string
  children?: AreaNode[]
}

// 转换数据格式
function transformAreaData(data: any[]): AreaNode[] {
  return data.map(item => {
    const node: AreaNode = {
      value: item.name,
      label: item.name
    }
    
    if (item.children && item.children.length > 0) {
      node.children = transformAreaData(item.children)
    }
    
    return node
  })
}

export const _areaData: AreaNode[] = transformAreaData(pcaCodeData)
