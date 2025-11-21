<template>
  <div class="session-window">
    <div v-for="session in sessions" :key="session.id" class="session-item no-drag" @click="changeSession(session.id)"
      @contextmenu.prevent="handleContextMenu($event, session.id)"
      :style="{ background: session.id === currentSessionId ? '#D8D8D8' : '' }">
      <el-badge :max="99" :hidden="!session.unreadCount" :value="session.unreadCount" class="session-avatar">
        <img class="avatar-img" :src="session.avatar" alt="error">
      </el-badge>
      <div class="session-info">
        <div class="session-info-top">
          <div class="session-name">
            <span>{{ session.name }}</span>
            <el-icon class="group-icon" v-show="session.isGroup">
              <ChatDotSquare />
            </el-icon>
          </div>
          <div class="session-latest-time">
            <span>{{ session.latestTime }}</span>
          </div>
        </div>
        <div class="session-info-bottom">
          <span>{{ session.latestMessage }}</span>
        </div>
      </div>
    </div>
  </div>

  <div v-show="menuVisible" class="context-menu" :style="{ top: menuTop + 'px', left: menuLeft + 'px' }">
    <div class="menu-item" @click.stop="handleHideSession">
      隐藏会话
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/index'
import { storeToRefs } from 'pinia'

const currentSessionId = ref(-1)

const menuVisible = ref(false)
const menuTop = ref(0)
const menuLeft = ref(0)
const targetSessionId = ref(null)

const props = defineProps({ sessionId: String })
watch(() => props.sessionId, (id) => {
  if (!id) return
  currentSessionId.value = Number(id)
}, { immediate: true })

const store = useStore()
const { sessions } = storeToRefs(store)

const router = useRouter()
const changeSession = (id) => {
  if (!id) return
  if (String(id) === String(currentSessionId.value)) return
  currentSessionId.value = id
  store.currentSessionId = id
  store.resetSessionUnreadCount(id)
  window.api.resetSessionUnreadCount(id)
  router.push(`/main/session/${id}`)
}

const handleContextMenu = (event, sessionId) => {
  menuVisible.value = true
  menuLeft.value = event.clientX
  menuTop.value = event.clientY
  targetSessionId.value = sessionId
}

const handleHideSession = () => {
  window.api.hideSession(targetSessionId.value)
  menuVisible.value = false

  if(currentSessionId.value === targetSessionId.value) {
    router.push('/main/session/-1')
  }
}

const closeMenu = () => {
  menuVisible.value = false
}

onMounted(() => {
  window.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  window.removeEventListener('click', closeMenu)
})
</script>

<style scoped>
.session-window {
  flex: 1;
  overflow-y: auto;
}

.session-window::-webkit-scrollbar {
  width: 6px;
}

.session-window::-webkit-scrollbar-track {
  background: transparent;
}

.session-window::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 10px;
  transition: background-color 0.3s;
}

.session-window:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.4);
}

.session-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}

.session-item:hover {
  background: #D8D8D8;
  cursor: pointer;
}

.session-avatar {
  margin: auto 10px;
}

.avatar-img {
  width: 38px;
  height: 38px;
}

.session-info {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.session-info-top {
  display: flex;
  justify-content: space-between;
}

.session-name {
  font-size: 14px;
  line-height: 1.4;
  font-weight: 350;
}

.group-icon {
  color: #64B5F6;
}

.session-latest-time {
  padding-right: 8px;
  font-size: 10px;
  line-height: 1.4;
  font-weight: 100;
}

.session-info-bottom {
  font-size: 12px;
  line-height: 1.4;
  font-weight: 100;
}

.context-menu {
  position: fixed;
  z-index: 9999;
  background: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 5px 0;
  border: 1px solid #EBEEF5;
}

.menu-item {
  padding: 8px 15px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #F5F7FA;
  color: #409EFF;
}
</style>