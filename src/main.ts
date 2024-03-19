import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import router from './router'
import http from './http/http.ts' //导入axios
const app = createApp(App)
app.config.globalProperties.$http = http

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(ElementPlus).mount('#app')

