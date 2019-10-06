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
  settings: [],
  proxies: [],
  parsers: [],
  logs: [],
  types: [],
  runned: false,
  loading: false,
  description: ''
}

getData('config-data', function (value) {
  data.settings = value
})

getData('proxies-data', function (value) {
  data.proxies = value
})

getData('parser-log', function (value) {
  data.logs.push(value)
})

getData('proxy-types', function (value) {
  data.types = value
})

getData('parsers-data', function (value) {
  data.parsers = value

  if (data.parsers.length > 0) {
    data.description = data.parsers[0].description
  }
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
