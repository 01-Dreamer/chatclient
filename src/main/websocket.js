/* eslint-disable prettier/prettier */
import WebSocket from 'ws'
import store from './store'

let ws = null
let reconnectTimer = null
let heartbeatTimer = null
let isIntentionalClose = false

export function connectWebSocket() {
    // 防止重复连接
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        return
    }

    // 重置标志位
    isIntentionalClose = false
    const wsUrl = store.wsUrl
    try {
        ws = new WebSocket(wsUrl, {
            headers: {
                'Authorization': store.token,
            }
        })

        initListeners()
    } catch (error) {
        console.log('failed to connect websocket:', error)
        reconnect()
    }
}

function initListeners() {
    ws.on('open', () => {
        startHeartbeat()
    })

    ws.on('message', (data) => {
        const message = data.toString()
        if (message === 'pong') return
    })

    ws.on('close', () => {
        stopHeartbeat()
        if (!isIntentionalClose) {
            reconnect()
        }
    })

    ws.on('error', (error) => {
        console.log('WebSocket error:', error)
    })
}

function reconnect() {
    clearTimeout(reconnectTimer)
    reconnectTimer = setTimeout(() => {
        connectWebSocket()
    }, 3000) // 3秒后重连
}

function startHeartbeat() {
    stopHeartbeat()
    heartbeatTimer = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send('ping')
        }
    }, 30000) // 每30秒发送一次心跳
}

function stopHeartbeat() {
    if (heartbeatTimer) clearInterval(heartbeatTimer)
}

export function closeWebSocket() {
    isIntentionalClose = true
    stopHeartbeat()
    clearTimeout(reconnectTimer)
    if (ws) {
        ws.close()
        ws = null
    }
}
