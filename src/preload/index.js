import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  changeWindow: (window) => {
    ipcRenderer.send('changeWindow', window)
  },

  minWindow: () => {
    ipcRenderer.send('minWindow')
  },

  fullScreen: () => {
    ipcRenderer.send('fullScreen')
  },

  resetScreen: () => {
    ipcRenderer.send('resetScreen')
  },

  exitApp: () => {
    ipcRenderer.send('exitApp')
  },

  login: (user) => {
    ipcRenderer.send('login', user)
  },

  getSessionList: () => {
    return ipcRenderer.invoke('getSessionList')
  },

  onSession: (callback) => {
    ipcRenderer.removeAllListeners('session')
    ipcRenderer.on('session', (event, message) => {
      callback(message)
    })
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
