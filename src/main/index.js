import { app, shell, BrowserWindow, screen, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 本地数据库相关
const root_path = './'
const Database = require('better-sqlite3')
const db = new Database(root_path + 'chat.db')
// 窗口尺寸信息
const loginViewWidth = 300
const loginViewHeight = 320
const registerViewWidth = 300
const registerViewHeight = 380
const mainViewWidth = 750
const mainViewHeight = 640
const mainViewMinWidth = 640
const mainViewMinHeight = 500
// 全屏前信息追踪
let lastMainViewWidth = mainViewWidth;
let lastMainViewHeight = mainViewHeight;
let lastPositionX = 0;
let lastPositionY = 0;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: loginViewWidth,
    height: loginViewHeight,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    resizable: false,
    frame: true,
    transparent: true,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function initDatabase() {
  // 会话数据库
  // type: 0 单聊 1 群聊
  // show: 0 不展示
  db.exec(`
    CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY,
      type INTEGER NOT NULL,
      avatar TEXT NOT NULL,
      remark TEXT,
      show INTEGER DEFAULT 0
    )
  `)

  // 会话成员数据库
  db.exec(`
    CREATE TABLE IF NOT EXISTS session_member (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId INTEGER NOT NULL,
      memberId INTEGER NOT NULL,
      FOREIGN KEY (sessionId) REFERENCES session(id) ON DELETE CASCADE,
      UNIQUE(sessionId, memberId)
    )
  `)

  // 聊天信息数据库
  // type: 0 文本 1 图片 2 文件 3 红包
  db.exec(`
    CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type INTEGER NOT NULL,
    sessionId INTEGER NOT NULL,
    senderId INTEGER NOT NULL,
    sendTime TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (sessionId) REFERENCES session(id) ON DELETE CASCADE
    )
  `)
}

// 窗口居中
function centerWindow(win, width, height) {
  const currentDisplay = screen.getDisplayNearestPoint(win?.getBounds())
  const x = Math.floor((currentDisplay.size.width - width) / 2.0)
  const y = Math.floor((currentDisplay.size.height - height) / 2.0)
  if (x < 0 || y < 0) return
  win?.setPosition(x, y)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  initDatabase()

  ///////////////////////////////////////////////
  // ipc注册
  ///////////////////////////////////////////////
  // 修改窗口大小
  ipcMain.on('changeWindow', (e, window) => {
    const win = BrowserWindow.getFocusedWindow()
    if (window === 'login') {
      win?.setResizable(true)
      win?.setSize(loginViewWidth, loginViewHeight)
      win?.setResizable(false)
    } else if (window === 'register') {
      win?.setResizable(true)
      win?.setSize(registerViewWidth, registerViewHeight)
      win?.setResizable(false)
    } else if (window === 'main') {
      win?.setResizable(true)
      win?.setSize(mainViewWidth, mainViewHeight)
      win?.setMinimumSize(mainViewMinWidth, mainViewMinHeight)
      centerWindow(win, mainViewWidth, mainViewHeight)
    } else {
      console.log('changeWindow error')
    }
  })

  // 最小化窗口
  ipcMain.on('minWindow', () => {
    const win = BrowserWindow.getFocusedWindow()
    win?.minimize()
  })

  // 切换全屏
  ipcMain.on('fullScreen', () => {
    const win = BrowserWindow.getFocusedWindow()

    // 全屏前信息记录
    const bounds = win?.getBounds()
    lastMainViewWidth = bounds.width
    lastMainViewHeight = bounds.height
    lastPositionX = bounds.x
    lastPositionY = bounds.y

    const isFullscreen = win.isFullScreen()
    win?.setFullScreen(!isFullscreen)
  })

  // 恢复窗口
  ipcMain.on('resetScreen', () => {
    const win = BrowserWindow.getFocusedWindow()
    win?.setSize(lastMainViewWidth, lastMainViewHeight)
    win?.setPosition(lastPositionX, lastPositionY)
  })

  // 关闭主进程
  ipcMain.on('exitApp', () => {
    app.quit()
  })



  ///////////////////////////////////////////////
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
