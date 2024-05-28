import { createApp } from 'vue'
import 'virtual:uno.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')
