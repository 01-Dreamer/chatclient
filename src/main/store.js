class Store {
  constructor() {
    this.userId = null
    this.token = null
    this.httpUrl = null
    this.wsUrl = 'wss://data.zxylearn.top/chat'
  }
}

export default new Store()