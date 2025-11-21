/* eslint-disable prettier/prettier */
import WebSocket from 'ws'
import store from './store'
import * as db from './db';
import * as mainWindow from './index'

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
// 处理消息
////////////////////////////////////
function processMessage(message) {
    if (!message) return
    try {
        const msgObj = JSON.parse(message)
        const { id, sessionId, senderId, createTime, type, content } = msgObj
        const timestampMs = new Date(createTime).getTime()
        const timestampSeconds = Math.floor(timestampMs / 1000);

        let senderNickname = 'system'
        let realContent = content;
        const atIndex = content.lastIndexOf('@');
        if (atIndex !== -1) {
            senderNickname = content.substring(atIndex + 1)
            realContent = content.substring(0, atIndex)
        }
        db.insertMessage(id, sessionId, senderId, senderNickname, timestampSeconds, type, realContent)
        if (type === 'text' || type === 'image' || type === 'file' || type === 'red_packet') {
            mainWindow.changeSession(sessionId)
            mainWindow.sendMessage({
                id: id,
                sessionId: sessionId,
                senderId: senderId,
                senderNickname: senderNickname,
                createTime: timestampSeconds,
                type: type,
                content: realContent
            })
            db.incrementSessionUnreadCount(sessionId)

        } else if (type === 'red_packet_info') {
            ;
        } else if (type === 'friend_application') {
            ;
        } else if (type === 'friend_acceptance') {
            ;
        } else if (type === 'group_application') {
            ;
        } else if (type === 'group_acceptance') {
            ;
        } else {
            console.log('unknown message type:', type)
        }


    } catch (error) {
        console.log('failed to process message:', error)
    }
}
////////////////////////////////////

// 发送消息
export function sendMessageByWs(message) {
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
