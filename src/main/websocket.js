/* eslint-disable prettier/prettier */
import WebSocket from 'ws'
import store from './store'
import * as db from './db';

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
        processMessage(message)
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

////////////////////////////////////
// 处理消息相关逻辑
////////////////////////////////////
function processMessage(message) {
    if (!message) return
    try {
        const msgObj = JSON.parse(message)
        const { id, sessionId, senderId, createTime, type, content } = msgObj
        // 获取到的createTime是时间戳，转换为标准时间格式
        const time = new Date(createTime)
        const formatCreateTime = formatCreateTime.getFullYear() + '-' +
            String(time.getMonth() + 1).padStart(2, '0') + '-' +
            String(time.getDate()).padStart(2, '0') + ' ' +
            String(time.getHours()).padStart(2, '0') + ':' +
            String(time.getMinutes()).padStart(2, '0') + ':' +
            String(time.getSeconds()).padStart(2, '0');
        db.insertMessage(id, sessionId, senderId, formatCreateTime, type, content)
        if (type === 'text' || type === 'image' || type === 'file' || type === 'red_packet') {
            // 更新会话列表状态
        }
    } catch (error) {
        console.log('failed to process message:', error)
    }
}
////////////////////////////////////

export function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message)
    }
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
