import { app, shell, BrowserWindow, screen, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import * as db from './db'
import store from './store'
import { connectWebSocket, sendMessageByWs, closeWebSocket } from './websocket'

// 窗口尺寸信息
const loginViewWidth = 300
const loginViewHeight = 270
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

// 全局窗口对象
let mainWindow = null;

// 通知渲染进程改变session
export function changeSession(sessionId) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('session', sessionId)
  }
}

// 通知渲染进程有新消息
export function sendMessage(message) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('message', message)
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
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

  createWindow() // 创建窗口
  

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
    closeWebSocket()
    app.quit()
  })

  // 登录(初始化用户信息)
  ipcMain.on('login', (e, user) => {
    store.token = user.token
    store.userId = user.userId
    db.initDatabase()
    connectWebSocket()
  })

  // 获取会话列表
  ipcMain.handle('getSessionList', () => {
    return db.getSessionList()
  })

  // 隐藏会话
  ipcMain.on('hideSession', (e, id) => {
    db.updateSessionShow(id, 0)
    changeSession(null)
  })

  // 显示会话
  ipcMain.on('showSession', (e, id) => {
    db.showSession(id)
    changeSession(null)
  })

  // 新增会话
  ipcMain.on('addSession', (e, session) => {
    console.log('addSession', session)
    db.insertSession(session.id, session.peer_id, session.name, session.avatar)
    changeSession(null)
  })

  // 获取联系人列表
  ipcMain.handle('getContactList', () => {
    return db.getContactList()
  })

  // 获取会话消息列表
  ipcMain.handle('getMessageList', (e, sessionId) => {
    return db.getMessageList(sessionId)
  })

  // 获取会话最后一条消息
  ipcMain.handle('getLastMessage', (e, sessionId) => {
    return db.getLastMessage(sessionId)
  })

  // 获取系统消息列表
  ipcMain.handle('getSystemMessageList', () => {
    return db.getSystemMessageList()
  })

  // 删除消息
  ipcMain.on('deleteMessage', (e, id) => {
    db.deleteMessage(id)
  })

  // 判断会话是否是群聊
  ipcMain.handle('isGroupSession', (e, sessionId) => {
    return db.isGroupSession(sessionId)
  })

  // 获取会话名称
  ipcMain.handle('getSessionName', (e, sessionId) => {
    return db.getSessionName(sessionId)
  })

  // 重置会话未读消息数
  ipcMain.on('resetSessionUnreadCount', (e, sessionId) => {
    db.resetSessionUnreadCount(sessionId)
  })

  // 发送消息
  ipcMain.on('sendMessageByWs', (e, message) => {
    sendMessageByWs(message)
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
