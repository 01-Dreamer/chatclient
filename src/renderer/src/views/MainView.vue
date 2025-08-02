<template>
  <Layout class="drag">
    <template #left-content>
      <el-menu class="sider" default-active="chat">
        <div class="top-menu">
          <div class="avatar">
            <img class="avatar-img" src="@/assets/avatar.jpg" alt="error">
          </div>
          <el-menu-item class="no-drag" index="chat" @click="changeMenu('chat')">
            <el-icon class="menu-icon"><ChatDotRound /></el-icon>
          </el-menu-item>
          <el-menu-item class="no-drag" index="user">
            <el-icon class="menu-icon"><User /></el-icon>
          </el-menu-item>
        </div>
        <div class="bottom-menu">
          <el-menu-item class="no-drag" index="set">
            <el-icon class="menu-icon"><Setting /></el-icon>
          </el-menu-item>
        </div>
      </el-menu>
    </template>
    <template #mid-content>
      MID
    </template>
    <template #right-content>
      RIGHT
    </template>
  </Layout>
</template>

<script setup>
import Layout from '@/components/LayoutBase.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const changeMenu = (clickMenu) => {
  switch (clickMenu) {
    case 'chat':
      router.push('/chat')
      break
    case 'user':
      router.push('/user')
      break
    case 'set':
      router.push('/set')
      break
    default:
      console.log('changeMenu error')
  }
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
  margin-top: 10px;
}

.bottom-menu {
  margin-bottom: 0;
}

.avatar {
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-img {
  height: 40px;
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
</style>
