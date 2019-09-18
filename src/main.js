import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Router from './routes'
import Menu from './components/Menu'

Vue.use(VueRouter)
Vue.config.productionTip = false
Vue.component('app-menu', Menu)

new Vue({
  el: '#app',
  render: h => h(App),
  router: Router
})
