<template>
  <Layout class="drag">
    <template #left-content>
      <el-menu class="sider" default-active="chat">
        <div class="top-menu">
          <div class="user-avatar">
            <img class="avatar-img" src="@/assets/avatar.jpg" alt="error">
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
          <el-input class="search-input no-drag" size="small" placeholder="搜索">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-icon class="plus-icon no-drag">
            <Plus />
          </el-icon>
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
import { ref } from 'vue'
import Layout from '@/components/LayoutBase.vue'
import Notify from '@/views/NotifyView.vue'
import Set from '@/views/SetView.vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/index'

const store = useStore()
const updateSessions = async () => {
  const sessionList = await window.api.getSessionList()
  store.sessions = []
  for (const session of sessionList) {
    store.sessions.push({
      id: session.id,
      name: session.name,
      isGroup: session.is_group === 1,
      latestTime: "7/24",
      latestMessage: "测试消息",
      unreadCount: session.unread_count,
      avatar: session.avatar
    })
  }
}

// 监听主进程的Session变化
window.api.onSession((message) => {
  message;
  updateSessions()
})

// 切换菜单
const router = useRouter()
const changeMenu = (clickMenu) => {
  switch (clickMenu) {
    case 'session':
      router.push('/main/session/0')
      break
    case 'contact':
      router.push('/main/contact/0')
      break
    default:
      console.log('changeMenu error')
  }
}

// 显示通知
const notifyVisible = ref(false)
const showNotification = () => {
  notifyVisible.value = true
}

// 显示设置
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
}

.plus-icon:hover {
  background: #D8D8D8;
}
</style>
