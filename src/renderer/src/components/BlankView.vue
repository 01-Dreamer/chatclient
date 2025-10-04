<template>
    <div class="blank-chat">
        <div class="blank-chat-content">
            <div class="blank-chat-icon">
                <el-icon size="120">
                    <ChatDotSquare />
                </el-icon>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.blank-chat {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.blank-chat-content {
  text-align: center;
  user-select: none;
  transform: translateY(-10%);
}

.blank-chat-icon {
  margin-bottom: 30px;
  color: #07c160;
  opacity: 0.3;
}
</style>
