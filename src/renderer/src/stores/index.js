import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: -1,
    email: '',
    nickname: '',
    avatar: ''
  }),

  actions: {

  },


  getters: {

  }
})
