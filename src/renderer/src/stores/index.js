import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    httpUrl: 'https://data.zxylearn.top',
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
