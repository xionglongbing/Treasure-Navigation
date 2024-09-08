import './assets/main.css';
import './style/index.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import SvgIcon from '@/components/SvgIcon.vue';

import App from './App.vue';
// import router from './router';
import 'element-plus/dist/index.css';

const app = createApp(App);

// Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 挂载
app.use(pinia);
app.component('SvgIcon', SvgIcon);
// app.use(router);
app.mount('#app');
