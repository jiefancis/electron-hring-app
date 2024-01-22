<template>
    <div class="mask-bg">
        <div class="login-box">
            <div class="login-header">
                <img class="back-btn" :src="BackIcon" @click="closeFunc"/>
                <div class="login-title">{{ loginTitle }}</div>
                <div class="switch-btn"></div>
            </div>
            <div class="login-subtitle">{{ loginSubtitle }}</div>
            <div class="login-content">
                <img
                    v-if="loginType == GrantType.QR_CODE"
                    class="login-qrcode" 
                    :src="qrCodeSrc"/>
                <div class="login-form" v-else>
                    <el-input 
                        v-model="phone" 
                        :placeholder="`${$t('login.phone')}`" 
                        maxlength="11" 
                        class="login-input">
                    </el-input>
                    <el-input 
                        v-model="verifyCode" 
                        :placeholder="`${$t('login.verifyCode')}`" 
                        :class="['login-input', verifyCodeError ? 'is-error' : '']">
                        <template #append>
                            <div class="send-code-btn" @click="handleSendCode">
                                {{ sendCodeText }}
                            </div>
                        </template>
                    </el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { defineEmits,defineProps,onBeforeMount,watchEffect } from 'vue';
    import { useI18n } from 'vue-i18n'
    import BackIcon from '~/assets/icons/back.svg'
    import { agentApi } from '~/api/AgentApi.ts'
    import { ENUM_PLATFORM,GrantType } from '~/constants/enum.ts' 
    import { createMessage, CreateMessageModel } from '~/store/global'

    const { t } = useI18n()
    const emit = defineEmits()
    const props = defineProps({
        data: {
            type: Object,
            default: null
        }
    })

    const loginTitle = ref('扫码登录')
    const loginSubtitle = ref('请使用扫描二维码登录')
    const loginType = ref(1)
    const qrCodeSrc = ref('')
    const phone = ref('')
    const verifyCode = ref('')
    const sendCodeText = ref(t('login.sendCode'))
    const count = ref(60)
    const verifyCodeError = ref(false)
    const agentId = ref('')

    
    const wsMessageData = inject('wsMessage')

    // watchEffect(()=>{
    //     // console.log(`Message changed from ${wsMessageData.value}`);
    //     handleWsMessage(wsMessageData.value)
    // })

    // const handleWsMessage = (data) => {
    //     if(data.data.agentId == agentId.value && data.data.agentStatus == 5){
    //         emit('closeFunc')
    //     }
    // }

    const handleSendCode = () => {
        const chinaMobileRegex = /^1[3-9]\d{9}$/;
        const testResult = chinaMobileRegex.test(phone.value)
        if (!testResult) {
            createMessage(new CreateMessageModel('warning', t('message.formValid.phone')));
            return
        }
        agentApi.loginSendVerifyCode( props.data.agentId, props.data.platform, phone.value )
    }

    const closeFunc = () => {
        emit('closeFunc')
    }

    onBeforeMount(()=>{
        console.log('onBeforeMount props.data = ',props.data);
        agentId.value = props.data.agentId
        loginType.value = props.data.grantType
        loginTitle.value = loginType.value == GrantType.PHONE_VERIFY ? '手机号登录' : '扫码登录'
        const platformName = props.data.platform == ENUM_PLATFORM.BOSS ? 'BOSS直聘' : '猎聘'
        loginSubtitle.value = loginType.value == GrantType.PHONE_VERIFY ? `请使用${platformName}扫描二维码` : `登录${platformName}账号`
        if(loginType.value == GrantType.QR_CODE){
            qrCodeSrc.value = props.data.qrcode
        }
    })
</script>
<style scoped>
.mask-bg{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    align-items: center;
    justify-content: center;
    display: flex;
}
.login-box{
    width: 320px;
    height: 238px;
    background: #1C1C1E;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.login-header{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
}
.back-btn{
    margin-left: 12px;
    cursor: pointer;
}
.login-title{
    font-size: 15px;
    font-weight: 600;
}
.switch-btn{
    height: 24px;
    width: 24px;
    margin-right: 12px;
}
.login-subtitle{
    font-size: 12px;
    font-weight: 400;
    color: rgba(235,235,245,0.6);
    margin-top: 14px;
}
.login-qrcode{
    height: 130px;
    width: 130px;
    margin-top: 13px;
}
.login-input{
    width: 256px;
    height: 44px;
    margin-top: 16px;
}
.login-input:deep(.el-input__wrapper){
    box-shadow: none;
    background: #2C2C2E;
}
.login-input:deep(el-input-group__append){
    display: block;
    background: #2C2C2E;
    box-shadow: none;
}
.send-code-btn{
    display: block;
    background: #2C2C2E;
    height: 100%;
    box-sizing: border-box;
    line-height: 44px;
    color: #81FF00;
    cursor: pointer;
    font-size: 13px;
}
</style>