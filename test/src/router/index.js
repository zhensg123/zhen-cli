import Vue from 'vue'
import VueRouter from 'vue-router'
import configRoutes from './modules'
import E403 from '@/views/E403'
import E404 from '@/views/E404'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'mywork',
    redirect: '/mywork/target'
  },
  {
    path: '/error',
    name: 'Error',
    component: E403
  },
  {
    path: '*',
    component: E404,
    name: 'error',
    meta: {
      title: '页面没找到'
    }
  },
  ...configRoutes
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
