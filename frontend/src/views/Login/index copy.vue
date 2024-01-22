<template>
    <div class="dashboard-login" ref="logoutRef">
      <div class="dashboard-login-info">
        <img class="dashboard-login-info-avatar" :src="LogoIcon"/>
        <img class="dashboard-login-info-tshiring" :src="TSHiring"/>
        <div class="dashboard-login-info-helper">{{ $t('login.helper') }}</div>
      </div>
      <div class="dashboard-login-form-wrapper">
        <div v-if="!isLogined&&!isShowForm">
          <el-checkbox class="login-check-box" v-model="isCheckedPolicy">
            {{ $t('login.readAndAgree') }}
            <!-- 已阅读并同意 -->
            <a href="https://hweitech.com/draft/agreement/Privacy-Policy.html" target="_blank" class="dashboard-login-policy">《{{$t('login.privacyPolicy')}}》</a>
          </el-checkbox>
          <div class="dashboard-login-btn login-register-btn btn-light"
              @click="handleLoginAndRegister">
            {{ $t('login.loginOrRegistry') }}
          </div>
        </div>
  
        <div v-else-if="isLogined&&!isShowForm">
          <div class="dashboard-login-account">{{ $t('login.currentAccount') }} {{ userInfo?.phone }}</div>
          <div style="height: 24px"></div>
          <div class="dashboard-login-btn btn-light" @click="handleLogin">{{ $t('login.quickLogin') }}</div>
          <div style="height: 16px"></div>
          <div class="dashboard-login-btn btn-default" @click="handleOtherLogin">{{ $t('login.otherAccount') }}</div>
        </div>
        <div v-else>
          <div style="color: #fff; font-size: 13px; margin: 0 0 12px 10px; text-align: left;">{{ $t('login.account') }}</div>
          <Form @changeWindowShow="handleChangeWindowShow"/>
        </div>
  
      </div>
      <!--        <img class="dashboard-container-header-close" :src="CloseIcon" @click="handleChangeWindowShow"/>-->
      <Message v-bind="message" v-if="message"/>
      <policy-box v-if="isShowPolicyBox" @closePolicyBox="isShowPolicyBox = false" @handleComfirm="confirmPolicy"></policy-box>
    </div>
  </template>
  
<script setup lang="ts">
  import Form from './form.vue'
  import PolicyBox from './policyBox.vue'
  import Message from '~/components/message/index.vue'
  import LogoIcon from "~/assets/icons/icon.png"
  import TSHiring from "~/assets/icons/TSHiring.png"
  import {GLOBAL_UPDATE_MESSAGE_KEY, STORE_IS_LOGIN_KEY, STORE_USER_INFO_KEY} from '~/constants'
  import {storageGet, storageSet} from '~/utils/index.ts'
  // import { onClickOutside } from '@vueuse/core'
  import {useGlobalState} from '~/store/global'
  import { useRouter } from 'vue-router';
  import {ElCheckbox} from 'element-plus'
  import ipcAccess from '~/utils/ipcAccess'
  
  import {defineEmits, inject, onBeforeMount, reactive, ref} from 'vue'
  
  const isShowConfirm = ref(false)
  const logoutRef = ref(null)
  // const storeIsLogin = JSON.parse(localStorage.getItem(STORE_IS_LOGIN_KEY) || 'false')
  const isLogined = ref(false)
  
  const userInfo = reactive({phone: ''})
  
  const isShowForm = ref(false);
  const isCheckedPolicy = ref(false)
  const isShowPolicyBox = ref(false)

  // const LogoIcon = ref(require('~assets/icons/icon.png'))
  // const TSHiring = ref(require('~assets/icons/TSHiring.png'))

  const setIsShowForm = (bool) => {
    isShowForm.value = bool
  }

  const confirmPolicy = () => {
    isCheckedPolicy.value = true
    isShowPolicyBox.value = false
    handleLoginAndRegister()
  }
  
  const handleLoginAndRegister = () => {
    if(!isCheckedPolicy.value){
      isShowPolicyBox.value = true
      return
    }
    setIsShowForm(true)
  }
  
  const {message} = useGlobalState()
  const emits = defineEmits(['update:isShowLogout', 'changeWindowShow'])
  
  const router = useRouter()

  const setIsShowConfirm = (bool) => {
    isShowConfirm.value = bool
    if (!bool) {
      console.log('关闭弹窗', emits)
      emits('update:isShowLogout', false)
    }
  }
  
  const handleLogout = () => {
    setIsShowConfirm(true)
  }
  
  const handleCancel = () => {
    setIsShowConfirm(false)
  }
  const handleLogoutConfirm = () => {
    setIsShowConfirm(false)
  }
  // onClickOutside(logoutRef, (event) => setIsShowConfirm(false))
  
  const handleLogin = async () => {
    console.log('一键登录')
    storageSet(STORE_IS_LOGIN_KEY, 'true')
    // emits('changeWindowShow', true)
    router.push('/Home')
  }
  
  const handleOtherLogin = () => {
    console.log('其它账号登录')
    setIsShowForm(false)
    storageSet(STORE_IS_LOGIN_KEY, 'false')
  }
  
  const handleChangeWindowShow = () => {
    emits('changeWindowShow', true)
    setIsShowForm(false)
  }
  
  onBeforeMount(async () => {
    isLogined.value = storageGet(STORE_IS_LOGIN_KEY) === 'true' ? true : false
    console.log('isLogined = ', isLogined.value);
    const res = storageGet(STORE_USER_INFO_KEY)
    console.log('STORE_USER_INFO_KEY res = ', res);
    if (res) {
      userInfo.phone = (JSON.parse(res)).phone
    }
  })

onMounted(() => {
  ipcAccess.init()
})
function checkForUpdater () {
  ipcAccess.checkForUpdater()
}
function download () {
  ipcAccess.appUpdate()
}

</script>
<style scoped>
.login-check-box{
  margin-bottom: 24px;
}
.login-check-box:deep(.el-checkbox__label){
  color: #EBEBF599;
}
.login-check-box:deep(.el-checkbox__inner){
  border-radius: 8px;
  border-color: #34C759;
}
.login-check-box:deep(.el-checkbox__inner:hover){
  border-radius: 8px;
  border-color: #34C759;
}
.login-check-box:deep(.el-checkbox__input.is-checked .el-checkbox__inner){
  border-radius: 8px;
  background-color: #34C759;
  border-color: #34C759;
}
</style>
  