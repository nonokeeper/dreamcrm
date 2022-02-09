import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Forgot from '@/views/Forgot.vue'
import Account from '@/views/Account.vue'
import Setup from '@/views/Setup.vue'
import Customer from '@/views/Customer.vue'
import CustomerStructure from '@/views/structure/CustomerStructure.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    linkActiveClass: 'active'
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: Forgot,
    linkActiveClass: 'active'
  },
  {
    path: '/profile',
    name: 'Account',
    component: Account,
    linkActiveClass: 'active'
  },
  {
    path: '/setup',
    name: 'Setup',
    component: Setup,
    linkActiveClass: 'active'
  },
  {
    path: '/customer',
    name: 'Customer',
    component: Customer,
    linkActiveClass: 'active'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    linkActiveClass: 'active'
  },
  {
    path: '/customer/editStructure',
    name: 'CustomerStructure',
    component: CustomerStructure,
    linkActiveClass: 'active'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
