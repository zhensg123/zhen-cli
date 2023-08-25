import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
import plugin from './plugin'
import '@/assets/styles/reset.css'
import '@/element'
import '@/components'
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont.js'
import * as filters from './filters' // global filters
import * as directives from './directives' // global directives
// import '@/components' // 导入全局组件
Vue.use(plugin)
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))
Object.keys(directives).forEach(key => Vue.directive(key, directives[key]))
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
