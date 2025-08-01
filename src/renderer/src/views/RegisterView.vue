<template>
  <div class="login-panel">
    <div class="title drag">
      <span class="title-text">Chat</span>
      <el-icon class="close-icon no-drag" @click="exitApp"><Close /></el-icon>
    </div>
    <div class="login-form">
      <el-form :model="formData" @submit.prevent>
        <el-form-item prop="email">
          <el-input size="large" v-model="formData.email" clearable placeholder="请输入邮箱">
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="large" show-password v-model="formData.password" clearable placeholder="请输入密码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input size="large" show-password v-model="formData.confirmPassword" clearable placeholder="请确认密码">
            <template #prefix>
              <el-icon><Check /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captchaCode">
          <el-input size="large" v-model="formData.captchaCode" placeholder="请输入验证码">
            <template #prefix>
              <el-icon><CircleCheck /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success" native-type="submit"
            :loading="loading" :disabled="isDisableRegister"
            @click="register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goToLogin">
            去登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 表单
const formData = ref({})
const isDisableRegister = computed(() => {
  return !formData.value.email ||
    !formData.value.password ||
    !formData.value.captchaCode
})

// 退出
const exitApp = () => {
  window.api.exitApp()
}

// 注册
const loading = ref(false)
const register = () => {
  loading.value = true
  console.log(formData)
  loading.value = false
}

// 去登录
const router = useRouter()
const goToLogin = () => {
  window.api.changeWindow('login')
  router.push('/login')
}
</script>

<style scoped>
.login-panel {
  width: 100%;
  height: 100%;
}

.title {
  display: flex;
  justify-content: space-between;
}

.title-text {
  font-size: 15px;
  padding: 10px;
  color: rgba(0, 0, 0, 0.5);
}

.close-icon {
  cursor: pointer;
  padding: 10px;
}

.close-icon:hover {
  background: #FF4D4F;
  color: white;
}

.login-form {
  margin-top: 10px;
}

:deep(.el-form-item) {
  margin-bottom: 15px;
  padding: 0 10px;
}

:deep(.el-form-item .el-button) {
  width: 100%;
}
</style>
