<template>
    <!-- v-to-drag="data.options" class="move-box-1" -->
  <div class="floating-window">
    <div ref="floatingWindow" class="move-box-window">
      <div class="window-header">
        <Button @click="handleCloseBtnClick" class="cancel-btn" :text="`${ $t('button.cancel')}`"/>
        <div @click="handleAgentStop" class="title">
          <label>{{ $t('job.editModalTitle') }}</label>
        </div>
        <Button class="save-btn"
                @click="handleSaveBtnClick"
                :disabled="saveBtnDisabled" :text="`${ $t('button.save')}`" font-color="#81FF00"/>
      </div>

      <div class="window-body">
        <Input class="p-in-input"
               :placeholder="`${$t('job.placeholder.job')}`"
               :label="`${$t('job.title.job')}`"
               :isRequire="true"
               v-model="data.jobTitle.value"
               input-height="44px"
               font-size="15px"
               :text-max-length="18"
        />
        <Input class="p-in-input"
              :placeholder="`${$t('job.placeholder.standard')}`"
               :label="`${$t('job.title.standard')}`"
               :isRequire="true"
               v-model="data.filterCriteria.value"
               input-type="textarea"
               :text-max-length="500"/>
        <Input class="p-in-input"
               :placeholder="`${$t('job.placeholder.greeting')}`"
               :label="`${$t('job.title.greeting')}`"
               :isRequire="true"
               v-model="data.sayHello.value"
               input-type="textarea"
               :text-max-length="500"/>
        <Input class="p-in-input"
               :placeholder="`${$t('job.placeholder.compAdvantage')}`"
               :label="`${$t('job.title.compAdvantage')}`"
               v-model="data.companyAdvantage.value"
               input-type="textarea"
               :text-max-length="500"/>
        <Input class="p-in-input"
               :placeholder="`${$t('job.placeholder.jobAdvantage')}`"
               :label="`${$t('job.title.jobAdvantage')}`"
               v-model="data.jobAdvantage.value"
               input-type="textarea"
               :text-max-length="500"/>
      </div>

      <Mask v-show="isShowModal">
          <div class="dashboard-logout-message">
              <div class="dashboard-logout-message-header">
                  <div class="dashboard-logout-message-header-title">{{ $t('job.modalQuitTitle') }}</div>
                  <div class="dashboard-logout-message-header-desc">{{ $t('job.modalQuitTips') }}</div>
              </div>
              <div class="dashboard-logout-message-bottom">
                  <div class="dashboard-logout-message-bottom-btn" @click="handleCancel">
                    {{ $t('button.quit') }}
                  </div>
                  <div class="dashboard-logout-message-bottom-btn btn-out" @click="handleEdit">
                    {{ $t('button.continue') }}
                  </div>
              </div>
          </div>
      </Mask>
    </div>
  </div>
  </template>

  <script setup lang="ts">
  import {ComponentInternalInstance,
    computed,
    getCurrentInstance,
    nextTick,
    onMounted,
    onUnmounted,
    ref, watch,
    defineEmits,
    inject,
  } from "vue";
  import Input from "~/components/input/Input.vue";
  import Button from "~/components/button/Button.vue";
  import Mask from '~/components/mask/index.vue'
  import {ElForm, ElFormItem} from "element-plus";
  import {themeColor} from "~/constants/GlobalVar";
  import {getJobInfo, setJobInfo} from "~/store/JobInfoStore.ts";
  import { taskApi } from "~/api/TaskApi";
  // import { isLiepinSite, isLiepinResumePage, } from '~/utils'
  import {STORE_LIEPIN_CHAT_FLOW_RUNING, GLOBAL_UPDATE_MESSAGE_KEY, AgentStatusEnum} from '~/constants'
  import {Cmd, ResponseMessage} from "~/constants/MessageModel";

  let currentInstance = getCurrentInstance() as ComponentInternalInstance;
  const props = defineProps({
    show: Boolean,
    changeWindowShow: Function,
    jobId: String,
    isShowWindow: Boolean,
  })

const emits = defineEmits(['refreshTaskList'])
const isShowModal = ref(false)

const updateMessage: Function = inject(GLOBAL_UPDATE_MESSAGE_KEY)


// watch(() => props.show, (newVal) => {
//   let floatingWindow: any = currentInstance.refs.floatingWindow;
//   if(newVal) {
//     floatingWindow.style.left = 'calc(75vw)';
//   } else {
//     floatingWindow.style.left = 'calc(100vw)';
//   }
// })
const queryTaskDetail = async () => {
  if(props.jobId === -1) return
  const res = await taskApi.detailTask(props.jobId)
  console.log('查看岗位详情', res)
  if(res.id) {
    return {
      ...res,
      filterCriteria: res?.jobRequirement
    }
  }
  return null
}

const startFlow = async () => {
  let jobInfo = props.jobId ? await queryTaskDetail() : {}; //getJobInfo();
  console.log('jobInfojobInfo', jobInfo)
  if (!jobInfo) {
    return;
  }
  data.jobTitle.value = jobInfo.jobTitle;
  data.filterCriteria.value = jobInfo.filterCriteria;
  data.sayHello.value = jobInfo.sayHello;
  data.companyAdvantage.value = jobInfo.companyAdvantage;
  data.jobAdvantage.value = jobInfo.jobAdvantage;
}

watch(() => props.isShowWindow, (newValue) => {
  console.log('floating-window--watch', newValue, props.jobId, props.isShowWindow)
  if(newValue){
    startFlow()
  }
})

const handleCancel = () => {
  isShowModal.value = false
  let changeWindowShowFunc = props.changeWindowShow as Function;
  changeWindowShowFunc(false);
}
const handleEdit = () => {
  isShowModal.value = false
}

onMounted(() => {
  startFlow()
});

  const handleToDragStart = () => {
  };

  const handleToDragMove = () => {
  }

  const handleCloseBtnClick = () => {
    isShowModal.value =true
  }

  const handleAgentStop = () => {
    chatAgent.stop();
  }

  const handleCreateTask = async () => {

    if(!data.jobTitle.value) {
      updateMessage?.({ type: 'warning', message: '请输入职位名称'})
      return
    }
    if(!data.filterCriteria.value) {
      updateMessage?.({ type: 'warning', message: '请输入筛选标准'})
      return
    }
    if(!data.sayHello.value) {
      updateMessage?.({ type: 'warning', message: '请输入打招呼话术'})
      return
    }

    const postData: any = {
      jobTitle: data.jobTitle.value,
      jobRequirement: data.filterCriteria.value,
      sayHello: data.sayHello.value,
      companyAdvantage: data.companyAdvantage.value,
      jobAdvantage: data.jobAdvantage.value
    }
    if(props.jobId && (+props.jobId !== -1)) {
      postData.id = props?.jobId
    }

    try{
      const res = await taskApi.saveTask(postData)
      console.log('saveTask res = ',res);
      handleCancel()
    }
    catch(error){
      console.error(error);
    }
  }

  const handleSaveBtnClick = () => {
    if(saveBtnDisabled.value) return
    setJobInfo({
      jobTitle: data.jobTitle.value,
      filterCriteria: data.filterCriteria.value,
      sayHello: data.sayHello.value,
      jobAdvantage: data.jobAdvantage.value,
      companyAdvantage: data.companyAdvantage.value
    })
    handleCreateTask()
    // handleCloseBtnClick()

    return
  }

  const data = {
    icon: {
      close: 'close',
    },
    jobTitle: ref(''),
    filterCriteria: ref(''),
    sayHello: ref(''),
    companyAdvantage: ref(''),
    jobAdvantage: ref(''),
    options: {
      moveCursor: false,
      adsorb: 2,
      // adsorbOffset: 10,
      adsorbOffset: 0,
      transitionDuration: 800,
      transitionTimingFunction: 'cubic-bezier(0.34, -0.37, 0.73, 1.38)'
    },
    handleToDragStart,
    handleToDragMove,
    handleCloseBtnClick

  };

  const saveBtnDisabled = computed(() => {
    return data.jobTitle.value === '' || data.filterCriteria.value === '' || data.sayHello.value === '';
  });

  computed(() => {
    return {
      '--in-theme-color': themeColor,
    }
  })

  </script>

<style lang="less" scoped>
.move-box {
    position: fixed;
    bottom: 80px;
    right: 50px;
    width: 80px;
    height: 80px;
    border-radius: 55px;
    box-shadow: 0 0 15px rgb(43, 58, 73);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
    user-select: none;
    overflow: hidden;

    .content-icon {
        width: 100%;
        height: 100%;
    }
}

.move-box-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
}

.move-box-window,
.move-box-1 {
    /* position: fixed; */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* width: 375px; */
    border-radius: 16px;
    box-shadow: 0 0 10px rgb(43, 58, 73);
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #fff;
    background: #2C2C2E;
    user-select: none;
    --in-theme-color: var(--in-theme-color);

    /*覆盖掉注入网站的css*/
    box-sizing: initial !important;
    line-height: 1 !important;
    /* display: block !important; */
    margin-bottom: 0 !important;


    .cancel-btn {
        position: absolute;
        left: 20px;
        display: inline-block;
        font-size: 15px;
    }

    .title {
        position: absolute;
        display: inline-block;
        font-size: 15px;
        /* left: 144px; */
        left: 234px;
    }

    .save-btn {
        position: absolute;
        display: inline-block;
        font-size: 15px;
        /* left: 326px; */
        right: 20px;
        cursor: pointer;
    }
}

.floating-window {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

.move-box-window {
    z-index: 100;
    width: 550px;
    /* height: 450px; */
    padding-bottom: 10px;
    overflow-x: hidden;
    overflow-y: scroll;
    max-height: 100%;
}

.window-header {
    position: relative;
    /* width: 100%; */
    height: 44px;
    top: 6px;
    display: border-box;

    padding-top: 12px;
    padding-left: 20px;
    padding-right: 20px;

}

.window-body {
    overflow-y: auto;
}

.p-in-input {
    margin-top: 4px;
}

.show-active {
    opacity: 1;
}

.show {
    opacity: 0;
    transition: opacity 0.5s;
}


.in-input {
    margin: 16px 16px 16px 16px;
    position: relative;


    .in-input-label {
        display: flex;
        font-size: 15px;
        text-align: left;
    }

    .tooltip-wrapper {
        position: relative;
        margin-left: 5px;
    }

    .tooltip {
        position: absolute;
        background: #fff;
        border-radius: 4px;
        color: #000;
        font-size: 12px;
        text-align: center;
        line-height: ;
        width: 190px;
        padding: 4px;
        top: -30px;
        left: 0;
    }

}


.fade-leave,
.fade-enter-to {
    opacity: 1;
}

.fade-leave-active,
.fade-enter-active {
    transition: all 1.5s;
}

.fade-leave-to,
.fade-enter {
    opacity: 0;
}


.abs-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.abs-top {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}

.no-border {
    border: none !important;
}

.margin-top-16 {
    margin-top: 16px;
}

.margin-top-40 {
    margin-top: 40px;
}
</style>