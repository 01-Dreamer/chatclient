<template>
  <Layout class="drag">
    <template #left-content>
      <el-menu class="sider" :default-active="selectedMenu">
        <div class="top-menu">
          <div class="user-avatar">
            <img class="avatar-img" :src="selfAvatarUrl" alt="error">
          </div>
          <el-menu-item class="no-drag" index="chat" @click="changeMenu('session')">
            <el-icon class="menu-icon">
              <ChatDotRound />
            </el-icon>
          </el-menu-item>
          <el-menu-item class="no-drag" index="user" @click="changeMenu('contact')">
            <el-icon class="menu-icon">
              <User />
            </el-icon>
          </el-menu-item>
          <el-menu-item class="no-drag" @click="showNotification()">
            <el-icon class="menu-icon">
              <Bell />
            </el-icon>
          </el-menu-item>
        </div>
        <div class="bottom-menu" @click="showSet()">
          <el-menu-item class="no-drag">
            <el-icon class="menu-icon">
              <Setting />
            </el-icon>
          </el-menu-item>
        </div>
      </el-menu>
    </template>
    <template #mid-content>
      <div class="top-search">
        <div class="search-box">
          <el-input class="search-input no-drag" size="small" placeholder="搜索" v-model="searchText">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-dropdown trigger="click" @command="handlePlusCommand" popper-class="no-drag">
            <el-icon class="plus-icon no-drag">
              <Plus />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="addFriend">添加好友</el-dropdown-item>
                <el-dropdown-item command="joinGroup">加入群聊</el-dropdown-item>
                <el-dropdown-item command="createGroup">创建群聊</el-dropdown-item>
                <el-dropdown-item command="scan">扫一扫</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <router-view name="MainLeft" />
    </template>
    <template #right-content>
      <router-view name="MainRight" />
    </template>
  </Layout>
  <el-drawer v-model="notifyVisible" direction="rtl" size="500px" :with-header="true" title="通知" class="no-drag"
    destroy-on-close>
    <Notify />
  </el-drawer>
  <el-drawer v-model="setVisible" direction="rtl" size="500px" :with-header="true" title="设置" class="no-drag"
    destroy-on-close>
    <Set />
  </el-drawer>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Layout from '@/components/LayoutBase.vue'
import Notify from '@/views/NotifyView.vue'
import Set from '@/views/SetView.vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import $ from 'jquery'


const store = useStore()
const { selectedMenu } = storeToRefs(store)
const selfAvatarUrl = 'https://zxydata.oss-cn-chengdu.aliyuncs.com/chat/UserAvatar_' + store.userId + '.png'

const searchText = ref('')

// 添加好友
const addFriend = () => {
  if (isNaN(searchText.value)) {
    ElMessage.error('请输入正确的用户ID')
    return
  }
  const friendId = parseInt(searchText.value)
  const url = store.getHttpUrl + '/session/applyAddFriend?friendId=' + friendId;
  $.ajax({
    url: url,
    type: 'POST',
    headers: {
        'Authorization': 'Bearer ' + store.token
    },
    success: (data) => {
      if(data) {
        ElMessage.success('好友请求已发送')
        searchText.value = ''
      } else {
        ElMessage.error('用户不存在或已经是好友')
      }
    },
    error: (error) => {
      ElMessage.error('添加好友失败')
    }
  })
}

// 加入群聊
const joinGroup = () => {
  if (isNaN(searchText.value)) {
    ElMessage.error('请输入正确的群聊ID')
    return
  }
  const sessionId = parseInt(searchText.value)
  const url = store.getHttpUrl + '/session/applyJoinGroup?sessionId=' + sessionId;
  $.ajax({
    url: url,
    type: 'POST',
    headers: {
        'Authorization': 'Bearer ' + store.token
    },
    success: (data) => {
      if(data) {
        ElMessage.success('群聊请求已发送')
        searchText.value = ''
      } else {
        ElMessage.error('群聊不存在或已经在群内')
      }
    },
    error: (error) => {
      ElMessage.error('添加群聊失败')
    }
  })
}

// 创建群聊
const createGroup = () => {
  const name = searchText.value.trim()
  if (name.length === 0) {
    ElMessage.error('请输入群聊名称')
    return
  }
  const url = store.getHttpUrl + '/session/createGroupSession?name=' + encodeURIComponent(name);
  $.ajax({
    url: url,
    type: 'POST',
    headers: {
        'Authorization': 'Bearer ' + store.token
    },
    success: (data) => {
      if(data !== -1) {
        window.api.addSession({
          id: data,
          name: name,
          peer_id: -1,
          avatar: 'null'
        })
        ElMessage.success('群聊创建成功')
        searchText.value = ''
      } else {
        ElMessage.error('创建群聊失败')
      }
    },
    error: (error) => {
      ElMessage.error('创建群聊失败')
    }
  })
}

const scan = () => {
  console.log('scan')
}

const handlePlusCommand = (command) => {
  switch (command) {
    case 'addFriend':
      addFriend()
      break
    case 'joinGroup':
      joinGroup()
      break
    case 'createGroup':
      createGroup()
      break
    case 'scan':
      scan()
      break
  }
}

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

const updateSessions = async () => {
  const sessionList = await window.api.getSessionList()
  store.sessions = []
  for (const session of sessionList) {
    const lastMessage = await window.api.getLastMessage(session.id)
    let lastTimeText = ''
    let lastMessageText = '~暂无消息~'
    if (lastMessage) {
      lastTimeText = formatTimestamp(lastMessage.createTime)
      if (lastMessage.type === 'text') {
        if (lastMessage.content.length > 12) {
          lastMessageText = lastMessage.content.substring(0, 12) + '...'
        } else {
          lastMessageText = lastMessage.content
        }
      } else if (lastMessage.type === 'image') {
        lastMessageText = '[图片]'
      } else if (lastMessage.type === 'file') {
        lastMessageText = '[文件]'
      } else if (lastMessage.type === 'red_packet') {
        lastMessageText = '[红包]'
      } else {
        lastMessageText = '[未知消息]'
      }
    }

    let avatarUrl = null
    if (session.peer_id === -1) {
      avatarUrl = 'https://zxydata.oss-cn-chengdu.aliyuncs.com/chat/GroupAvatar.png'
    } else {
      avatarUrl = 'https://zxydata.oss-cn-chengdu.aliyuncs.com/chat/UserAvatar_' + session.peer_id + '.png'
    }

    const shortSessionName = session.name.length > 3 ? session.name.substring(0, 3) + '...' : session.name
    store.sessions.push({
      id: session.id,
      name: shortSessionName,
      isGroup: session.peer_id === -1,
      latestTime: lastTimeText,
      latestMessage: lastMessageText,
      unreadCount: session.unread_count,
      avatar: avatarUrl
    })
  }
}

const updateSessionById = async (sessionId) => {
  const session = store.sessions.find(s => s.id === sessionId)
  if (session) {
    const lastMessage = await window.api.getLastMessage(sessionId)
    let lastTimeText = ''
    let lastMessageText = '~暂无消息~'
    if (lastMessage) {
      lastTimeText = formatTimestamp(lastMessage.createTime)
      if (lastMessage.type === 'text') {
        if (lastMessage.content.length > 12) {
          lastMessageText = lastMessage.content.substring(0, 12) + '...'
        } else {
          lastMessageText = lastMessage.content
        }
      } else if (lastMessage.type === 'image') {
        lastMessageText = '[图片]'
      } else if (lastMessage.type === 'file') {
        lastMessageText = '[文件]'
      } else if (lastMessage.type === 'red_packet') {
        lastMessageText = '[红包]'
      } else {
        lastMessageText = '[未知消息]'
      }
    }
    session.latestTime = lastTimeText
    session.latestMessage = lastMessageText
    if (sessionId !== store.currentSessionId) {
      session.unreadCount += 1
    } else if (store.currentSessionId !== -1) {
      window.api.resetSessionUnreadCount(store.currentSessionId)
    }
  }
}

window.api.onSession((sessionId) => {
  if (sessionId === null) {
    updateSessions()
  } else {
    updateSessionById(sessionId)
  }
})

onMounted(() => {
  updateSessions()
})

const router = useRouter()
const changeMenu = (clickMenu) => {
  switch (clickMenu) {
    case 'session':
      store.selectedMenu = 'chat'
      store.currentSessionId = -1
      router.push('/main/session/-1')
      break
    case 'contact':
      store.selectedMenu = 'user'
      store.currentSessionId = -1
      router.push('/main/contact/-1')
      break
    default:
      console.log('changeMenu error')
  }
}

const notifyVisible = ref(false)
const showNotification = () => {
  notifyVisible.value = true
}

const setVisible = ref(false)
const showSet = () => {
  setVisible.value = true
}

</script>

<style scoped>
.sider {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  background: #EDEDED;
}

.top-menu {
  margin-top: 5px;
}

.bottom-menu {
  margin-bottom: 0;
}

.user-avatar {
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-img {
  width: 38px;
  height: 38px;
}

:deep(.el-menu-item.is-active) {
  color: #07C160 !important;
}

:deep(.el-menu-item:hover) {
  background-color: #D8D8D8 !important;
}

.menu-icon {
  font-size: 25px;
  display: flex;
}

.top-search {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65px;
  margin-bottom: 5px;
}

.search-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 25px;
  margin: auto 12px;
}

.search-input {
  height: 100%;
}

.plus-icon {
  cursor: pointer;
  background: #EAEAEA;
  height: 100%;
  margin-left: 10px;
  padding: 0 3px;
  outline: none;
}

.plus-icon:hover {
  background: #D8D8D8;
}
</style>