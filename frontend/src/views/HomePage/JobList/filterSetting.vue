<template>
  <Mask>
    <div class="dashboard-job-running-setting abs-center" ref="jobSetting">
      <div class="dashboard-job-setting-header">
        {{
          step === 1 ? '请选择一个简历筛选方式运行' : '请选择运行平台与设置运行次数'
        }}
      </div>
      <div v-show="step === 1">
        <div class="dashboard-job-setting-first">
          <div @click="activeOneIndex = index"
               :class="[
                            'dashboard-job-setting-first-item',
                            activeOneIndex === index ? 'dashboard-job-setting-first-item-active' : ''
                        ]"
               v-for="(item, index) in conditionOne" :key="index">
            <div class="dashboard-job-setting-first-item-title">{{ item.title }}</div>
            <div class="dashboard-job-setting-first-item-desc">{{ item.desc }}</div>
          </div>
        </div>
        <div class="dashboard-logout-message-bottom margin-top-40" v-show="step === 1">
          <div class="dashboard-logout-message-bottom-btn" @click="handleCancel">
            取消
          </div>
          <div :class="[
                        'dashboard-logout-message-bottom-btn',
                        activeOneIndex !== -1 ? 'btn-out' : 'btn-disabled'
                    ]"
               @click="handleNextStep"
          >
            下一步
          </div>
        </div>
      </div>
      <div v-show="step === 2">
        <div class="dashboard-job-setting-second-platform">
          <div class="dashboard-job-setting-second-platform-label">运行平台可多选</div>
          <div :class="[
                                'dashboard-job-setting-second-platform-item',
                                item.isSelected ? 'dashboard-job-setting-second-platform-item-active' : ''
                            ]"
               v-for="(item, index) in platfomList" :key="index"
               @click="item.isSelected = !item.isSelected"
          >
            <img class="dashboard-job-setting-second-platform-item-img no-border" :src="item.icon"/>
            <div class="dashboard-job-setting-second-platform-item-name">{{ item.title }}</div>
            <img class="dashboard-job-setting-second-platform-item-img" :src="SelectedIcon" v-show="item.isSelected"/>
            <div class="dashboard-job-setting-second-platform-item-img" v-show="!item.isSelected"></div>
          </div>
          <!-- <div class="dashboard-job-setting-second-platform-item" v-for="(item, index) in platfomList" :key="index">

          </div> -->
        </div>
        <div class="dashboard-logout-message-bottom" v-show="step === 2">
          <div class="dashboard-logout-message-bottom-btn" @click="handlePrevStep">
            上一步
          </div>
          <div :class="[
                            'dashboard-logout-message-bottom-btn',
                             (platfomList[0].isSelected || platfomList[1].isSelected) ? 'btn-out' : 'btn-disabled'
                        ]"
               @click="startRunging"
          >
            开始筛选
          </div>
        </div>
      </div>


    </div>
  </Mask>

</template>

<script setup lang="ts">
import {defineEmits, onMounted, onUnmounted, ref} from 'vue'
import Mask from '~/components/mask/index.vue'
import {createMessage, CreateMessageModel, useGlobalState} from '~/store/global'
import {ENUM_PLATFORM} from "~/constants";
import BossIcon from "~/assets/icons/boss.svg"
import LiepinIcon from "~/assets/icons/liepin.svg"
import SelectedIcon from "~/assets/icons/selected.svg"
import { taskApi } from '~/api/TaskApi';
import { useI18n } from 'vue-i18n'
import { ResumeFilterMethod } from '~/constants/enum.ts'
// import {Cmd, ResponseMessage} from '~background/MessageModel';

const { t } = useI18n()

const emits = defineEmits(['closeFilterSetting', 'handleRunningJob'])

const {taskInfo, setIsTaskRunning } = useGlobalState()

const conditionOne = ref([
  // {
  //   title: t('job.filter.auto'), //'自动搜索并筛选',
  //   desc:  t('job.filter.desc.auto'), //'自动筛选平台推荐的候选人，并自动收藏达标简历',
  //   type: ResumeFilterMethod.AUTO_SEARCH_FILTER
  // },
  // {
  //   title: t('job.filter.system'), //'系统推荐',
  //   desc:  t('job.filter.desc.system'), //'自动筛选平台推荐的候选人，自动筛选跟我打招呼的候选人',
  //   type: ResumeFilterMethod.FILTER_AND_CHAT
  // },
  {
    title: t('job.filter.communicate'), //'仅沟通',
    desc:  t('job.filter.desc.communicate'), //'自动筛选跟我打招呼的候选人，自动回复达标候选人并收藏其简历',
    type: ResumeFilterMethod.CHAT
  },
  {
    title: t('job.filter.onlyrecommend'), //'仅筛选推荐页',
    desc: t('job.filter.desc.onlyrecommend'), //'自动筛选平台推荐的候选人',
    type: ResumeFilterMethod.FILTER
  },
])
const platfomList = ref([
  {
    title: 'boss',
    type: 1,
    icon: BossIcon,
    isSelected: false
  },
  {
    title: '猎聘',
    type: 2,
    icon: LiepinIcon,
    isSelected: false
  },
])
const detailInfo = ref(null)
const activeOneIndex = ref(-1)
const activeTwoIndex = ref(-1)
const step = ref(1)
// const platform = ref([false, false])
const jobSetting = ref(null)


const handleClickOutside = (event) => {
  // console.log('handleClickOutside event = ',event);
  if(jobSetting.value && !jobSetting.value.contains(event.target)){
    handleCancel()
  }
}

onMounted(async () => {
  await queryTaskDetail()
  setTimeout(()=>{
    window.addEventListener('click',handleClickOutside)
  },200)
})

onUnmounted(()=>{
  window.removeEventListener('click',handleClickOutside)
})

const handleNextStep = () => {
  step.value = 2
}
const handlePrevStep = () => {
  step.value = 1
}

const handleCancel = () => {
  setIsTaskRunning(false)
  emits('closeFilterSetting')
}

const startRunging = async () => {
  // console.log('detailInfo = ',detailInfo);
  if (platfomList.value.every(val => !val.isSelected)) {
    createMessage(new CreateMessageModel('warning', t('message.selectRunningPlatform')));
    return
  }

  detailInfo.value.resumeFilterMethod = conditionOne.value[activeOneIndex.value].type
  const res = await taskApi.saveTask(detailInfo.value)
  if(res == null){
    createMessage(new CreateMessageModel('warning', t('message.networkUnavailable')));
    return
  }

  const platformValue = platfomList.value.filter(item => item.isSelected).map(item => item.type);
  console.log('platformValue = ',platformValue);
  
  detailInfo.value.platformValue = platformValue
  emits('handleRunningJob', detailInfo)
  createMessage(new CreateMessageModel('success', t('message.startRunning')));

  if (res) {
    // setIsTaskRunning(true)
    emits('closeFilterSetting')
  }
}

const queryTaskDetail = async () => {  
  console.log('queryTaskDetail taskInfo = ',taskInfo);
  
  const res = await taskApi.detailTask(taskInfo?.value?.id)
  console.log(taskInfo.value.id, '查询任务详情', res)
  if (res?.id) {
    detailInfo.value = res
    // setTaskInfo(res)
    if (res?.resumeFilterMethod) {
      activeOneIndex.value = conditionOne.value.findIndex(item => item.type === res?.resumeFilterMethod)
    }
  }
}

</script>

<style scoped>
.count-input {
  flex: 1;
}

.in-input-text {
  opacity: 1;
}

.in-input-text-div :deep(.el-input-number) {
  width: 100%;
}

.in-input-text-div :deep(.el-input-number__decrease) {
  background: #2C2C2E;
  border: none !important;
  color: #81ff00;

}

.in-input-text-div :deep(.is-disabled) {
  color: #EBEBF51A;
}

.in-input-text-div :deep(.el-input-number__increase) {
  background: #2C2C2E;
  border: none !important;
  color: #81ff00;

}

.in-input-text-div :deep(.el-input__inner) {
  color: white;
}
</style>
