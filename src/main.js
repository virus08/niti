import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import acl from './acl'


Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  acl,
  render: h => h(App)
}).$mount('#app')
