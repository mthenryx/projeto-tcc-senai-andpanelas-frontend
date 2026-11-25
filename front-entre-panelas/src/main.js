import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'
import { instalarLogDaApi } from './services/apiLogger'

instalarLogDaApi()

const app = createApp(App)

app.use(router)

app.mount('#app')
