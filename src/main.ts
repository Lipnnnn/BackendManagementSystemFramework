import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import router from './router'
import * as Icons from '@ant-design/icons-vue';
import 'virtual:uno.css'

const app = createApp(App);
app.use(Antd).use(router);

// 全局注册所有图标组件
const icons: any = Icons;
for (const i in icons) {
  app.component(i, icons[i]);
}

app.mount('#app');