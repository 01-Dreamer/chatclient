class Store {
  constructor() {
    this.userId = null
    this.token = null
    this.httpUrl = null
    this.wsUrl = 'ws://localhost:10002/chat'
  }
}

export default new Store()