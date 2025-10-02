<template>
  <div class="session-item no-drag">
    <el-badge :max="99" :value="99" class="session-avatar">
      <img class="avatar-img" src="@/assets/avatar.jpg" alt="error">
    </el-badge>
    <div class="session-info">
      <div class="session-info-top">
        <div class="session-name">
          会话名称
        </div>
        <div class="session-latest-time">
          7/24
        </div>
      </div>
      <div class="session-info-bottom">
        最近消息
      </div>
    </div>
  </div>

  <div class="session-item no-drag">
    <el-badge :max="99" :value="99" class="session-avatar">
      <img class="avatar-img" src="@/assets/avatar.jpg" alt="error">
    </el-badge>
    <div class="session-info">
      <div class="session-info-top">
        <div class="session-name">
          会话名称
        </div>
        <div class="session-latest-time">
          7/24
        </div>
      </div>
      <div class="session-info-bottom">
        最近消息
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
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
</style>
