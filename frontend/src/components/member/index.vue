<template>
    <Mask @click="closeModal"> <!--@click="closeModal"--> 
        <div class="member-modal abs-center"  @click.stop> <!--v-if="!qrcodeUrl" @click.stop-->
            <div class="member-modal-header">
                <div class="member-modal-header-title">
                    {{ 
                        isMember ? $t('member.payFee') : $t('member.subscribe') 
                    }}
                </div>
                <div :class="[
                    'member-modal-header-subtitle',
                    isMember ? '' : 'no-member'
                ]">
                    {{ 
                        formatSubtitle(memberStatus)
                    }}
                </div>
                <img class="member-modal-header-close" :src="CloseIcon" @click="closeModal"/>
            </div>
            <div class="member-modal-content">
                <div class="member-modal-container">
                    <div class="member-modal-content-privilege">
                        <div class="member-modal-content-title">
                            {{ $t('member.equity') }}
                        </div>
                        <div class="member-modal-content-privilege-list">
                            <div 
                                class="member-modal-content-privilege-item" 
                                v-for="(item, index) in privilegeList" :key="index"
                            >
                                <img :src="item.icon" />
                                <div class="member-modal-content-privilege-item-label">{{ item.label }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="member-modal-content-package">
                        <div class="member-modal-content-title">
                            {{ $t('member.duration') }}
                        </div>
                        <div class="member-modal-content-package-list" style="overflow-x: scroll">
                            <div class="member-modal-content-package-list">
                                <div :class="[
                                        'member-modal-content-package-item',
                                        activeIndex === index ? 'member-modal-content-package-item-active' : ''
                                    ]"
                                    v-for="(item, index) in [...goodsList, ...goodsList]"
                                    :key="index"
                                    @click.stop="() => handleClick(index)"
                                >
                                    <div class="package-item-title">
                                        {{ item.symbol }}
                                        <span class="package-item-title-money">{{ item.unitPrice }}</span>
                                        /
                                        <span class="package-item-title-type">
                                            {{ item.name }}
                                            <!-- {{ index === 1 ? $t('member.card.annual') : $t('member.card.month') }} -->
                                        </span>
                                    </div>
                                    <div class="package-item-origin">
                                        <span class="package-item-origin-price">{{ item.symbol }} {{ item.displayPrice }}</span>
                                        <span class="package-item-origin-text">{{ $t('member.beworth') }}</span>
                                    </div>
                                    <div class="package-item-tag" v-if="item.name ==='月卡'">
                                        {{ $t('member.gift') }}
                                    </div>
                                    <img class="package-item-logo" :src="IconStone" />
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    <div class="member-modal-content-pay">
                        <div class="member-modal-content-title">
                            {{ $t('member.paymentMethod') }}
                        </div>
                        <div class="member-modal-content-pay-item">
                            <div class="item-left">
                                <img class="item-left-icon" :src="IconPay" />
                                <div class="item-left-label">{{ $t('member.alipay') }}</div>
                            </div>
                            <div class="item-right" @click.stop="handlePay" v-if="!paying">
                                <div class="item-right-money"> ￥{{ payMoney }} {{ $t('member.payment') }}</div>
                                <div class="item-right-cutdown">
                                    {{ $t('member.remainingPaymentTime', { time: remaingTimeStr }) }}
                                </div>
                            </div>
                            <div class="item-right" v-else>
                                <Loading></Loading>
                            </div>
                            
                        </div>
                    </div>
                    
                    <div class="member-modal-content-protocol">
                        {{ $t('member.consent') }}

                        <a :href="MEMBER_PROTOCOL_URL" target="_blank">
                        
                        {{ $t('member.agreement') }}</a>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="member-modal abs-center" v-else>
            <div class="member-modal-header">
                <img class="member-modal-header-close" :src="CloseIcon" @click="closeModal"/>
            </div>
            <div class="member-modal-qrcode abs-center">
                <QrCode :value="qrcodeUrl"/>
            </div>
        </div> -->
    </Mask>
</template>

<script setup>
import Mask from '~/components/mask/index.vue'
import Loading from '~/components/loading/index.vue'
// import QrCode from '~/components/qrcode/index.vue'
import { useGlobalState } from '~/store/global'
import { MEMBER_PROTOCOL_URL } from '~/constants'
import { useI18n } from 'vue-i18n'
import {useTimeoutPoll} from '@vueuse/core'
import { memberApi, OrderStatusEnum } from '~/api/MemberApi'
import { ApiCodeEnum } from '~/constants/ApiCodeEnum'
import ipcAccess from '~/utils/ipcAccess'
import { createMessage, CreateMessageModel } from '~/store/global'

import CloseIcon from '~/assets/icons/close-icon.svg'
import IconAI from '~/assets/icons/member/icon-ai.svg'
import IconCount from '~/assets/icons/member/icon-count.svg'
import IconFrame from '~/assets/icons/member/icon-frame.svg'
import IconPlatform from '~/assets/icons/member/icon-platform.svg'
import IconPay from '~/assets/icons/member/icon-alipay.svg'
import IconStone from '~/assets/icons/member/icon-stone.svg'

const CUT_DOWN = 1800
const { 
    showMemberModal,
    setShowMemberModal,
    goodsList,
    isMember,
    subscribeRemainTime,

    isOutMember,
    setSubscribeStatus,
    setFreeTrialTimes,
    setSubscribeRemainTime,
    setIsMember,
    setIsOutMember,
} = useGlobalState()

const { t } = useI18n()
const remaingTime = ref(CUT_DOWN)
const paying = ref(false)
const {isActive, pause, resume} = useTimeoutPoll(cutdown, 1000)
const orderStatusPoll = useTimeoutPoll(queryOrderStatus, 3000)
const qrcodeUrl = ref('')

const remaingTimeStr = computed(() => {
    const min = Math.floor(remaingTime.value / 60)
    const second = remaingTime.value % 60
    return `${min}:${second > 9 ? second : `0${second}`}`
})

const setPaying = (bool) => { paying.value = bool }
const resetRemaingTime = () => {
    remaingTime.value = CUT_DOWN
}
function cutdown() {
    remaingTime.value--
    if (remaingTime.value <= 0) {
        pause()
        resetRemaingTime()
    }
}

const privilegeList = ref([
    {
        label: t('member.count'),
        icon: IconCount,
    },
    {
        label: t('member.platform'),
        icon: IconPlatform,
    },
    {
        label: t('member.ai'),
        icon: IconAI,
    },
    {
        label: t('member.speed'),
        icon: IconFrame,
    }
])
const orderStatus = ref(-1)
const orderId = ref('')
const activeIndex = ref(0)
const payMoney = computed(() => goodsList.value[activeIndex.value]?.unitPrice)
const memberStatus = ref(0)

watch(showMemberModal, (isShow) => {
    if(isShow) {
        resume()
        querySubscriptionsInfo()
        return
    }
    paying.value = false
    pause()
    resetRemaingTime()
})
watch(goodsList, (newVal) => {
    activeIndex.value = newVal.findIndex(item => item.name === '月卡')
}, { immediate: true})

watch(orderStatus, (newVal) => {
    if(newVal === OrderStatusEnum.SUCCESS) {

    }
})
const handleClick = (index) => {
    activeIndex.value = index
} 

onMounted(() => {
    orderStatusPoll.resume()

    const channel = 'alipaywin:close';
    ipcAccess.on(channel, (event, ...args) => {
        if(args[0] === true) {
            setPaying(false)
            if(orderStatusPoll.isActive?.value) {
                orderStatusPoll.pause()
            }
        }
    })
    
})

const closeModal = (e) => {
    e?.preventDefault?.()
    setShowMemberModal(false)
    setPaying(false)
    qrcodeUrl.value = ''
    orderId.value = null
}

async function querySubscriptionsInfo() {
    const res = await memberApi.querySubscriptionsInfo()
    console.log('查询会员信息::%s', Date.now(),  res.data.subscribeRemainTime)
    if(res.code === ApiCodeEnum.OK) {
      setSubscribeStatus(res.data.subscribeStatus || '')
      setFreeTrialTimes(res.data.freeTrialTimes || 0)
      setSubscribeRemainTime(res.data.subscribeRemainTime || 0)
      setIsMember(res.data.subscribeStatus !== 4)
      setIsOutMember(res.data.subscribeStatus === 3)
      memberStatus.value = res.data.subscribeStatus
    }
}

const handlePayResError = (type, message) => {
    setPaying(false)
    createMessage(new CreateMessageModel(type, message))
}

const handlePay = async () => {
    try {
        setPaying(true)
        const res = await memberApi.createOrder({
            productId: goodsList.value[activeIndex.value].id,
            quantity: 1,
            payMethod: "3"
        })

        if(res.code !== ApiCodeEnum.OK) {
            handlePayResError('warning', res.msg)
            return
        }

        orderId.value = res.data
        const response = await memberApi.updateOrderStatus(res.data)
        if(response.code !== ApiCodeEnum.OK) {
            handlePayResError('warning', response.msg)
            return
        }

        const data = {
            orderId: orderId.value,
            returnUrl: window.location.href
        }
        const payRes = await memberApi.payOrder(data)
        
        if(payRes.code !== ApiCodeEnum.OK) {
            handlePayResError('warning', payRes.msg)
            return
        }
        orderStatusPoll.resume()
        ipcAccess.openAlipayWin(payRes.data.displayContent)
        // window.location.href = payRes.data.displayContent

        
        // queryOrderStatus()

    } catch(error) {
        setPaying(false)
    }
}

async function queryOrderStatus() {
    if(!orderId.value) return;

    const res = await memberApi.queryOrderStatus(orderId.value)

    if(res.code !== ApiCodeEnum.OK) {
        orderStatusPoll.pause()
        createMessage(new CreateMessageModel('warning', res.msg))
        return
    }

    console.log('查询订单状态', res)
    orderStatus.value = res.data.status

    if(res.data.status === OrderStatusEnum.SUCCESS) {
        console.log('订单支付成功')
        orderStatusPoll.pause()
        pause()
        createMessage(new CreateMessageModel('success', t('member.pay.success')))
        querySubscriptionsInfo()
        ipcAccess.closeAlipayWin()
        closeModal()
        return
    }
    if(res.data.status === OrderStatusEnum.FAIL) {
        orderStatusPoll.pause()
        createMessage(new CreateMessageModel('warning', t('member.pay.fail')))
        return
    }
    if(res.data.status === OrderStatusEnum.TIMEOUT) {
        orderStatusPoll.pause()
        createMessage(new CreateMessageModel('warning', t('member.pay.timeout')))
        return
    }

}

const formatSubtitle = (status) => {
    const statusMap = {
        4: t('member.newUser'),
        1: t('member.remainingTime', { time: parseInt(subscribeRemainTime.value || 0), unit: subscribeRemainTime.value?.includes?.('月') ? '个月' : '天'}),
        2: t('member.remainingTime', { time: parseInt(subscribeRemainTime.value || 0), unit: subscribeRemainTime.value?.includes?.('月') ? '个月' : '天'}),
        3: t('member.notmember')
    }
    return statusMap[status]
    // return isMember.value ? 
    //     $t('member.remainingTime', { time: parseInt(subscribeRemainTime || 0), unit: subscribeRemainTime?.includes?.('月') ? '个月' : '天'}) : 
    //     $t('member.notmember')
}

</script>

<style lang="less" scoped>
.member-modal{
    width: 550px;
    height: 450px;
    flex-shrink: 0;
    border-radius: 16px;
    overflow: hidden;
    background: #2C2C2E;
    margin: auto;
    text-align: center;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: -0.4px;

    &-header{
        position: relative;
        width: 550px;
        height: 58px;
        text-align: center;
        color: #fff;
        flex-shrink: 0;
        background: #2C2C2E;
        overflow: hidden;
        &-title{
            margin: 20px 0 3px 0;
        }
        &-subtitle{
            color: #30D158;
            font-size: 12px;
            line-height: 16px;
        }
        &-close{
            position: absolute;
            top: 16px;
            right: 16px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            flex-shrink: 0;

        }
    }
    &-content{
        padding: 0 24px;
        &-title{
            color: rgba(235, 235, 245, 0.60);
            font-family: PingFang SC;
            font-size: 13px;
            font-weight: 400;
            line-height: 18px;
            letter-spacing: -0.4px;
            margin: 14px 0 9px 0;
            text-align: left;
        }
        &-privilege{
            &-list{
                display: flex;
                gap: 12px;
            }
            &-item{
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                width: 116px;
                height: 71px;
                flex-shrink: 0;
                border-radius: 8px;
                background: rgba(99, 230, 226, 0.05);
                img{
                    width: 23px;
                    height: 23px;
                    flex-shrink: 0;
                    margin: 0 0 8px 0;
                }
                &-label{
                    color: #FFF;
                    font-family: PingFang SC;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 16px;
                    letter-spacing: -0.4px;
                    opacity: 0.8;
                }
            }
        }
        &-package{
            text-align: left;
            &-list{
                display: flex;
                align-items: center;
            }
            &-item{
                position: relative;
                width: 245px;
                height: 92px;
                flex-shrink: 0;
                border-radius: 12px;
                border: 1px solid rgba(142, 142, 147, 0.50);
                padding: 20px 0 0 24px;
                box-sizing: border-box;
                cursor: pointer;
                &:first-child{
                    margin: 0 12px 0 0;
                }
                &-active{
                    border: 2px solid #34C759;
                    background: rgba(52, 199, 89, 0.10);
                    // border-color: #34C759;
                }
            }
            .package-item{
                &-title{
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #FFF;
                    font-size: 17px;
                    &-money{
                        color: #FFF;
                        font-family: PingFang SC;
                        font-size: 28px;
                        font-weight: 600;
                        line-height: 28px;
                        letter-spacing: -0.4px;
                    }
                    &-type{
                        font-family: PingFang SC;
                        font-weight: 600;
                        line-height: 22px;
                        letter-spacing: -0.4px;
                    }
                }
                &-logo{
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    opacity: 0.1;
                }
                &-origin{
                    position: relative;
                    color: rgba(235, 235, 245, 0.60);
                    font-family: PingFang SC;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 16px;
                    letter-spacing: -0.4px;
                    margin: 8px 0 0 0;
                    &-price{
                        position: relative;
                        padding: 0 5px 0 0;
                        &:before{
                            content: '';
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            height: 1px;
                            width: 100%;
                            height: 1px;
                            background: rgba(235, 235, 245, 0.60);
                        }
                    }
                    &-text{
                        padding: 0 0 0 3px;
                    }
                }
            }
        }
        &-pay{
            &-item{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 502px;
                height: 65px;
                flex-shrink: 0;
                border-radius: 12px;
                border: 1px solid rgba(142, 142, 147, 0.50);
                padding: 0 12px 0 24px;
                box-sizing: border-box;
                .item {
                    &-left{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        &-icon{
                            width: 20px;
                            height: 20px;
                            flex-shrink: 0;
                            margin: 0 8px 0 0;
                        }
                        &-label{
                            color: #FFF;
                            font-family: PingFang SC;
                            font-size: 13px;
                            font-weight: 400;
                            line-height: 18px;
                            letter-spacing: -0.4px;
                        }
                    }
                    &-right{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        width: 159px;
                        height: 41px;
                        flex-shrink: 0;
                        border-radius: 6px;
                        background: #30D158;
                        text-align: center;
                        color: #000;
                        cursor: pointer;
                        &-money{
                            font-family: PingFang SC;
                            font-size: 13px;
                            font-weight: 600;
                            line-height: 18px;
                            letter-spacing: -0.4px;
                            margin: 0 0 3px 0;
                        }
                        &-cutdown{
                            text-align: center;
                            font-family: PingFang SC;
                            font-size: 11px;
                            font-weight: 400;
                            line-height: 13px;
                            letter-spacing: -0.4px;
                        }
                    }
                }
                
            }
        }
        &-protocol{
            color: rgba(235, 235, 245, 0.30);
            font-family: PingFang SC;
            font-size: 11px;
            font-weight: 400;
            line-height: 13px;
            letter-spacing: -0.4px;
            text-align: left;
            margin: 8px 0 0 0;
            a{
                color: #0A84FF;
                font-family: PingFang SC;
                font-size: 11px;
                font-weight: 400;
                line-height: 13px;
                letter-spacing: -0.4px;
                cursor: pointer;
            }
        }
    }
    &-code{
        width: 600px;
        height: 300px;
    }
    .package-item-tag{
        position: absolute;
        top: -2px;
        right: -1px;
        display: inline-flex;
        padding: 6px 20px;
        justify-content: center;
        align-items: center;
        border-radius: 0px 12px;
        overflow: hidden;
        background: #63E6E2;
        color: #000;
    }
    .no-member{
        color: #FF9F0A;
    }
}

</style>