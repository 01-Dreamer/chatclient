<template>
  <Blank v-show="currentSessionId === -1" />
  <div class="session-info" v-show="currentSessionId !== -1">
    <div class="session-name no-drag">
      <span>{{ sessionName }}</span>
      <el-icon class="group-icon" v-show="isGroup">
        <ChatDotSquare />
      </el-icon>
    </div>
    <el-icon class="more-icon no-drag">
      <MoreFilled />
    </el-icon>
  </div>
  <div class="chat-window no-drag" v-show="currentSessionId !== -1" ref="chatWindowRef">
    <div class="message-list">
      <template v-for="message in messages" :key="message.id">
        <div v-if="message.time" class="message-time">
          {{ message.time }}
        </div>
        <div class="message-body" :class="{ 'self-message': message.sender }">
          <img :src="message.avatar" alt="error" class="avatar-img">
          <div class="message-content">
            <div class="nickname" v-if="!message.sender">{{ message.nickname }}</div>
            <div class="text-msg" v-if="message.type === 'text'">{{ message.msg }}</div>
            <div class="file-msg" v-else-if="message.type === 'file'" @click="downloadFile(message.msg)">
              <el-icon :size="30">
                <Document />
              </el-icon>
              <span class="file-name">{{ message.msg.substr(82) }}</span>
            </div>
            <div class="img-msg" v-else-if="message.type === 'image'" @click="downloadFile(message.msg)">
              <img :src="message.msg" alt="error" class="image-content">
            </div>
            <div :class="['money-msg', { 'negative-money': message.msg.startsWith('-') }]"
              v-else-if="message.type === 'red_packet'" @click="getRedPacket(message.id, message.redPacketId, message.msg)">
              <el-icon :size="28" color="#FFF">
                <Money />
              </el-icon>
              <div class="money-details">
                <span class="money-amount">
                  ¥ {{ message.msg.startsWith('-') ? message.msg.substring(1) : message.msg }}
                </span>
                <span class="money-text">红包</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <div class="input-area no-drag" v-show="currentSessionId !== -1">
    <div class="input-toolbar">
      <el-icon class="toolbar-icon" title="发送文件" @click="sendFile">
        <FolderOpened />
      </el-icon>
      <el-icon class="toolbar-icon" title="截图" @click="sendImage">
        <Scissor />
      </el-icon>
      <el-icon class="toolbar-icon" title="红包" @click="sendRedPacket">
        <Money />
      </el-icon>
      <el-icon class="toolbar-icon" title="聊天记录">
        <ChatLineSquare />
      </el-icon>
    </div>
    <el-input v-model="inputText" type="textarea" placeholder="输入消息，按 Enter 发送" :resize="'none'" class="input-textarea"
      @keydown.enter.prevent.exact="sendTextMessage" />
  </div>
</template>

<script setup>
import Blank from '@/components/BlankView.vue'
import { ref, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Money, FolderOpened, Scissor, ChatLineSquare, MoreFilled, ChatDotSquare } from '@element-plus/icons-vue'
import { useStore } from '@/stores/index'
import $ from 'jquery'

const store = useStore()
const currentSessionId = ref(0)
const sessionName = ref('会话名称')
const isGroup = ref(true)
const inputText = ref('')

// 滚动条
const chatWindowRef = ref(null)
const scrollToBottom = () => {
  nextTick(() => {
    if (chatWindowRef.value) {
      chatWindowRef.value.scrollTop = chatWindowRef.value.scrollHeight
    }
  })
}

// 时间戳转换函数
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 计算两个时间戳是否超过300s
const isTimeGapExceeded = (time1, time2) => {
  return Math.abs(time1 - time2) > 300;
}

// 上传文件
const uploadFile = (file) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null)
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    const url = store.getHttpUrl + '/message/uploadFile'
    $.ajax({
      url: url,
      type: 'POST',
      headers: {
        'Authorization': 'Bearer ' + store.token
      },
      data: formData,
      processData: false,
      contentType: false,
      success: (data) => {
        resolve(data)
      },
      error: (error) => {
        error;
        resolve(null)
      }
    })
  })
}

// 发送消息入口
const sendMessage = (type, content) => {
  const message = {
    id: null,
    sessionId: currentSessionId.value,
    senderId: store.userId,
    createTime: null,
    type: type,
    content: content + "@" + store.nickname
  }
  window.api.sendMessageByWs(JSON.stringify(message))
}

// 发送文本消息
const sendTextMessage = () => {
  if (!inputText.value.trim()) return
  sendMessage('text', inputText.value.trim())
  inputText.value = ''
}

// 发送图片或文件
const sendImgOrFile = (isImage) => {
  const input = document.createElement('input')
  input.type = 'file'
  if (isImage) {
    input.accept = 'image/*'
  }

  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (isImage && !file.type.startsWith('image/')) {
      ElMessage.error('只能选择图片格式文件')
      return
    }

    const fileUrl = await uploadFile(file)
    if (!fileUrl) {
      ElMessage.error(isImage ? '图片发送失败' : '文件发送失败')
      return
    }

    if (isImage) {
      sendMessage('image', fileUrl)
    } else {
      sendMessage('file', fileUrl)
    }
    ElMessage.success(isImage ? '图片发送成功' : '文件发送成功')
  }

  input.click()
}

const sendImage = () => sendImgOrFile(true)
const sendFile = () => sendImgOrFile(false)

// 发送红包
const sendRedPacket = () => {
  ElMessageBox.prompt('请输入红包金额', '发送红包', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'text',
    inputPattern: /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/,
    inputErrorMessage: '请输入正确的金额（最多两位小数）',
  })
    .then(({ value }) => {
      const amount = Math.round(parseFloat(value) * 100);
      if (amount <= 0) {
        ElMessage.warning('红包金额必须大于0');
        return;
      }

      const redPacketId = crypto.randomUUID();
      const url = store.getHttpUrl + '/payment/setRedPacket?redPacketId=' + redPacketId + '&amount=' + amount;
      $.ajax({
        url: url,
        type: 'POST',
        headers: {
          'Authorization': 'Bearer ' + store.token
        },
        success: (data) => {
          if (data) {
            ElMessage.success('红包发送成功')
            sendMessage('red_packet', redPacketId + '%' + amount)
          } else {
            ElMessage.error('余额不足')
          }
        },
        error: (error) => {
          error;
          ElMessage.error('红包发送失败')
        }
      })
    })
    .catch(() => {
      ElMessage.info('已取消发送');
    });
}

// 获取红包
const getRedPacket = (id, redPacketId, amount) => {
  amount = amount.replace('.', '');
  if(amount.startsWith('-')) {
    return
  }

  const url = store.getHttpUrl + '/payment/getRedPacket?redPacketId=' + redPacketId + '&userId=' + store.userId;
  $.ajax({
    url: url,
    type: 'GET',
    success: (data) => {
      if (data) {
        ElMessage.success('红包领取成功')
      } else {
        ElMessage.error('红包已被领取或过期')
      }
      window.api.updateMessageContent(id, redPacketId + '%-' + amount)
      const message = messages.value.find(msg => msg.id === id)
      if (message) {
        message.msg = '-' + (parseInt(amount, 10) / 100).toFixed(2)
      }
    },
    error: (error) => {
      error;
      ElMessage.error('红包获取失败')
    }
  })
}

// 下载文件
const downloadFile = (fileUrl) => {
  const link = document.createElement('a')
  link.href = fileUrl
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 添加消息
let latestTime = 0
const addMessage = (message) => {
  let formatTime = null
  if (isTimeGapExceeded(latestTime, message.createTime)) {
    formatTime = formatTimestamp(message.createTime)
    latestTime = message.createTime
  }
  if (message.type === 'red_packet') {
    // 红包处理[红包ID,金额(分)]
    const parts = message.content.split('%')
    const amountInCents = parseInt(parts[1], 10)
    const amount = (amountInCents / 100).toFixed(2)

    messages.value.push({
      id: message.id,
      time: formatTime,
      nickname: message.senderNickname,
      type: message.type,
      msg: amount,
      redPacketId: parts[0],
      avatar: 'https://zxydata.oss-cn-chengdu.aliyuncs.com/chat/UserAvatar_' + message.senderId + '.png',
      sender: message.senderId === store.userId
    })
  } else {
    messages.value.push({
      id: message.id,
      time: formatTime,
      nickname: message.senderNickname,
      type: message.type,
      msg: message.content,
      avatar: 'https://zxydata.oss-cn-chengdu.aliyuncs.com/chat/UserAvatar_' + message.senderId + '.png',
      sender: message.senderId === store.userId
    })
  }

  if(message.senderId === store.userId) {
    scrollToBottom()
  }
}

// 获取会话信息
const updateMessages = async (sessionId) => {
  sessionId;
  const messageList = await window.api.getMessageList(sessionId)
  messages.value = []
  for (const message of messageList) {
    addMessage(message)
  }
  scrollToBottom()
}

// 监听新消息
window.api.onMessage((message) => {
  if (message.sessionId !== currentSessionId.value) return
  addMessage(message)
})

// 判断会话是否是群聊
const isGroupSession = async (sessionId) => {
  isGroup.value = await window.api.isGroupSession(sessionId)
}

// 获取会话名称
const getSessionName = async (sessionId) => {
  sessionName.value = await window.api.getSessionName(sessionId)
}

const props = defineProps({ sessionId: String })
watch(() => props.sessionId, (id) => {
  if (!id) return
  currentSessionId.value = Number(id)
  if (currentSessionId.value === -1) return
  updateMessages(currentSessionId.value)
  isGroupSession(currentSessionId.value)
  getSessionName(currentSessionId.value)
}, { immediate: true })

const messages = ref([])
</script>

<style scoped>
.session-info {
  display: flex;
  justify-content: space-between;
  color: var(--wechat-text);
  font-size: 18px;
  height: 40px;
  border-bottom: 1px solid #CCCCCC;
}

.session-name {
  font-size: 17px;
  margin-left: 15px;
}

.group-icon {
  color: #64B5F6;
}

.more-icon {
  color: var(--wechat-text-secondary);
  cursor: pointer;
  padding: 5px;
  margin: 5px 15px 5px 0;
}

.more-icon:hover {
  background: #D8D8D8;
  color: white;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
}

.chat-window::-webkit-scrollbar {
  width: 6px;
}

.chat-window::-webkit-scrollbar-track {
  background: transparent;
}

.chat-window::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 10px;
  transition: background-color 0.3s;
}

.chat-window:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.4);
}

.message-list {
  display: flex;
  flex-direction: column;
  margin: 20px 10px 10px;
}

.message-time {
  text-align: center;
  color: #888;
  font-size: 12px;
  margin: 0 auto 10px;
}

.message-body {
  display: flex;
  margin-bottom: 15px;
  max-width: 60%;
}

.avatar-img {
  width: 35px;
  height: 35px;
  border-radius: 5px;
  margin-right: 10px;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 12px;
  color: #888;
  margin-bottom: 5px;
}

.message-body.self-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.self-message .avatar-img {
  margin-right: 0;
  margin-left: 10px;
}

.text-msg {
  background-color: #FFFFFF;
  border: 1px solid #EAEAEA;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 15px;
  word-break: break-all;
}

.self-message .text-msg {
  background-color: #95EC69;
  border-color: #84D65E;
}

.img-msg {
  border-radius: 8px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.image-content {
  display: block;
  max-width: 220px;
  max-height: 220px;
  cursor: pointer;
}

.file-msg {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border: 1px solid #EAEAEA;
  padding: 10px;
  border-radius: 8px;
  width: 180px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-msg:hover {
  background-color: #F5F5F5;
}

.file-name {
  margin-left: 10px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.money-msg {
  display: flex;
  align-items: center;
  background-color: #fa9d3b;
  color: white;
  padding: 10px;
  border-radius: 8px;
  width: 180px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.money-msg:hover {
  background-color: #f88e1e;
}

.money-msg.negative-money {
  background-color: #E57373;
}

.money-msg.negative-money:hover {
  background-color: #EF5350;
}

.money-details {
  margin-left: 8px;
  display: flex;
  flex-direction: column;
}

.money-amount {
  font-size: 16px;
  font-weight: bold;
}

.money-text {
  font-size: 12px;
}

.input-area {
  height: 180px;
  border-top: 1px solid #EAEAEA;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
}

.input-toolbar {
  display: flex;
  align-items: center;
  padding: 8px 15px;
}

.toolbar-icon {
  font-size: 20px;
  color: #5f5f5f;
  cursor: pointer;
  margin-right: 18px;
  transition: color 0.2s;
}

.toolbar-icon:hover {
  color: #000;
}

.input-textarea {
  flex: 1;
}

.input-textarea :deep(.el-textarea__inner) {
  box-shadow: none;
  background-color: transparent;
  border: none;
  font-size: 15px;
  padding: 0 15px;
  color: #333;
  height: 100%;
  -webkit-app-region: no-drag;
  caret-color: #07C160;
}

.input-textarea :deep(.el-textarea__inner::-webkit-scrollbar) {
  width: 8px;
}

.input-textarea :deep(.el-textarea__inner::-webkit-scrollbar-track) {
  background: transparent;
}

.input-textarea :deep(.el-textarea__inner::-webkit-scrollbar-thumb) {
  border-radius: 10px;
  background-color: #e0e0e0;
  border: 2px solid transparent;
  background-clip: content-box;
  transition: background-color 0.3s;
}

.input-textarea :deep(.el-textarea__inner:hover::-webkit-scrollbar-thumb) {
  background-color: #C1C1C1;
}
</style>