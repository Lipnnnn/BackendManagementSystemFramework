import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import VideoView from '../views/VideoView.vue'
import UploadView from '../views/UploadView.vue'
import SettingsView from '../views/SettingsView.vue'

// 路由配置，同时包含菜单信息
export const routes = [
  {
    path: '/',
    name: 'organizationalStructureInformation',
    component: () => import('@/views/organizationalStructureInformation/index.vue'),
    meta: {
      title: '组织机构信息',
      icon: 'UserOutlined',
      hidden: false
    }
  },
  {
    path: '/businessInformationSystem',
    name: 'businessInformationSystem',
    component: () => import('@/views/businessInformationSystem/index.vue'),
    meta: {
      title: '业务信息系统',
      icon: 'VideoCameraOutlined',
      hidden: false
    }
  },
  {
    path: '/hardwareDeviceInformation',
    name: 'hardwareDeviceInformation',
    component: () => import('@/views/hardwareDeviceInformation/index.vue'),
    meta: {
      title: '硬件设备信息',
      icon: 'UploadOutlined',
      hidden: false
    }
  },
  {
    path: '/softwareInformation',
    name: 'softwareInformation',
    component: () => import('@/views/softwareInformation/index.vue'),
    meta: {
      title: '软件信息',
      icon: 'SettingOutlined',
      hidden: false
    }
  },
  {
    path: '/networkInformation',
    name: 'networkInformation',
    component: () => import('@/views/networkInformation/index.vue'),
    meta: {
      title: '网络信息',
      icon: 'UserOutlined',
      hidden: false
    }
  },
  {
    path: '/dataCenterInformation',
    name: 'dataCenterInformation',
    component: () => import('@/views/dataCenterInformation/index.vue'),
    meta: {
      title: '机房信息',
      icon: 'UserOutlined',
      hidden: false
    }
  },
  {
    path: '/emergencyResourceInformation',
    name: 'emergencyResourceInformation',
    component: () => import('@/views/emergencyResourceInformation/index.vue'),
    meta: {
      title: '应急资源信息',
      icon: 'UserOutlined',
      hidden: false
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router