import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
// import { VueDragula } from 'vue3-dragula';
// import 'vue3-dragula/dist/dragula.css';
const app = createApp(App)

app.use(createPinia())
app.use(router);
app.mount('#app')
