import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Customer from '@/views/Customer.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    linkActiveClass: 'active'
  },
  {
    path: '/customer',
    name: 'Customer',
    component: Customer,
    linkActiveClass: 'active'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
