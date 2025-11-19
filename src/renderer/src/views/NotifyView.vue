<template>
  <div class="notify-container">
    <div class="notification-list" v-if="notifications.length !== 0">
      <div v-for="item in notifications" :key="item.id">
        <el-card 
          :shadow="item.status === 'accepted' ? 'never' : 'hover'" 
          :class="['notification-item', {'item-accepted': item.status === 'accepted'}]"
        >
          
          <div v-if="item.type === 1" class="notification-content friend-request">
            <div class="icon-area" v-if="item.groupname === undefined">
              <el-icon class="icon-large"><UserFilled /></el-icon>
            </div>
            <div class="icon-area" v-else>
              <el-icon class="icon-large"><ChatDotSquare /></el-icon>
            </div>
            <div class="message-area">
              <p v-if="item.groupname === undefined" class="message-text">
                来自 {{ item.username }} 的好友申请
              </p>
              <p v-else class="message-text">
                {{ item.username }} 申请加入群 {{ item.groupname }} (ID: {{ item.sessionId }})
              </p>
              <p class="message-time">{{ item.time }}</p>
            </div>
            
            <div class="action-area">
              <el-button 
                v-if="item.status !== 'accepted'"
                size="small" 
                type="success" 
                @click="handleAccept(item)"
              >
                同意
              </el-button>
              <el-tag v-else type="success" effect="dark" size="small">
                已接受
              </el-tag>
            </div>
          </div>

          <div v-else class="notification-content red-packet">
            <div class="icon-area">
              <el-icon class="icon-large"><Money /></el-icon>
            </div>
            <div class="message-area">
              <p v-if="item.type === 2" class="message-text">
                收到来自 {{ item.username }} 的红包 ￥{{ item.amount }}
              </p>
              <p v-else class="message-text">
                红包未被领取，退款 ￥{{ item.amount }}
                <el-tag size="small" type="warning" effect="dark" style="margin-left: 8px;">
                  已退款
                </el-tag>
              </p>
              <p class="message-time">{{ item.time }}</p>
            </div>
            </div>
        </el-card>
      </div>
    </div>
    <div v-else class="no-notifications">
        <el-empty description="暂无新的通知" :image-size="60" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UserFilled, Money, ChatDotSquare } from '@element-plus/icons-vue'; 
import { ElMessage } from 'element-plus'; 

// 1: 好友/入群请求 2: 红包通知 3: 红包退款
const notifications = ref([
  { id: 1001, type: 1, userId:1, username: '张小喵', groupname:undefined, time: '2025-11-19 14:00', status: 'pending' },
  { id: 1002, type: 1, userId:2, username: '李小狗', groupname:undefined ,time: '2025-11-19 13:50', status: 'accepted' },
  { id: 1003, type: 1, userId:1, username: '王小兔', groupname: '产品设计组', sessionId: 'A001', time: '2025-11-19 12:00', status: 'pending' },
  { id: 2001, type: 2, username: '赵小虎', amount: '100.00', time: '2025-11-19 14:30' },
  { id: 2002, type: 2, username: '钱小鹿', amount: '10.00', time: '2025-11-19 11:00' },
  { id: 2003, type: 2, username: '钱小鹿', amount: '10.00', time: '2025-11-19 11:00' },
  { id: 2004, type: 2, username: '钱小鹿', amount: '10.00', time: '2025-11-19 11:00' },
  { id: 2005, type: 2, username: '钱小鹿', amount: '10.00', time: '2025-11-19 11:00' },
  { id: 2005, type: 3, amount: '10.00', time: '2025-11-19 11:00' },
]);
const handleAccept = (item) => {
  if (item.type === 2 || item.status === 'accepted') return;
  item.status = 'accepted';

  if (item.groupname === undefined) { // 好友请求

  } else { // 群请求

  }

  ElMessage.success('已接受申请');
}
</script>

<style scoped>
.notify-container {
  height: 100%;
  padding: 10px; 
  background-color: #f5f7fa; 
  display: flex;
  flex-direction: column;
}

.notify-title {
  font-size: 18px;
  color: #303133;
  margin: 0 0 10px 0; 
  font-weight: 600;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebeef5; 
}

.notification-list {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 5px; 
  scrollbar-width: thin;
  scrollbar-color: #e0e3e9 transparent;
}

.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background-color: #e0e3e9;
  border-radius: 3px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background-color: #c8c9cc;
}

.notification-item {
  margin-bottom: 10px;
  border-radius: 8px;
  border: none;
  transition: background-color 0.3s ease;
}

.item-accepted {
  background-color: #e6f7ff;
  opacity: 0.7;
}

:deep(.notification-item .el-card__body) {
  padding: 15px !important;
}

.notification-content {
  display: flex;
  align-items: center;
}

.icon-area {
  flex-shrink: 0;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.icon-large {
  font-size: 24px;
}

.friend-request .icon-area {
  background-color: #ecf5ff;
  color: #409eff;
}

.red-packet .icon-area {
  background-color: #fef0f0;
  color: #f56c6c;
}

.message-area {
  flex-grow: 1;
  min-width: 0;
}

.message-text {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  white-space: normal;
}

.message-time {
  margin: 0;
  font-size: 11px;
  color: #909399;
}

.action-area {
  flex-shrink: 0;
  margin-left: 10px;
  display: flex;
  align-items: center;
}

.no-notifications {
    text-align: center;
    padding: 20px 0;
}
</style>