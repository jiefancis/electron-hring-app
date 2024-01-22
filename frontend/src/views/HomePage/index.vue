<template>
    <div class="dashboard-layout">
      <div class="dashboard-layout-menu">
        <div class="dashboard-layout-menu-header">
          <img class="dashboard-layout-menu-header-logo" :src="logo"/>
          <img class="dashboard-layout-menu-header-name" :src="TSHiring"/>
        </div>
        <div class="dashboard-layout-menu-list">
          <div
              v-for="(menu, index) in menuList"
              :class="[
                          'dashboard-layout-menu-item',
                          navActiveIndex === index ? 'dashboard-layout-menu-item-active' : ''
                      ]"
              @click="() => handleActiveMenu(index)"
          >
            <img 
              :class="['dashboard-layout-menu-item-icon', index ? 'dashboard-layout-menu-item-icon-alter' : '']"
              :src="menu.icon"
            />
            <span>{{ menu.title }}</span>
          </div>
        </div>
        <div class="dashboard-layout-setting abs-bottom">
          <div class="dashboard-layout-setting-item" @click="openMemberModal">
            <div class="dashboard-layout-setting-item-left">
              <img class="dashboard-layout-menu-item-icon w-h-24" :src="MemberIcon"/>
              <span>{{  $t('member.center') }}</span>
            </div>
            <div class="dashboard-layout-setting-item-time">
              <div style="color: #0A84FF" v-if="!isMember">
                {{ $t('member.subscribeNow') }}
              </div>
              <div style="color: #0A84FF" v-else-if="isOutMember">
                {{ $t('member.renewal') }}
              </div>
              <div v-else>
                {{ 
                  !isMember ? 
                    $t('member.remain.times', { times: freeTrialTimes }) :
                    subscribeRemainTime?.includes?.('月') ? $t('member.remain.month', { month: subscribeRemainTime }) :
                    $t('member.remain.day', { day: subscribeRemainTime })
                }}
              </div>
              
            </div>
          </div>
          <div class="dashboard-layout-setting-item" @click="handleLogout">
            <img class="dashboard-layout-menu-item-icon w-h-24" :src="MineIcon"/>
            <span>{{  $t('mine') }}</span>
          </div>
          
        </div>
      </div>
      <div class="dashboard-layout-content">
        <div class="dashboard-container-header">
          <div class="dashboard-container-header-title">{{ navActiveIndex === 0 ? `${$t('project.manage')}` : `${$t('record.menu')}` }}</div>
          <div class="dashboard-container-header-desc desc">
            {{
              navActiveIndex === 0 ?
              `${$t('project.guide')}` :
              `${$t('record.totalResume', {total: totalResume})}`
            }}
          </div>
        </div>
        <keep-alive>
          <job-list
              ref="jobRef"
              v-if="navActiveIndex === 0"
              :changeWindowShow="handleChangeWindowShow"
              :flow-running-platform="flowRunningPlatform"
              @showSettingModal="showSettingModal"
          />
          <Record v-else/>
        </keep-alive>
      </div>
      <Logout v-model:isShowLogout="isShowLogout" v-if="isShowLogout" @changeWindowShow="handleChangeWindowShow"
              :flow-running-platform="flowRunningPlatform"/>
      <Member v-show="showMemberModal"/>
    </div>
  </template>
  
<script setup lang="ts">
  import {onMounted, ref, watch, provide} from 'vue'
  import { useI18n } from 'vue-i18n'
  import { memberApi, OrderStatusEnum } from '~/api/MemberApi'

  import JobList from './JobList/index.vue'
  import Record from '~/views/record/index.vue'
  import Member from '~/components/member/index.vue'
  import {CacheKeyEnum, ENUM_PLATFORM, FlowStatusEnum} from '~/constants'
  import {createMessage, CreateMessageModel, useGlobalState} from '~/store/global'
  import {agentApi} from '~/api/AgentApi.ts'
  
  import logo from "~/assets/icons/icon.png"
  import TSHiring from "~/assets/icons/TSHiring.png"
  import JobIcon from "~/assets/icons/job.png"
  import LogIcon from "~/assets/icons/log.png"
  import MineIcon from "~/assets/icons/mine.png"
  import MemberIcon from '~/assets/icons/icon-setting-member.svg'
  import Logout from './logout/index.vue'
  import Setting from './setting.vue'
  
  
  //import dashBoardCssText from 'data-text:~/contents/css/dashboard.css'
  // import {storageWatch} from "~/utils";
  // import util from "util";
  import {ApiCodeEnum} from "~/constants/ApiCodeEnum";
  import {AgentCmdEnum} from '~/constants/enum'
  import {AppVersionCheckInfo} from "~/api/Model";
  import {versionApi} from "~/api/VersionApi.ts"

  const { t } = useI18n()
  
  const name = 'Dashboard';
  const showPlatformLogin = ref(false)
  
  const props = defineProps({
    changeWindowShow: {
      type: Function
    }
  })
  
  const {
    totalResume,
    isLogined,
    showWindow,
    setShowWindow,
    navActiveIndex,
    setNavActiveIndex,
    showMemberModal,
    setShowMemberModal,
    isMember,
    isOutMember,setIsOutMember,
    setGoodsList,
    setSubscribeStatus,
    freeTrialTimes, setFreeTrialTimes,
    subscribeRemainTime, setSubscribeRemainTime,
    setIsMember,
  } = useGlobalState()
  // const activeIndex = ref(-1)
  const isShowLogout = ref(false)
  const isShowSetting = ref(false)
  const flowRunningPlatform = ref(ENUM_PLATFORM.BOSS);
  const showHomePage = ref(false)
  const jobRef = ref(null)
  const wsMsgData = ref(null)
  const menuList = ref([
    {
      title: t('project.menu'),
      icon: JobIcon,
    },
    {
      title: t('record.menu'),
      icon: LogIcon,
    }
  ])
  const wsMessage = ref(null)
  provide('wsMessage',wsMessage)

  async function querySubscriptionsInfo() {
    const res = await memberApi.querySubscriptionsInfo()
    if(res.code === ApiCodeEnum.OK) {
      setSubscribeStatus(res.data.subscribeStatus || '')
      setFreeTrialTimes(res.data.freeTrialTimes || 0)
      setSubscribeRemainTime(res.data.subscribeRemainTime || '')
      setIsMember(res.data.subscribeStatus !== 4)
      setIsOutMember(res.data.subscribeStatus === 3)
    }
  }
  querySubscriptionsInfo()
  
  const queryMemberGoodList = async () => {
    const res = await memberApi.queryGoodList()
    console.log('查询会员商品结果', res)
    if(res.code === ApiCodeEnum.OK) {
      setGoodsList(res.data)
    }
  }
  onMounted(async () => {
    const res = await checkEngineVersion();
    if(res){
      agentApi.connectEngine(handleWsMessage)
    }
    queryMemberGoodList()
  });

  const handleWsMessage = (message: any) => {
    console.log('handleMessage = ', message);
    if(message.cmd == 'pong') return
    switch(message.cmd){
      case AgentCmdEnum.MESSAGE_TOAST:
        showAgentToast(message.data)
        break;
      case AgentCmdEnum.MESSAGE_DIALOG:
        break;
    }
    wsMessage.value = message
    console.log('wsMessage = ',wsMessage);
    
  }

  const showAgentToast = (data) => {
    const typeMap = {
      1: 'success',
      2: 'warning',
      3: 'error'
    }
    createMessage(new CreateMessageModel(typeMap[data?.type],data?.msg))
  }
  
  const checkEngineVersion = async () => {
    const checkVersionApiResult = await agentApi.checkEngineVersion()
    console.log('checkVersionApiResult = ',checkVersionApiResult);

    return checkVersionApiResult
  }

  const openMemberModal = () => { setShowMemberModal(true) }
  const checkVersion = async () => {
    try{
      const checkVersionApiResult = await versionApi.checkVersion()
      if (checkVersionApiResult.code !== ApiCodeEnum.OK) {
        createMessage(new CreateMessageModel('warning', checkVersionApiResult.msg));
        // setTimeout(() => {
        //   window.close();
        // }, 3000);
        return;
      }
   
      const checkVersionResult: AppVersionCheckInfo = checkVersionApiResult.data;
  
      if (checkVersionResult.needUpdate) {
        createMessage(new CreateMessageModel('warning', t('message.downloadLatestVersion'), 30000, checkVersionResult.updateUrl));
        if (checkVersionResult.forceUpdate) {
          // 强制更新
          setTimeout(() => {
            window.open(checkVersionResult.updateUrl, '_blank');
            window.close();
          }, 3000);
        }
      }
    }
    catch(error){
      console.error(error);
      createMessage(new CreateMessageModel('warning', t('message.checkNetworkConnect'), 3000));
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }
  
  const handleActiveMenu = (idx) => {
    // activeIndex.value = idx
    setNavActiveIndex(idx)
  }
  watch(() => showWindow.value, (bool) => {
    if (bool) {
      handleActiveMenu(0)
    }
  })
  
  const handleChangeWindowShow = (value) => {
    showHomePage.value = value
    setShowWindow(false)
    props?.changeWindowShow?.()
  }
  
  const handleLogout = () => {
    isShowLogout.value = !isShowLogout.value
  }
  const showSettingModal = (bool) => {
    isShowSetting.value = bool
  }
  
  </script>
  
  <style scoped lang="scss">
  $--color-primary: '#81FF00';
  @import "~/assets/css/Floating-css.css";
  @import "~/assets/css/dashboard.css";
  @import "~/assets/css/element.css";
  .dashboard-layout-menu-item-icon-alter{
    width: 24px;
    height: 24px;
    margin: 0 8px;
  }
  .dashboard-container-header{
    text-align: left
  }
  .dashboard-layout-setting{
    width: 100%;
    &-item{
      display: flex;
      align-items: center;
      cursor: pointer;
      margin: 0 0 16px 0;
      &-left{
        display: flex;
        align-items: center;
      }
      span{
        color: #FFF;
        font-family: PingFang SC;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
        letter-spacing: -0.4px;
      }
      &-time{
        flex: 1;
        color: #30D158;
        text-align: right;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: -0.4px;
        padding: 0 12px 0 0;
      }
    }
  }
  </style>
  
  