<template>
  <div class="set-container">
    
    <div class="profile-card">
      <div class="avatar-wrapper">
        <el-avatar :size="64" :src="user.avatar" shape="square" />
      </div>
      
      <div class="user-info">
        <div class="nickname-container">
          <el-input
            v-if="isEditing"
            ref="nameInputRef"
            v-model="user.nickname"
            class="nickname-input"
            size="small"
            @blur="handleSaveName"
            @keyup.enter="handleSaveName"
            placeholder="请输入昵称"
          />
          
          <div v-else class="nickname-display" @click="startEdit">
            <h3 class="nickname-text">{{ user.nickname }}</h3>
            <el-icon class="edit-icon"><EditPen /></el-icon>
          </div>
        </div>
        
        <p class="user-id">ID: {{ user.id }}</p>
      </div>
    </div>

    <div class="menu-group">
      <div class="menu-item hover-effect">
        <div class="item-left">
          <div class="icon-box wallet-icon">
            <el-icon><Wallet /></el-icon>
          </div>
          <span class="item-title">我的钱包</span>
        </div>
        <div class="item-right">
          <span class="balance-text">¥ {{ user.balance }}</span>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <div class="footer-area">
      <el-button type="danger" class="logout-btn" @click="handleLogout" plain>
        <el-icon style="margin-right: 5px"><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </div>

  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { Wallet, ArrowRight, SwitchButton, EditPen } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useStore } from '@/stores/index'

const store = useStore()

const user = ref({
  id: store.userId,
  nickname: store.nickname,
  avatar: 'https://zxydata.oss-cn-chengdu.aliyuncs.com/chat/avatar.jpg',
  balance: '2,580.00'
});

const isEditing = ref(false);
const nameInputRef = ref(null);
const startEdit = () => {
  ElMessage.warning('暂时不支持修改昵称');
  isEditing.value = true;
  nextTick(() => {
    nameInputRef.value?.focus();
  });
};

const handleSaveName = () => {
  if (!user.value.nickname.trim()) {
    ElMessage.warning('昵称不能为空');
    return;
  }
  isEditing.value = false;
};

const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出当前账号吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage.success('已安全退出');
    })
    .catch(() => {
    });
};
</script>

<style scoped>
.set-container {
  height: 100%;
  padding: 15px;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.profile-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.avatar-wrapper {
  margin-right: 15px;
  flex-shrink: 0;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  width: 64px;
  height: 64px;
  display: flex; 
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
  overflow: hidden;
}

.nickname-container {
  height: 28px;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  width: 100%;
}

.nickname-display {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 4px;
  margin-left: -4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  max-width: 100%;
}

.nickname-display:hover {
  background-color: #f0f2f5;
}

.nickname-text {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-icon {
  font-size: 14px;
  margin-left: 8px;
  color: #909399;
  opacity: 0;
  transition: opacity 0.2s;
}

.nickname-display:hover .edit-icon {
  opacity: 1;
}

.nickname-input {
  width: 200px;
}

:deep(.nickname-input .el-input__inner) {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
  padding-left: 5px;
  text-align: left;
}

.user-id {
  margin: 0;
  font-size: 13px;
  color: #909399;
  font-family: monospace;
}

.menu-group {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: 20px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f2f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.hover-effect:hover {
  background-color: #fafafa;
}

.item-left {
  display: flex;
  align-items: center;
}

.icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  font-size: 18px;
}

.wallet-icon {
  background-color: #ecf5ff;
  color: #409eff;
}

.item-title {
  font-size: 15px;
  color: #303133;
  font-weight: 500;
}

.item-right {
  display: flex;
  align-items: center;
}

.balance-text {
  font-size: 15px;
  color: #303133;
  font-weight: 600;
  margin-right: 8px;
}

.arrow-icon {
  color: #c0c4cc;
  font-size: 14px;
}

.footer-area {
  margin-top: auto;
  padding-bottom: 10px;
}

.logout-btn {
  width: 100%;
  height: 45px;
  font-size: 15px;
  border-radius: 8px;
}
</style>