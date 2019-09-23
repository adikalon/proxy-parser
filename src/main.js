import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Router from './routes'
import Menu from './components/Menu'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

function getData (event, fn) {
  ipcRenderer.on(event, (e, value) => {
    fn(value)
  })
}

const data = {
  settings: []
}

getData('config-data', function (value) {
  data.settings = value
})

Vue.use(VueRouter)
Vue.config.productionTip = false
Vue.component('app-menu', Menu)

new Vue({
  el: '#app',
  render: h => h(App),
  router: Router,
  data: data
})
