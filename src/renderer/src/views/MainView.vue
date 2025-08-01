<template>
  <div class="main drag">
    <el-menu class="left-sider">
      <div class="top-menu">
        <div class="avatar">
          <img class="avatar-img" src="@/assets/avatar.jpg" alt="error">
        </div>
        <el-menu-item>
          <el-icon class="menu-icon"><ChatDotRound /></el-icon>
        </el-menu-item>
        <el-menu-item>
          <el-icon class="menu-icon"><User /></el-icon>
        </el-menu-item>
      </div>
      <div class="bottom-menu">
        <el-menu-item>
          <el-icon class="menu-icon"><Setting /></el-icon>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script setup>

</script>

<style scoped>
.main {
  display: flex;
  height: 100vh;
}

.left-sider {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 60px;
  background: #EDEDED;
}

.top-menu {
  margin-top: 10px;
}

.bottom-menu {
  margin-bottom: 15px;
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

.menu-icon {
  font-size: 25px;
  display: flex;
}
</style>
