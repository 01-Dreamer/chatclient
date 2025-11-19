import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import store from './store'

let dbPath = null
let db = null

export function initDatabase() {
    // 连接数据库
    const userId = store.userId
    dbPath = join(app.getPath('userData'), `chat_${userId}.db`)
    db = new Database(dbPath, { verbose: console.log })

    // 会话数据库
    // show: 0 不展示
    db.exec(`
    CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY,
      is_group INTEGER NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      show INTEGER DEFAULT 0
    )
  `)

    // 会话成员数据库
    db.exec(`
    CREATE TABLE IF NOT EXISTS session_member (
      id INTEGER PRIMARY KEY,
      sessionId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      remark TEXT,
      FOREIGN KEY (sessionId) REFERENCES session(id) ON DELETE CASCADE,
      UNIQUE(sessionId, userId)
    )
  `)

    // 聊天信息数据库
    // type: text 文本 image 图片 file 文件 red_packet 红包
    db.exec(`
    CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY,
    sessionId INTEGER NOT NULL,
    senderId INTEGER NOT NULL,
    sendTime TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (sessionId) REFERENCES session(id) ON DELETE CASCADE
    )
  `)
}

export default db