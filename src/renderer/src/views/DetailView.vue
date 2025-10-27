<template>
  <Blank v-show="currentSessionId === 0" />
  <div class="friend-profile-container no-drag" v-show="currentSessionId !== 0">
    <div class="profile-content">
      <img src="@/assets/avatar.jpg" alt="avatar" class="avatar-img">
      <div class="friend-name">好友昵称</div>
      <div class="friend-remark">
        <span>备注：</span>
        <div v-if="!isEditingRemark" @click="startEditing" class="remark-text-display">
          {{ remarkText }}
        </div>
        <input
          v-else
          ref="remarkInputEl"
          v-model="remarkText"
          @blur="stopEditing"
          @keyup.enter="stopEditing"
          class="remark-input"
          type="text"
        >
      </div>
    </div>
    <div class="action-button-wrapper">
      <button class="delete-button">删除好友</button>
    </div>
  </div>
</template>

<script setup>
import Blank from '@/components/BlankView.vue'
import { ref, watch, nextTick } from 'vue'

const currentSessionId = ref(0)
const props = defineProps({ sessionId: String })
watch(() => props.sessionId, (id) => {
  if (!id) return
  currentSessionId.value = Number(id)
}, { immediate: true })


const remarkText = ref('备注名')
const isEditingRemark = ref(false)
const remarkInputEl = ref(null)

const startEditing = async () => {
  isEditingRemark.value = true
  await nextTick()
  remarkInputEl.value?.focus()
}

const stopEditing = () => {
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
}

.avatar-img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.friend-name {
  font-size: 22px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
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
}

.action-button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.delete-button {
  background-color: #F56C6C;
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

.delete-button:hover {
  background-color: #F78989;
}
</style>