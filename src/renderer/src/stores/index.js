import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    httpUrl: 'http://localhost:10001',
    userId: null,
    username: null,
    nickname: null,
    avatar: null,
    token: null
  }),

  actions: {
    setUser(user) {
      this.userId = user.userId
      this.username = user.username
      this.nickname = user.nickname
      this.avatar = user.avatar
      this.token = user.token
    }
  },


  getters: {
    getHttpUrl: (state) => state.httpUrl
  }
})
