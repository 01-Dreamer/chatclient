<template>
  <Blank v-show="currentSessionId === -1" />
  <div class="friend-profile-container no-drag" v-show="currentSessionId !== -1">
    <div class="profile-content">
      <el-tooltip
        effect="dark"
        :content="'ID: ' + currentSessionId"
        placement="top"
        :disabled="!isGroup"
      >
        <img :src="avatarUrl" alt="avatar" class="avatar-img">
      </el-tooltip>

      <div class="friend-name-wrapper">
        <div v-if="!isEditingName" @click="startEditingName" class="name-text-display">
          {{ sessionNameText }}
        </div>
        <input
          v-else
          ref="nameInputEl"
          v-model="sessionNameText"
          @blur="stopEditingName"
          @keyup.enter="stopEditingName"
          class="name-input"
          type="text"
        >
      </div>
      <div class="friend-remark">
        <span>备注：</span>
        <div v-if="!isEditingRemark" @click="startEditingRemark" class="remark-text-display">
          {{ remarkText }}
        </div>
        <input
          v-else
          ref="remarkInputEl"
          v-model="remarkText"
          @blur="stopEditingRemark"
          @keyup.enter="stopEditingRemark"
          class="remark-input"
          type="text"
        >
      </div>
    </div>
    <div class="action-button-wrapper">
      <button class="chat-button" @click="goToChat">开始聊天</button>
    </div>
  </div>
</template>

<script setup>
import Blank from '@/components/BlankView.vue'
import { ref, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import { useStore } from '@/stores/index';

const store = useStore();
const router = useRouter();
const goToChat = () => {
  if(currentSessionId.value === -1) return
  store.selectedMenu = 'chat'
  window.api.showSession(currentSessionId.value)
  router.push(`/main/session/${currentSessionId.value}`)
}

const avatarUrl = ref()
const isGroup = ref(false)
const isGroupSession = async (sessionId) => {
  isGroup.value = await window.api.isGroupSession(sessionId)
  if(isGroup.value) {
    avatarUrl.value = 'https://zxydata.oss-cn-chengdu.aliyuncs.com/chat/GroupAvatar.png'
    sessionNameText.value = '群聊名称'
  } else {
    avatarUrl.value = 'https://zxydata.oss-cn-chengdu.aliyuncs.com/chat/UserAvatar.png'
    sessionNameText.value = '好友昵称'
  }
}

const currentSessionId = ref(-1)
const props = defineProps({ sessionId: String })
watch(() => props.sessionId, (id) => {
  if (!id) return
  currentSessionId.value = Number(id)
  if (currentSessionId.value === -1) return
  isGroupSession(currentSessionId.value)
}, { immediate: true })

const sessionNameText = ref('')
const isEditingName = ref(false)
const nameInputEl = ref(null)

const startEditingName = async () => {
  ElMessage.warning('暂时不支持修改')
  //isEditingName.value = true
  await nextTick()
  nameInputEl.value?.focus()
}

const stopEditingName = () => {
  isEditingName.value = false
}

const remarkText = ref('备注名')
const isEditingRemark = ref(false)
const remarkInputEl = ref(null)

const startEditingRemark = async () => {
  ElMessage.warning('暂时不支持修改')
  //isEditingRemark.value = true
  await nextTick()
  remarkInputEl.value?.focus()
}

const stopEditingRemark = () => {
  isEditingRemark.value = false
}
</script>

<style scoped>
.friend-profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 80px 20px 40px;
  box-sizing: border-box;
  text-align: center;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.avatar-img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
}

.friend-name-wrapper {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 32px;
}

.name-text-display {
  font-size: 22px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.name-text-display:hover {
  background-color: #F0F0F0;
}

.name-input {
  font-size: 22px;
  font-weight: bold;
  font-family: inherit;
  color: #000;
  border: none;
  outline: none;
  background-color: transparent;
  border-bottom: 1px solid #42B983;
  width: 180px;
  text-align: center;
  padding: 2px 4px;
}

.friend-remark {
  font-size: 14px;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
}

.remark-text-display {
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.remark-text-display:hover {
  background-color: #F0F0F0;
}

.remark-input {
  font-size: 14px;
  font-family: inherit;
  color: #333;
  border: none;
  outline: none;
  background-color: transparent;
  border-bottom: 1px solid #42B983;
  width: 120px;
  padding: 2px 4px;
  text-align: center;
}

.action-button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.chat-button {
  background-color: #42B983;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 0;
  width: 70%;
  max-width: 220px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.chat-button:hover {
  background-color: #5AC295;
}
</style>