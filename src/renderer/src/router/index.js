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
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/MainView.vue'),
    redirect: '/main/session/0',
    children: [
      {
        path: 'session/:sessionId',
        name: 'session',
        components: {
          MainLeft: () => import('@/views/SessionView.vue'),
          MainRight: () => import('@/views/ChatView.vue')
        },
        props: {
          MainLeft: true,
          MainRight: true
        }
      },
      {
        path: 'friend/:friendId',
        name: 'friend',
        components: {
          MainLeft: () => import('@/views/FriendView.vue'),
          MainRight: () => import('@/views/DetailView.vue')
        },
        props: {
          MainLeft: true,
          MainRight: true
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
