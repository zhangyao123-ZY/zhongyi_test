import './assets/style/index.css';
import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store';
import router, { setupRouter } from './router';

import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import './assets/style/custom/index.scss';

const appRecord = createApp(App);

const appUseConfigFn = async () => {
    setupStore(appRecord);
    // 注意顺序，添加好规则再使用
    setupRouter(appRecord);
    await router.isReady();
    appRecord
    .use(ElementPlus, {
      locale: zhCn,
    })
    .mount('#app');
}

appUseConfigFn();