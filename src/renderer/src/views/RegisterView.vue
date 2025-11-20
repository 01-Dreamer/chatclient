<template>
  <div class="register-panel">
    <div class="title drag">
      <span class="title-text">Chat</span>
      <el-icon class="close-icon no-drag" @click="exitApp">
        <Close />
      </el-icon>
    </div>
    <div class="register-form">
      <el-form :model="formData" @submit.prevent>
        <el-form-item prop="nickname">
          <el-input size="large" v-model="formData.nickname" placeholder="请输入昵称">
            <template #prefix>
              <el-icon>
                <Postcard />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
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
        <el-form-item prop="confirmPassword">
          <el-input size="large" show-password v-model="formData.confirmPassword" clearable placeholder="请确认密码">
            <template #prefix>
              <el-icon>
                <Check />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" native-type="submit" :loading="loading" :disabled="isDisableRegister"
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
import { ElMessage } from 'element-plus'
import { useStore } from '@/stores/index'
import $ from 'jquery'

// 表单
const formData = ref({})
const isDisableRegister = computed(() => {
  return !formData.value.nickname ||
    !formData.value.username ||
    !formData.value.password ||
    !formData.value.confirmPassword
})

// 退出
const exitApp = () => {
  window.api.exitApp()
}

// 注册
const store = useStore()
const loading = ref(false)
const register = () => {
  const nickname = formData.value.nickname
  const username = formData.value.username
  const password = formData.value.password
  const regex = /^[a-zA-Z0-9]+$/
  if (formData.value.password !== formData.value.confirmPassword) {
    ElMessage({
      message: '两次输入的密码不一致',
      type: 'warning',
      duration: 3500,
      grouping: true
    })
    return
  } else if(!nickname || nickname.length < 2 || nickname.length > 25) {
    ElMessage({
      type: 'warning',
      message: '昵称必须在2到25个字符之间',
      duration: 3500,
      grouping: true
    })
    return
  } else if (!username || username.length < 4 || username.length > 20 || !regex.test(username)) {
    ElMessage({
      type: 'warning',
      message: '用户名必须在4到20个字符之间,且只能包含字母和数字',
      duration: 3500,
      grouping: true
    })
    return
  } else if (!password || password.length < 10 || password.length > 30 || !regex.test(password)) {
    ElMessage({
      type: 'warning',
      message: '密码必须在10到30个字符之间,且只能包含字母和数字',
      duration: 3500,
      grouping: true
    })
    return
  }

  const url = store.getHttpUrl + '/auth/register'
  console.log(url)
  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      nickname: nickname,
      username: username,
      password: password
    }),
    success: (data) => {
      console.log(data)
      if (data.userId === -1) {
        ElMessage({
          type: 'warning',
          message: '注册失败,用户名已存在',
          duration: 2000,
          grouping: true
        })
        loading.value = false
        return
      }

      ElMessage({
        type: 'success',
        message: '注册成功',
        duration: 2000,
        grouping: true
      })
      formData.value = {}
    },
    error: (error) => {
      ElMessage({
        type: 'error',
        message: '无法连接服务器',
        duration: 2000,
        grouping: true
      })
    }
  })
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
.register-panel {
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

.register-form {
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
