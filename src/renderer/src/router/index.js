import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'default',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/MainView.vue'),

    children: [
      {
        path: '/chat',
        name: 'chat',
        components: {
          layoutLeft: () => import('../views/ChatView.vue'),
          layoutRight: () => import('../views/ChatView.vue')
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
