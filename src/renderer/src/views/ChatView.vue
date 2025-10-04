<template>
  <Blank v-show="currentSessionId === 0"></Blank>
  <div class="session-info" v-show="currentSessionId !== 0">
    <div class="session-name">
      <span>{{ sessionName }}</span>
      <el-icon class="group-icon" v-show="isGroup">
        <ChatDotSquare />
      </el-icon>
    </div>
    <el-icon class="more-icon no-drag">
      <MoreFilled />
    </el-icon>
  </div>
  <div class="chat-window no-drag" v-show="currentSessionId !== 0">
    <div class="message-list">
      <template v-for="message in messages" :key="message.id">
        <div v-if="message.time" class="message-time">
          {{ message.time }}
        </div>
        <div class="message-body" :class="{ 'self-message': message.sender }">
          <img :src="message.avatar" alt="error" class="avatar-img">
          <div class="message-content">
            <div class="nickname" v-if="!message.sender">{{ message.nickname }}</div>
            <div class="message-bubble">{{ message.text }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <div class="input-area no-drag" v-show="currentSessionId !== 0">
    <div class="input-toolbar">
      <el-icon class="toolbar-icon" title="发送文件" @click="sendFile">
        <FolderOpened />
      </el-icon>
      <el-icon class="toolbar-icon" title="截图" @click="takeScreenshot">
        <Scissor />
      </el-icon>
      <el-icon class="toolbar-icon" title="转账" @click="showHistory">
        <Money />
      </el-icon>
      <el-icon class="toolbar-icon" title="聊天记录" @click="showHistory">
        <ChatLineSquare />
      </el-icon>
    </div>
    <el-input v-model="inputText" type="textarea" placeholder="输入消息，按 Enter 发送" :resize="'none'"
      class="input-textarea" />
  </div>
</template>

<script setup>
import Blank from '@/components/BlankView.vue'
import { ref, watch } from 'vue'

const currentSessionId = ref(0)
const sessionName = ref('会话名称')
const isGroup = ref(true)
const inputText = ref('')

const props = defineProps({ sessionId: String })
watch(() => props.sessionId, (id) => {
  if (!id) return
  currentSessionId.value = Number(id)
}, { immediate: true })

import Avatar from '@/assets/avatar.jpg'
const messages = ref([
  {
    id: 1,
    time: '2025-10-3 20:38',
    nickname: '测试消息',
    text: '测试消息',
    avatar: Avatar,
    sender: false
  },
  {
    id: 2,
    time: null,
    nickname: '测试消息',
    text: '测试消息',
    avatar: Avatar,
    sender: true
  },
  {
    id: 3,
    time: null,
    nickname: '测试消息',
    text: '测试消息',
    avatar: Avatar,
    sender: false
  },
  {
    id: 4,
    time: '2025-10-3 20:38',
    nickname: '测试消息',
    text: '测试消息',
    avatar: Avatar,
    sender: true
  }
])
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

.message-bubble {
  background-color: #FFFFFF;
  border: 1px solid #EAEAEA;
  padding: 4px;
  border-radius: 8px;
  font-size: 15px;
}

.message-body.self-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.self-message .avatar-img {
  margin-right: 0;
  margin-left: 10px;
}

.self-message .message-bubble {
  background-color: #95EC69;
  border-color: #84D65E;
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
