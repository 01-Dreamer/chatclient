<!-- eslint-disable prettier/prettier -->
<template>
  <div class="login-panel">
    <div class="title drag">
      <span class="title-text">Chat</span>
      <el-icon class="close-icon no-drag" @click="exitApp">
        <Close />
      </el-icon>
    </div>
    <div class="login-form">
      <el-form :model="formData" @submit.prevent>
        <el-form-item prop="username">
          <el-input size="large" v-model="formData.username" clearable placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="large" show-password v-model="formData.password" clearable placeholder="请输入密码">
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" native-type="submit" :loading="loading" :disabled="isDisableLogin" @click="login">
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goToRegister">
            去注册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index'
import { ElMessage } from 'element-plus'
import $ from 'jquery'

// 表单
const formData = ref({})
const isDisableLogin = computed(() => {
  return !formData.value.username ||
    !formData.value.password
})

// 退出
const exitApp = () => {
  window.api.exitApp()
}

// 登录
const store = useUserStore()
const loading = ref(false)
const login = () => {
  loading.value = true

  const username = formData.value.username
  const password = formData.value.password
  const regex = /^[a-zA-Z0-9]+$/
  if (
    !username || username.length < 4 || username.length > 20 || !regex.test(username) ||
    !password || password.length < 10 || password.length > 30 || !regex.test(password)
  ) {
    ElMessage({
      type: 'warning',
      message: '登陆失败',
      duration: 2000,
      grouping: true
    })

    loading.value = false
    return
  }

  const url = store.getHttpUrl + '/login'
  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      username: username,
      password: password
    }),
    success: (data) => {
      if (data.userId === -1) {
        ElMessage({
          type: 'warning',
          message: '登陆失败',
          duration: 2000,
          grouping: true
        })
        loading.value = false
        return
      }

      ElMessage({
        type: 'success',
        message: '登录成功',
        duration: 2000,
        grouping: true
      })

      store.setUser({
        userId: data.userId,
        username: username,
        nickname: data.nickname,
        avatar: data.avatar,
        token: data.token
      })

      window.api.login({
        token: data.token,
        userId: data.userId,
      })
      window.api.changeWindow('main')
      router.push('/main')
    },
    error: (error) => {
      ElMessage({
        type: 'warning',
        message: '登陆失败',
        duration: 2000,
        grouping: true
      })
    }
  })
  loading.value = false
}


// 去注册
const router = useRouter()
const goToRegister = () => {
  window.api.changeWindow('register')
  router.push('/register')
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
