<template>
  <div class="dashboard-login-form" v-show="isShowForm">
    <el-input v-model="form.phone" :placeholder="`${$t('login.phone')}`" maxlength="11" class="dashboard-login-form-input">
      <template #append>
        <img class="dashboard-login-form-input-icon" :src="ClearIcon" v-show="form.phone" @click="handleClearPhone"/>
      </template>
    </el-input>
    <div style="height: 24px"/>
    <el-input v-model="form.code" :placeholder="`${$t('login.verifyCode')}`" :class="['dashboard-login-form-input', verifyCodeError ? 'is-error' : '']">
      <template #append>
        <div class="dashboard-login-form-input-btn btn-light" v-show="form.phone && !isActive" @click="handleSendCode">
          {{ $t('login.sendCode') }}
        </div>
        <div class="dashboard-login-form-input-cutdown" v-show="isActive">{{ count }}{{ $t('login.cutdown') }}</div>
      </template>
    </el-input>
    <div class="form-error-msg" v-show="verifyCodeError">{{ $t('login.errorCode') }}</div>
    <div style="height: 31px"/>
    <div :class="[
            'dashboard-login-btn',
            form.phone && form.code ? '' : 'dashboard-login-btn-opacity'
        ]"
         @click="handleNextStep"
    >{{ $t('login.nextStep') }}
    </div>
  </div>
  <div class="dashboard-login-form" v-show="!isShowForm">
    <el-input
        v-model="form.company"
        :placeholder="`${$t('login.compName')}`"
        maxlength="20"
        show-word-limit
        type="textarea"
        class="dashboard-login-form-company"
    />
    <div style="height: 33px"/>
    <div :class="[
                'dashboard-login-btn',
                form.company ? 'btn-light' : 'dashboard-login-btn-opacity'
            ]"
         @click="handleSubmit"
    >{{ $t('login.start') }}
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, ref} from 'vue';
import {ElInput, ElMessage} from 'element-plus';
import {useTimeoutPoll} from '@vueuse/core'
import {STORE_IS_LOGIN_KEY, STORE_USER_INFO_KEY} from '~/constants'
import ClearIcon from "~/assets/icons/input-clear.svg"
import {storageSet} from '~/utils';
// import {Cmd} from '~background/MessageModel';
import {createMessage, CreateMessageModel, useGlobalState} from '~/store/global'
import {authApi} from '../../api/AuthApi'
import UserApi from '../../api/UserApi'
import {ApiCodeEnum} from "~/constants/ApiCodeEnum";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'
import {CacheKeyEnum} from "~/constants";

const CUT_DOWN = 25

export default defineComponent({
  components: {
    ElInput,
    ElMessage
  },
  setup() {
    const { t } = useI18n()

    const form = ref({
      phone: '',
      code: '',
      company: ''
    })
    const count = ref(CUT_DOWN)
    const {isActive, pause, resume} = useTimeoutPoll(cutdown, 1000)
    const isShowForm = ref(true)
    const verifyCodeError = ref(false)
    const {setIsLogined} = useGlobalState();

    const setIsShowForm = (bool) => {
      isShowForm.value = bool
    }
    const handleClearPhone = () => {
      form.value.phone = ''
    }
    const instance = getCurrentInstance()
    const emit = instance.emit

    const router = useRouter()

    const getUserInfo = async () => {
      const apiResult = await UserApi.getUserInfo()//csApiSender.request(Cmd.SERVER_GET_USERINFO)
      console.log('getUserInfo', apiResult);
      storageSet(STORE_USER_INFO_KEY, JSON.stringify(apiResult?.data))
      if (apiResult?.data?.companyName) {
        form.value.company = apiResult?.data?.companyName
        setIsShowForm(false)
        storageSet(STORE_IS_LOGIN_KEY, true)
        setIsLogined(true)
        console.log('emit = ', emit);
        emit('changeWindowShow', true)
        router.push('/Home')
      }
    }

    const handleSendCode = async () => {
      console.log('handleSendCode--isActive', isActive?.value)
      const chinaMobileRegex = /^1[3-9]\d{9}$/;
      const testResult = chinaMobileRegex.test(form.value.phone)
      if (!testResult) {
        createMessage(new CreateMessageModel('warning', t('message.formValid.phone')));
        return
      }
      verifyCodeError.value = false
      if (!isActive?.value) {
        resume()
        // const data = {
        //     type: 1,
        //     phone: form.value.phone
        // }
        //csApiSender.request(Cmd.SERVER_SEND_VERIFY_CODE, {phone: form.value.phone}).then((res) => {
        const res = await authApi.sendVerifyCode(form.value.phone)
        console.log('验证码', res)
        if (res.code === ApiCodeEnum.OK) {
          if (res.data !== '0') {
            form.value.code = res.data;
          }
          createMessage(new CreateMessageModel('success', t('message.formValid.verifyCode')));
        } else {
          createMessage(new CreateMessageModel('warning', t('message.formValid.verifyCodeErrorAgain')));
        }
        //});
      }
    }

    const handleNextStep = async () => {
      console.log('handleNextStep', form);
      if (!form.value.phone) {
        createMessage(new CreateMessageModel('warning', t('message.formValid.emptyPhone')));
        return
      }
      if (!form.value.code) {
        createMessage(new CreateMessageModel('warning', t('message.formValid.getVerifyCode')));
        return
      }
      await handleLogin()
    }

    const handleLogin = async () => {
      const apiResult = await authApi.login(form.value.phone,form.value.code)
      if (apiResult.code !== ApiCodeEnum.OK) {
        console.log('登录错误', apiResult);
        verifyCodeError.value = true
        return;
      }
      storageSet(CacheKeyEnum.TOKEN, JSON.stringify(apiResult.data.token))

      await getUserInfo();
      setIsShowForm(false);
    }

    const handleSubmit = async () => {
      // await handleLogin()
      // console.log('form.value.company.length = ',form.value.company.length);
      if (form.value.company.length <= 0) {
        createMessage(new CreateMessageModel('warning', t('message.formValid.emptyCompName')));
        return
      }
      const res = await UserApi.saveUserInfo({companyName: form.value.company})
      // csApiSender.request(Cmd.SERVER_SAVE_USERINFO, {companyName: form.value.company}).then((res) => {
        console.log('保存用户信息', res, res.code === ApiCodeEnum.OK);
        if (res.code === ApiCodeEnum.OK) {
          
          setIsShowForm(true)
          storageSet(STORE_IS_LOGIN_KEY, true)
          setIsLogined(true)
          emit('changeWindowShow', true)
          router.push('/Home')
        } else {
          createMessage(new CreateMessageModel('warning', res?.msg || t('message.formValid.saveUserInfoError')));
        }
      // });
    }

    function cutdown() {
      count.value--
      if (count.value <= 0) {
        pause()
        count.value = CUT_DOWN
      }
    }

    return {
      form,

      handleClearPhone,
      handleSendCode,
      handleNextStep,
      handleSubmit,

      isActive,
      // setIsSendCode,
      isShowForm,
      verifyCodeError,
      setIsShowForm,

      // isSendCode,
      count,
      ClearIcon,

    }
  }
})
</script>
<style scoped>
.dashboard-login-form-company :deep(.el-input__count) {
  background: rgba(0, 0, 0, 0);
}
.form-error-msg{
  font-size: 11px;
  font-weight: 400;
  margin: 4px;
  /* display: none; */
  color: #FF453A;
}
.is-error{
  border: 1px solid #FF453A;
}
</style>
