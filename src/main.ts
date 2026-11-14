import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { useTodoStore } from './stores/todo'
import { useUserStore } from './stores/user'
import '../scss/main.scss'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
useUserStore(pinia).sanitizePersistedState()
useTodoStore(pinia).sanitizePersistedState()
app.use(router)
app.mount('#app')
