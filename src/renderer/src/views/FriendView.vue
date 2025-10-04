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
        :class="{ 'active-item': group.id === currentFrinedId }">
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
        :class="{ 'active-item': friend.id === currentFrinedId }">
        <img class="avatar-img" :src="friend.avatar" alt="avatar">
        <span class="item-name">{{ friend.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const currentFrinedId = ref(0)
const isGroupListExpanded = ref(false)
const isFriendListExpanded = ref(false)

const props = defineProps({ friendId: String })
watch(() => props.friendId, (id) => {
  if (!id) return
  currentFrinedId.value = Number(id)
}, { immediate: true })


import Avatar from '@/assets/avatar.jpg'
const friends = ref([
  { id: 1, name: '张三', avatar: Avatar },
  { id: 2, name: '李四', avatar: Avatar },
  { id: 3, name: '王五', avatar: Avatar },
  { id: 4, name: '赵六', avatar: Avatar },
  { id: 1, name: '张三', avatar: Avatar },
  { id: 2, name: '李四', avatar: Avatar },
  { id: 3, name: '王五', avatar: Avatar },
  { id: 4, name: '赵六', avatar: Avatar }
])

const groups = ref([
  { id: 11, name: '相亲相爱一家人', avatar: Avatar },
  { id: 12, name: '公司项目群', avatar: Avatar },
  { id: 13, name: '周末开黑小队', avatar: Avatar }
])


const router = useRouter()
const changeInfo = (id) => {
  if (!id) return
  if (!id || String(id) === String(currentFrinedId.value)) return
  router.push(`/main/friend/${id}`)
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