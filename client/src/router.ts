import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from './utils/token'
import routes from '~pages'

export const router = createRouter({
  // https://router.vuejs.org/guide/essentials/history-mode.html#Example-Server-Configurations
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const isAuthenticated = getToken() // 检查用户是否已登录

  // 如果用户已经登录，则允许进入任何路由
  if (isAuthenticated) {
    next()
  }
  else {
    // 如果用户未登录，并且目标路由不是登录或注册页面，则重定向到登录页面
    if (to.path !== '/login' && to.path !== '/register') {
      next('/login')
    }
    else {
      // 否则，允许进入登录或注册页面
      next()
    }
  }
})
