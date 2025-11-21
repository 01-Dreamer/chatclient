import Database from 'better-sqlite3'
import { app, session } from 'electron'
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
      peer_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      unread_count INTEGER DEFAULT 0,
      show INTEGER DEFAULT 0
    )
  `)

  // 聊天信息数据库
  db.exec(`
    CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY,
    sessionId INTEGER NOT NULL,
    senderId INTEGER NOT NULL,
    senderNickname TEXT NOT NULL,
    createTime INTEGER NOT NULL,
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
export function insertMessage(id, sessionId, senderId, senderNickname, createTime, type, content) {
  id = String(id).split('.')[0]
  sessionId = String(sessionId).split('.')[0]
  senderId = String(senderId).split('.')[0]
  createTime = String(createTime).split('.')[0]
  const stmt = db.prepare(`
    INSERT INTO message (id, sessionId, senderId, senderNickname, createTime, type, content)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(id, sessionId, senderId, senderNickname, createTime, type, content)
}

// 插入会话
export function insertSession(id, peer_id, name, avatar) {
  id = String(id).split('.')[0]
  peer_id = String(peer_id).split('.')[0]
  const stmt = db.prepare(`
    INSERT INTO session (id, peer_id, name, avatar, unread_count, show)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      peer_id=excluded.peer_id,
      name=excluded.name,
      avatar=excluded.avatar,
      show=excluded.show
  `)
  stmt.run(id, peer_id, name, avatar, 0, current_max_show + 1)
  current_max_show += 1
}

// 更新会话显示顺序
export function updateSessionShow(id, show) {
  id = String(id).split('.')[0]
  show = String(show).split('.')[0]
  if (show === '-1') {
    current_max_show += 1
    show = current_max_show
  }
  const stmt = db.prepare(`
    UPDATE session SET show = ? WHERE id = ?
  `)
  stmt.run(show, id)
}

// 显示会话
export function showSession(id) {
  id = String(id).split('.')[0]
  const stmt = db.prepare(`
    SELECT show FROM session WHERE id = ?
  `)
  const row = stmt.get(id)
  if (row && row.show === 0) {
    updateSessionShow(id, '-1')
  }
}

// 获取会话列表
export function getSessionList() {
  const stmt = db.prepare(`
    SELECT * FROM session WHERE show > 0 ORDER BY show DESC
  `)
  return stmt.all()
}

// 获取联系人列表
export function getContactList() {
  const stmt = db.prepare(`
    SELECT * FROM session ORDER BY id ASC
  `)
  return stmt.all()
}

// 获取会话消息列表
export function getMessageList(sessionId) {
  sessionId = String(sessionId).split('.')[0]
  const stmt = db.prepare(`
    SELECT * FROM message WHERE sessionId = ? ORDER BY createTime ASC
  `)
  return stmt.all(sessionId)
}

// 判断会话是否是群聊
export function isGroupSession(sessionId) {
  sessionId = String(sessionId).split('.')[0]
  const stmt = db.prepare(`
    SELECT peer_id FROM session WHERE id = ?
  `)
  const row = stmt.get(sessionId)
  return row && row.peer_id === -1
}

// 获取会话名称
export function getSessionName(sessionId) {
  sessionId = String(sessionId).split('.')[0]
  const stmt = db.prepare(`
    SELECT name FROM session WHERE id = ?
  `)
  const row = stmt.get(sessionId)
  return row ? row.name : null
}

// 获取会话最后一条消息
export function getLastMessage(sessionId) {
  sessionId = String(sessionId).split('.')[0]
  const stmt = db.prepare(`
    SELECT * FROM message WHERE sessionId = ? ORDER BY createTime DESC LIMIT 1
  `)
  return stmt.get(sessionId)
}

// 获取系统消息
export function getSystemMessageList() {
  const stmt = db.prepare(`
    SELECT * FROM message WHERE sessionId = -1 ORDER BY createTime DESC
  `)
  return stmt.all()
}

// 删除消息
export function deleteMessage(id) {
  id = String(id).split('.')[0]
  const stmt = db.prepare(`
    DELETE FROM message WHERE id = ?
  `)
  stmt.run(id)
}

// 增加会话未读消息数
export function incrementSessionUnreadCount(id) {
  id = String(id).split('.')[0]
  const stmt = db.prepare(`
    UPDATE session SET unread_count = unread_count + 1 WHERE id = ?
  `)
  stmt.run(id)
}

// 重置会话未读消息数
export function resetSessionUnreadCount(id) {
  id = String(id).split('.')[0]
  const stmt = db.prepare(`
    UPDATE session SET unread_count = 0 WHERE id = ?
  `)
  stmt.run(id)
}