<template>
  <div class="friend-list-window no-drag">
    <div class="list-category" @click="isGroupListExpanded = !isGroupListExpanded">
      <el-icon class="arrow-icon" :class="{ 'expanded': isGroupListExpanded }">
        <ArrowRight />
      </el-icon>
      <span>群聊</span>
    </div>
    <div v-show="isGroupListExpanded">
      <div v-for="group in groups" :key="group.id" class="list-item" @click="changeInfo(group.id)"
        :class="{ 'active-item': group.id === currentSessionId }">
        <img class="avatar-img" :src="group.avatar" alt="avatar">
        <span class="item-name">{{ group.name }}</span>
      </div>
    </div>
    <div class="list-category" @click="isFriendListExpanded = !isFriendListExpanded">
      <el-icon class="arrow-icon" :class="{ 'expanded': isFriendListExpanded }">
        <ArrowRight />
      </el-icon>
      <span>好友</span>
    </div>
    <div v-show="isFriendListExpanded">
      <div v-for="friend in friends" :key="friend.id" class="list-item" @click="changeInfo(friend.id)"
        :class="{ 'active-item': friend.id === currentSessionId }">
        <img class="avatar-img" :src="friend.avatar" alt="avatar">
        <span class="item-name">{{ friend.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const currentSessionId = ref(0)
const isGroupListExpanded = ref(false)
const isFriendListExpanded = ref(false)

const props = defineProps({ sessionId: String })
watch(() => props.sessionId, (id) => {
  if (!id) return
  currentSessionId.value = Number(id)
}, { immediate: true })


const friends = ref([])
const groups = ref([])
onMounted(async () => {
  const contactList = await window.api.getContactList()
  for (const contact of contactList) {
    if(contact.peer_id === -1) {
      groups.value.push({
        id: contact.id,
        name: contact.name,
        avatar: 'https://zxydata.oss-cn-chengdu.aliyuncs.com/chat/GroupAvatar.png'
      })
    } else {
      friends.value.push({
        id: contact.id,
        name: contact.name,
        avatar: 'https://zxydata.oss-cn-chengdu.aliyuncs.com/chat/UserAvatar_' + contact.peer_id + '.png',
      })
    }
  }
})


const router = useRouter()
const changeInfo = (id) => {
  if (!id || String(id) === String(currentSessionId.value)) return
  router.push(`/main/contact/${id}`)
}
</script>

<style scoped>
.friend-list-window {
  flex: 1;
  overflow-y: auto;
  background-color: #F5F5F5;
  user-select: none;
}

.friend-list-window::-webkit-scrollbar {
  width: 6px;
}

.friend-list-window::-webkit-scrollbar-track {
  background: transparent;
}

.friend-list-window::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 10px;
  transition: background-color 0.3s;
}

.friend-list-window:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.4);
}

.list-category {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  font-size: 13px;
  color: #888;
  cursor: pointer;
}

.arrow-icon {
  margin-right: 5px;
  transition: transform 0.2s ease-in-out;
}

.arrow-icon.expanded {
  transform: rotate(90deg);
}

.list-item {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-item:hover {
  background: #EAEAEA;
}


.list-item.active-item {
  background: #D8D8D8;
}

.avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 5px;
  margin-right: 10px;
}

.item-name {
  font-size: 14px;
  color: #333;
}
</style>