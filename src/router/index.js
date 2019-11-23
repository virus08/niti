import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import error from '../views/error.vue'
import { AclRule } from 'vue-acl'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: Home,
    meta: {
      rule: 'isPublic'
    } 
  },
  { 
    path: '/about', 
    name: 'about', 
    component: () => import('../views/About.vue'),
    meta: {
      rule: 'isAdmin'
    }
  },
  {
    path: '/error',
    name: 'notfound',
    component: error,
    meta: {
      rule: '*'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
