<template>
  <Layout class="drag">
    <template #left-content>
      <el-menu class="sider" default-active="chat">
        <div class="top-menu">
          <div class="user-avatar">
            <img class="avatar-img" src="@/assets/avatar.jpg" alt="error">
          </div>
          <el-menu-item class="no-drag" index="chat" @click="changeMenu('chat')">
            <el-icon class="menu-icon">
              <ChatDotRound />
            </el-icon>
          </el-menu-item>
          <el-menu-item class="no-drag" index="user" @click="changeMenu('friend')">
            <el-icon class="menu-icon">
              <User />
            </el-icon>
          </el-menu-item>
        </div>
        <div class="bottom-menu">
          <el-menu-item class="no-drag" index="set">
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
      <router-view name="layoutLeft" />
    </template>
    <template #right-content>
      <router-view name="layoutRight" />
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
    case 'friend':
      router.push('/friend')
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
