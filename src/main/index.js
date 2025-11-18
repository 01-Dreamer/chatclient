import { app, shell, BrowserWindow, screen, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { initDatabase } from './db'
import store from './store'
import { connectWebSocket } from './websocket'

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

  // 登录
  ipcMain.on('login', (e, user) => {
    store.token = user.token
    store.userId = user.userId
    initDatabase()
    connectWebSocket()
    console.log(user)
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
