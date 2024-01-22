import { createApp } from 'vue';
import App from './App.vue';
import './assets/global.less';
import components from './components/global';
import Elements from './plugins/elementPlus';
import Router from './router/index';
import i18n from './i18n'
import {createMessage, CreateMessageModel} from '~/store/global'

const app = createApp(App)
app.config.productionTip = false

// components
for (const i in components) {
  app.component(i, components[i])
}
// app.config.errorHandler = (err, instance, info) => {
//   createMessage(new CreateMessageModel('warning', err.message));
// }
app.use(Elements)
app.use(i18n)
app.use(Router).mount('#app')
