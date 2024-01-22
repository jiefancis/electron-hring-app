<template>
  <div class="dashboard-logout" ref="logoutRef">
    <div class="dashboard-logout-info">
      <div class="dashboard-logout-info-avatar">
        <img :src="AvatarIcon"/>
      </div>
      <div class="dashboard-logout-info-phone">{{ userInfo.phone }}</div>
      <div class="dashboard-logout-info-comp">{{ userInfo.companyName }}</div>
    </div>
    <div class="dashboard-logout-button" @click="handleLogout">
      {{ $t('logout.button') }}
    </div>
  </div>
  <Mask v-show="isShowConfirm">
    <div class="dashboard-logout-message">
      <div class="dashboard-logout-message-header">
        <div class="dashboard-logout-message-header-title">{{ $t('logout.button') }}</div>
        <div class="dashboard-logout-message-header-desc">{{ $t('logout.beforeQuit') }}</div>
      </div>
      <div class="dashboard-logout-message-bottom">
        <div class="dashboard-logout-message-bottom-btn" @click="handleCancel">
          {{ $t('button.cancel') }}
        </div>
        <div class="dashboard-logout-message-bottom-btn btn-out" @click="handleLogoutConfirm">
          {{ $t('button.quit') }}
        </div>
      </div>
    </div>
  </Mask>
</template>

<script setup lang="ts">
import {defineEmits, onMounted, ref} from 'vue'
import AvatarIcon from "~/assets/icons/avatar-black.svg"
import Mask from '~/components/mask/index.vue'
import {STORE_IS_LOGIN_KEY} from "~/constants"
// import { onClickOutside } from '@vueuse/core'
// import {Cmd} from "~background/MessageModel"
import {useGlobalState} from '~/store/global'
import {sleep, storageSet} from '~/utils'
import userApi from '~/api/UserApi'
// import {flowExecutor} from '~components/flowable/FlowExecutor'
// import {ApiResult} from "~components/fetch";
import {ApiCodeEnum} from "~/constants/ApiCodeEnum";
import {ElMessage} from "element-plus";
import { useRouter } from 'vue-router'

const isShowConfirm = ref(false)
const logoutRef = ref(null)
const userInfo = ref({
  phone: '',
  companyName: ''
})
const router = useRouter()

const props = defineProps({
  flowRunningPlatform: {
    type: Number
  },
})

const emits = defineEmits(['update:isShowLogout','changeWindowShow'])

const {setIsLogined,isTaskRunning,setIsTaskRunning} = useGlobalState()

const setIsShowConfirm = (bool) => {
  isShowConfirm.value = bool
  if (!bool) {
    emits('update:isShowLogout', false)
  }
}

const handleLogout = () => {
  console.log('handleLogout isTaskRunning = ',isTaskRunning.value);
  
  if(isTaskRunning.value){
    setIsShowConfirm(true)
  }else{
    handleLogoutConfirm()
  }
}

const handleCancel = () => {
  setIsShowConfirm(false)
}

const handleLogoutConfirm = async () => {
  await storageSet(STORE_IS_LOGIN_KEY, false)
  // flowExecutor.stopFlow(props.flowRunningPlatform)
  setIsShowConfirm(false)
  setIsLogined(false)
  setIsTaskRunning(false)
  // emits('changeWindowShow',false)
  router.push('/Login')
}
// onClickOutside(logoutRef, (event) => setIsShowConfirm(false))

const getUserInfo = async () => {
  const apiResult = await userApi.getUserInfo()
  if (apiResult.code !== ApiCodeEnum.OK) {
    ElMessage.error(apiResult.msg);
    return;
  }
  console.log('获取用户信息：：', apiResult.data)
  userInfo.value = apiResult.data
}

onMounted(async () => {
  getUserInfo();
})

</script>
