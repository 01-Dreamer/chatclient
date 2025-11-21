import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getContactList } from '../main/db'

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

  getContactList: () => {
    return ipcRenderer.invoke('getContactList')
  },

  getMessageList: (sessionId) => {
    return ipcRenderer.invoke('getMessageList', sessionId)
  },

  getLastMessage: (sessionId) => {
    return ipcRenderer.invoke('getLastMessage', sessionId)
  },

  onSession: (callback) => {
    ipcRenderer.removeAllListeners('session')
    ipcRenderer.on('session', (event, sessionId) => {
      callback(sessionId)
    })
  },

  onMessage: (callback) => {
    ipcRenderer.removeAllListeners('message')
    ipcRenderer.on('message', (event, message) => {
      callback(message)
    })
  },

  resetSessionUnreadCount: (sessionId) => {
    ipcRenderer.send('resetSessionUnreadCount', sessionId)
  },

  sendMessageByWs: (message) => {
    ipcRenderer.send('sendMessageByWs', message)
  },

  isGroupSession: (sessionId) => {
    return ipcRenderer.invoke('isGroupSession', sessionId)
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
