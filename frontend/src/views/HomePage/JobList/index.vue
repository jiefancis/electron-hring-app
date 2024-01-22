<template>
    <div class="dashboard-job">
      <div class="dashboard-job-container" v-if="jobList?.length>0">
        <div class="dashboard-job-container-list">
          <div
              v-for="(job, index) in jobList"
              :key="job.id"
              :class="[
                          'dashboard-job-container-item',
                          isRunning(index) ? 'dashboard-job-container-item-active' : ''
                      ]"
          >
            <div class="job-item-icon">
              <img :class="[isRunning(index) ? 'job-item-icon-loading' : '']"
                   :src="isRunning(index) ? LoadingIcon : JobIcon"/>
            </div>
  
            <div class="job-item-right">
              <div class="job-item-title">{{ job.jobTitle }}</div>
              <div class="job-item-desc desc" v-if="!isRunning(index)">
                {{ $t('job.clickRunTask') }}
              </div>
              <div class="job-item-status" v-else>
                <div v-for="agentItem in runningAgentList" class="status-box">
                  <img class="platform-icon" :src="agentItem.platform == ENUM_PLATFORM.BOSS ? BOSS_ICON : LIEPIN_ICON"/>
                  <div class="agent-status">{{ agentItem.statusReason }}</div>
                </div>
              </div>
            </div>
            <div class="operate-list">
              <div class="operate-item">
                <img class="operate-item-icon" :src="SettingIcon" v-show="!isRunning(index)"
                     @click="() => handleSetting(index)"/>
              </div>
              <div class="operate-item" @click="() => toggleJob(index, job?.id)">
                <img class="operate-item-icon" :src="isRunning(index) ? CloseRunningIcon : StartIcon"/>
              </div>
            </div>
            <Operation
                ref="settingRef"
                :id="job?.id"
                v-show="settingIdx === index"
                @changeWindowShow="() => changeWindowShow(job.id)"
                @handleDeleteJob="() => handleDeleteJobSetting(job?.id)"/>
          </div>
        </div>
      </div>
      <Empty v-else/>
  
      <Mask v-show="isShowCloseModal">
        <div class="dashboard-logout-message">
          <div class="dashboard-logout-message-header">
            <div class="dashboard-logout-message-header-title">{{  $t('job.stopTask') }}</div>
            <div class="dashboard-logout-message-header-desc">{{  $t('job.ensureEndingTask') }}</div>
          </div>
          <div class="dashboard-logout-message-bottom">
            <div class="dashboard-logout-message-bottom-btn" @click="isShowCloseModal = false">
              取消
            </div>
            <div class="dashboard-logout-message-bottom-btn btn-out" @click="handleCloseJob">
              结束
            </div>
          </div>
        </div>
      </Mask>
  
      <Mask v-show="isShowDeleteModal">
        <div class="dashboard-logout-message">
          <div class="dashboard-logout-message-header">
            <div class="dashboard-logout-message-header-title">{{  $t('job.deleteTask') }}</div>
            <div class="dashboard-logout-message-header-desc">{{  $t('job.ensureDeleteTask') }}</div>
          </div>
          <div class="dashboard-logout-message-bottom">
            <div class="dashboard-logout-message-bottom-btn" @click="() => setIsShowDeleteModal(false)">
              <!-- 取消 -->
              {{  $t('button.cancel') }}
            </div>
            <div class="dashboard-logout-message-bottom-btn btn-out" @click="handleDeleteJob">
              <!-- 删除 -->
              {{  $t('button.delete') }}
            </div>
          </div>
        </div>
      </Mask>
  
      <div class="dashboard-job-create" @click="handleCreateJob">
        <img class="dashboard-job-create-icon" :src="CreateJobIcon"/>
        <div class="dashboard-job-create-text">{{  $t('job.create') }}</div>
      </div>
    </div>
    <FloatingWindow
        :jobId="currentId"
        :isShowWindow="isShowWindow"
        v-if="isShowWindow"
        :changeWindowShow="changeWindowShow"
        @refreshTaskList="fetchTaskList"
    />
    <!-- <div class="move-box-mask" v-show="isShowWindow"></div> -->
    <FilterSetting v-if="showFileterSetting" @closeFilterSetting="showFileterSetting=false" @handleRunningJob="handleRunningJob"/>
      <platform-login 
        v-if="showPlatformLogin" 
        @closeFunc="showPlatformLogin = false"
        :data="wsMessageData.data"></platform-login>
  </template>
  
  <script setup lang="ts">
  import FloatingWindow from './FloatingWindow.vue';
  import Operation from './operation.vue';
  import Mask from '~/components/mask/index.vue'
  import Empty from './empty.vue'
  import FilterSetting from './filterSetting.vue'
  import PlatformLogin from './platformLogin.vue'
  import BOSS_ICON from '~/assets/icons/boss.svg'
  import LIEPIN_ICON from '~/assets/icons/liepin.svg'
  import {createMessage, CreateMessageModel, useGlobalState} from '~/store/global'
  import { taskApi } from '~/api/TaskApi';
  import {agentApi} from '~/api/AgentApi.ts'
  import { memberApi } from '~/api/MemberApi';
  import { useI18n } from 'vue-i18n'
  
  import {computed, defineEmits, defineProps, inject, ref, watch,onBeforeMount} from 'vue';
  import StartIcon from "~/assets/icons/start.svg"
  import StopIcon from "~/assets/icons/stop.svg"
  import LoadingIcon from "~/assets/icons/loading.png"
  import SettingIcon from "~/assets/icons/setting.svg"
  import CloseRunningIcon from "~/assets/icons/close-running.svg"
  import JobIcon from "~/assets/icons/job-icon.svg"
  import CreateJobIcon from "~/assets/icons/create-job.svg"
  import {onClickOutside} from '@vueuse/core'
  import {ElMessage} from 'element-plus';
  import {ApiCodeEnum} from "~/constants/ApiCodeEnum";
  import {AgentCmdEnum,ENUM_PLATFORM} from '~/constants/enum'
  
  const props = defineProps({
    changeWindowShow: {
      type: Function
    },
    // flowRunningPlatform: {
    //   type: Number
    // }
  })
  
  const emit = defineEmits(['showSettingModal','closePlatformLogin'])

  const { t } = useI18n()
  
  const {
    currentTaskId, 
    setCurrentTaskId, 
    isTaskRunning, 
    setIsTaskRunning,
    setTaskInfo,

    isMember,
    isOutMember,
    subscribeStatus,
    setSubscribeStatus,
    freeTrialTimes,
    setFreeTrialTimes,
    setSubscribeRemainTime,
    setIsMember,
    setIsOutMember,
    setShowMemberModal,
    isEngineStart
  } = useGlobalState()
  
  const currentId = ref('')
  const jobList = ref([])
  const activeIndex = ref(-1)
  const runningJobId = ref(-1)
  const settingIdx = ref(-1)
  const isShowWindow = ref(false)
  const isShowCloseModal = ref(false)
  const isShowDeleteModal = ref(false)
  const showPlatformLogin = ref(false)
  const running = ref(false)
  const settingRef = ref();
  const showFileterSetting = ref(false)
  const isFlowRunning = ref(false)

  const runningAgentList = reactive([])
  
  onClickOutside(settingRef, () => {
    settingIdx.value = -1
  })
  // ====================== computed ======================
  
  const isRunning = computed(() => {
    return (idx) => {    
      return jobList.value[idx]?.id === runningJobId.value && isFlowRunning.value
    }
  })
  
  // ====================== watch ======================
  watch(isTaskRunning, (bool) => {
  
    if (!bool) {
      activeIndex.value = -1;
    }
  })

  
  
  // ====================== methods ======================

  const handleWsMessage = (data) => {
    console.log('handleWsMessage data = ',data);
    
    switch(data?.cmd){
      case AgentCmdEnum.LOGIN_DIALOG:
        showPlatformLogin.value = true
        break;
      case AgentCmdEnum.LOGIN_SUCCESS:
        showPlatformLogin.value = false
        break;
      case AgentCmdEnum.STATUS_CHANGE:
        handleAgentStatusChange(data.data)
        break
      case AgentCmdEnum.LOGIN_SUCCESS:
        handleLoginSuccess(data.data)
        break
    }
  }

  const handleLoginSuccess = (data) => {
    for(let item of runningAgentList){
      if(data.agentId == item.agentId){
        emit('closePlatformLogin')
        item.isFinishedLogin = true
        startAgent()
      }
    }
  }

  const startAgent = () => {
    for(let item of runningAgentList){
      if(!item.isFinishedLogin){
        agentApi.startAgent(item.platform,item.filterMethod,item.taskId)
        break
      }
    }
  }

  const handleAgentStatusChange = (data) => {
    console.log('handleAgentStatusChange data = ',data);
    console.log('handleAgentStatusChange runningAgentList = ',runningAgentList);
    
    for(let item of runningAgentList){
      if(data.taskId == item.taskId && data.platform == item.platform){
        item.agentStatus = data.agentStatus
        item.agentId = data.agentId
        item.statusReason = data.statusReason
      }
      if(data.agentId == item.agentId){
        console.log('handleAgentStatusChange 111');
        if(data.agentStatus == 5||data.agentStatus == 6){
          item.isFinishedLogin = true
          showPlatformLogin.value = false
          startAgent()
        }
      }
    }
  }

  const wsMessageData = inject('wsMessage')

  watchEffect(()=>{
    console.log(`JobList wsMessageData = `,wsMessageData);
    handleWsMessage(wsMessageData.value)
  })

  const setIsShowDeleteModal = (bool) => {
    isShowDeleteModal.value = bool
  }
  const setCurrentId = (val) => {
    currentId.value = val
    console.log('setCurrentId = ',val);
    
    setCurrentTaskId(val)
  }
  
  const handleDeleteJobSetting = (id) => {
    setCurrentId(id)
    setIsShowDeleteModal(true)
  }
  const handleDeleteJob = async () => {
    const res = await taskApi.deleteTask(currentId.value)
    console.log('deleteTask res = ',res);
    
    if (res.code == 0) {
      await fetchTaskList()
      setIsShowDeleteModal(false)
    }
  }
  
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
  

  const toggleJob = async (idx, id) => {
    console.log('idx:::', idx)
    console.log('id:::', id)
    console.log('isEngineStart:::', isEngineStart)
    if(!isEngineStart.value){
      createMessage(new CreateMessageModel('warning', '引擎暂未连接，请稍后再试'));
      return
    }
    if (activeIndex.value === idx) {
      activeIndex.value = -1
      runningJobId.value = -1
      setCurrentId(-1)
      handleCloseJob()
    } else {      
      if (jobList.value.some((_, index) => isRunning.value?.(index))) {
        ElMessage({type: 'warning', message: t('job.hasRunningJob') })
        return
      }

      await querySubscriptionsInfo()
      if(((subscribeStatus?.value === 4) && !(freeTrialTimes?.value > 0)) || (subscribeStatus?.value === 3)) {
        ElMessage({type: 'warning', message: t('job.nopermission')})
        setShowMemberModal(true)
        return
      }
      // if(!isMember.value || isOutMember.value) {
      //   ElMessage({type: 'warning', message: t('job.nopermission')})
      //   setShowMemberModal(true)
      //   return
      // }

      activeIndex.value = idx
      runningJobId.value = id
      const taskInfo = jobList.value[idx]
      console.log('taskInfo =',taskInfo);
      
      // setCurrentId(id)
      setTaskInfo(taskInfo)
      setIsTaskRunning(true)
      showFileterSetting.value = true
    }
    settingIdx.value = -1
  }

  
  const handleRunningJob = (data) => {
    console.log('handleRunningJob data = ',data.value);
    const filterMethod = data.value.resumeFilterMethod
    const taskId = data.value.id
    runningAgentList.splice(0, runningAgentList.length);
    data.value.platformValue.forEach((item,index) => {
      const agentItem = {
        taskId: taskId,
        agentId: '',
        agentStatus: '',
        platform: item,
        statusReason: '准备中',
        filterMethod: filterMethod,
        isFinishedLogin: false
      }
      runningAgentList.push(agentItem)
    });
    startAgent()
    isFlowRunning.value = true
  }
  
  const handleCreateJob = async () => {
    await querySubscriptionsInfo()
    if(((subscribeStatus?.value === 4) && !(freeTrialTimes?.value > 0)) || (subscribeStatus?.value === 3)) {
        ElMessage({type: 'warning', message: t('job.nopermission')})
        setShowMemberModal(true)
        return
      }
    // if(!isMember.value || isOutMember.value) {
    //   ElMessage({type: 'warning', message: t('job.nopermission')})
    //   setShowMemberModal(true)
    //   return
    // }
    setCurrentId(-1)
    isShowWindow.value = true
  }
  const changeWindowShow = (boolOrId = false) => {
    isShowWindow.value = boolOrId
    if (typeof boolOrId === 'string') {
      setCurrentId(boolOrId)
    }
    if(boolOrId === false){
      fetchTaskList()
    }
  }
  
  const handleSetting = (idx) => {
    if (settingIdx.value === idx) {
      settingIdx.value = -1
    } else {
      settingIdx.value = idx
    }
  }
  
  const handleCloseJob = () => {
    setIsTaskRunning(false)
    isShowCloseModal.value = false;
    for(let item of runningAgentList){
      agentApi.stopAgent(item.agentId)
    }
    // flowExecutor.stopFlow(props.flowRunningPlatform);
  }
  
  async function fetchTaskList() {
    const apiResult = await taskApi.getTasks({current: 1})
    if (apiResult.code !== ApiCodeEnum.OK) {
      createMessage(new CreateMessageModel('warning', apiResult.msg));
    }
    const res = apiResult.data;
    if (res?.records) {
      jobList.value = res?.records;
    }
  }
  
  onBeforeMount(()=>{
    fetchTaskList()
  })
  
  
</script>
<style scoped>
.job-item-status{
  display: flex;
  flex-direction: column;
}
.status-box{
  display: flex;
}
.agent-status{
  margin-left: 4px;
  font-size: 13px;
  color: #EBEBF54D;
}
</style>
  