import VueRouter from 'vue-router'
import Home from './components/pages/home/Page'
import Base from './components/pages/base/Page'
import Config from './components/pages/config/Page'
import About from './components/pages/about/Page'

export default new VueRouter({
  routes: [
    {
      path: '',
      component: Home
    },
    {
      path: '/base',
      component: Base
    },
    {
      path: '/config',
      component: Config
    },
    {
      path: '/about',
      component: About
    }
  ]
})
