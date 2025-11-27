import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import VideoView from '../views/VideoView.vue'
import UploadView from '../views/UploadView.vue'
import SettingsView from '../views/SettingsView.vue'

// 路由配置，同时包含菜单信息
export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '用户管理',
      icon: 'UserOutlined',
      hidden: false
    }
  },
  {
    path: '/video',
    name: 'video',
    component: VideoView,
    meta: {
      title: '视频管理',
      icon: 'VideoCameraOutlined',
      hidden: false
    }
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadView,
    meta: {
      title: '文件上传',
      icon: 'UploadOutlined',
      hidden: false
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: '系统设置',
      icon: 'SettingOutlined',
      hidden: false
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      title: '关于',
      icon: 'UserOutlined',
      hidden: true // 在菜单中隐藏
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router