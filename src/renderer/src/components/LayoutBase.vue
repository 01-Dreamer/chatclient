<template>
  <div class="layout">
    <div class="left-content">
      <slot name="left-content"></slot>
    </div>
    <div class="mid-content">
      <slot name="mid-content"></slot>
    </div>
    <div class="right-content">
      <div class="top-icon">
        <el-icon class="icon no-drag" @click="minWindow">
          <Minus />
        </el-icon>
        <el-icon class="icon no-drag" v-if="isFullScreen" @click="resetScreen">
          <CopyDocument />
        </el-icon>
        <el-icon class="icon no-drag" v-else @click="fullScreen">
          <Crop />
        </el-icon>
        <el-icon class="icon no-drag" @click="exitApp">
          <Close />
        </el-icon>
      </div>
      <slot name="right-content"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 最小化
const minWindow = () => {
  window.api.minWindow()
}

// 切换全屏
const isFullScreen = ref(false)
const fullScreen = () => {
  window.api.fullScreen()
  isFullScreen.value = true
}

// 恢复窗口
const resetScreen = () => {
  window.api.resetScreen()
  isFullScreen.value = false
}

// 退出
const exitApp = () => {
  window.api.exitApp()
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.left-content {
  width: 60px;
}

.mid-content {
  width: 225px;
  border-left: 1px solid #D8D8D8;
  border-right: 2px solid #D8D8D8;
  box-sizing: border-box;
}

.right-content {
  background: #EDEDED;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-icon {
  display: flex;
  justify-content: flex-end;
}

.icon {
  font-size: 15px;
  cursor: pointer;
  padding: 3px 12px;
}

.icon:hover {
  background: #D8D8D8;
  color: white;
}

.icon:last-child:hover {
  background: #FF4D4F !important;
  color: white;
}
</style>
