import {createApp} from "vue";
import App from './App.vue';
import router from './router'
// pinia 持久化插件
import piniaPersist from 'pinia-plugin-persistedstate'
import {createPinia} from "pinia";
const pinia = createPinia()
pinia.use(piniaPersist)

// 引入 Ant Design Vue 组件库
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// 公共样式
import '@/assets/styles/main.scss'
// 引入 阿里文字图标
import '@/assets/iconfont/iconfont.css'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Antd)
app.mount('#app')

// 导入 Ant Design Vue 图标
import * as Icons from '@ant-design/icons-vue'
const icons: any = Icons;
for (const i in icons) {
	app.component(i, icons[i])
}

import "@/utils/tauriEvent.ts"
