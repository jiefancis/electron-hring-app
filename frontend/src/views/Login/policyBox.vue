<template>
<Mask>
    <div class="policy-box">
        <div class="policy-title">{{$t('login.WarmReminder')}}</div>
        <div class="policy-content">
            {{$t('login.ensureLegalReadAndAgree')}}
            <a href="https://hweitech.com/draft/agreement/Privacy-Policy.html" target="_blank" class="dashboard-login-policy">《{{$t('login.privacyPolicy')}}》</a>
            {{$t('login.loginInAfter')}}
        </div>
        <div class="btn-list">
            <el-button class="agree-btn" @click="handleComfirm">{{$t('login.AgreeAndSignin')}}</el-button>
            <el-button class="disagree-btn" type="text" @click="handleCancel">{{$t('login.abandonLogin')}}</el-button>
        </div>
    </div>
</Mask>
</template>
<script setup lang="ts">
import Mask from '~/components/mask/index.vue'
import { ElButton } from 'element-plus'
import {defineEmits} from 'vue'

const emit = defineEmits()

const handleComfirm = () => {
    emit('handleComfirm')
}

const handleCancel = () => {
    emit('closePolicyBox')
}
</script>
<style scoped>
.policy-box{
    width: 320px;
    height: 214px;
    border-radius: 12px;
    background: #3A3A3C;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 16px;
    box-sizing: border-box;
}
.policy-title{
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 12px;
}
.policy-content{
    font-size: 13px;
    line-height: 18px;
    color: #EBEBF5;
    font-weight: 400;
    margin-bottom: 16px;
}
.agree-btn{
    width: 100%;
    margin-bottom: 20px;
    background-color: #48484A;
    border-color: #48484A;
    color: #81FF00;
    height: 50px;
    border-radius: 12px;
}
.disagree-btn{
    width: 100%;
    color: #EBEBF5;
    margin: 0;
}
</style>