import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import store from './store'

let dbPath = null
let db = null
let current_max_show = 0

export function initDatabase() {
  // 连接数据库
  const userId = store.userId
  dbPath = join(app.getPath('userData'), `chat_${userId}.db`)
  db = new Database(dbPath, { verbose: console.log })

  // 会话数据库
  db.exec(`
    CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY,
      is_group INTEGER NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      unread_count INTEGER DEFAULT 0,
      show INTEGER DEFAULT 0
    )
  `)

  // 用户头像、昵称数据库
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_info (
      id INTEGER PRIMARY KEY,
      nickname TEXT NOT NULL,
      avatar TEXT NOT NULL
    )
  `)

  // 聊天信息数据库
  db.exec(`
    CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY,
    sessionId INTEGER NOT NULL,
    senderId INTEGER NOT NULL,
    createTime TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL
    )
  `)
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_message_sessionId ON message(sessionId)
  `)

  // 初始化current_max_show
  const row = db.prepare('SELECT MAX(show) as max_show FROM session').get()
  current_max_show = row && row.max_show ? row.max_show : 0
}

export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

// 插入消息
export function insertMessage(id, sessionId, senderId, createTime, type, content) {
  const stmt = db.prepare(`
    INSERT INTO message (id, sessionId, senderId, createTime, type, content)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  stmt.run(id, sessionId, senderId, createTime, type, content)
}

// 插入或更新用户信息
export function insertOrUpdateUserInfo(id, nickname, avatar) {
  const stmt = db.prepare(`
    INSERT INTO user_info (id, nickname, avatar)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      nickname=excluded.nickname,
      avatar=excluded.avatar
  `)
  stmt.run(id, nickname, avatar)
}

// 插入会话
export function insertSession(id, is_group, name, avatar) {
  const stmt = db.prepare(`
    INSERT INTO session (id, is_group, name, avatar, unread_count, show)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      is_group=excluded.is_group,
      name=excluded.name,
      avatar=excluded.avatar,
      show=excluded.show
  `)
  stmt.run(id, is_group, name, avatar, 0, current_max_show + 1)
  current_max_show += 1
}

// 更新会话显示顺序
export function updateSessionShow(id, show) {
  if (show === -1) {
    current_max_show += 1
    show = current_max_show
  }
  const stmt = db.prepare(`
    UPDATE session SET show = ? WHERE id = ?
  `)
  stmt.run(show, id)
}

// 获取会话列表
export function getSessionList() {
  const stmt = db.prepare(`
    SELECT * FROM session WHERE show > 0 ORDER BY show DESC
  `)
  return stmt.all()
}