import { defineStore } from 'pinia'

export const useStore = defineStore('user', {
  state: () => ({
    httpUrl: 'https://data.zxylearn.top',

    // 用户信息
    userId: null,
    username: null,
    nickname: null,
    avatar: null,
    token: null,

    // session 信息
    sessions: [],
  }),

  actions: {
    setUser(user) {
      this.userId = user.userId
      this.username = user.username
      this.nickname = user.nickname
      this.avatar = user.avatar
      this.token = user.token
    },
  },

  getters: {
    getHttpUrl: (state) => state.httpUrl,

    changeSessions: (state, sessions) => {
      state.sessions = sessions;
    },
  }
})
