<template>
  <router-view/>
  <Message v-bind="messageInfo" @handleClick="handleClick" v-if="isShowMessage"/>
  <Progress :percentage="percentage" v-if="percentage"/>
  <!-- <Login></Login> -->
</template>

<script>
import { onMounted } from 'vue'
import { ipc } from '~/utils/ipcRender.js'
import {ipcApiRoutes} from '~/constants/ipcApiRoutes.js'
import {versionApi} from '~/api/VersionApi.ts'
import ipcAccess from '~/utils/ipcAccess'
import Message from '~/components/message/index.vue'
import Progress from '~/components/progress/index.vue'

const CUTDOWN = 60000;
export default {
  name: 'App',
  components: {
    Message,
    Progress,
  },
  setup() {
    document.getElementById('loadingPage').remove()

    const isShowMessage = ref(false)
    const messageInfo = reactive({
      type: 'warning',
      message: '有新版本可更新',
      isClick: true,
      duration: CUTDOWN,
    })
    const percentage = ref(0)

    onMounted(async () =>{
      ipcAccess.init()
      const res = await ipcAccess.checkForUpdater()
      console.log('校验更新', res)
      watch(() => ipcAccess.state.status, (newVal) => {
        console.log('状态变化', newVal, ipcAccess.state.version)
        if(newVal === 1) {
          messageInfo.message = `有新版本${ipcAccess.state.version}可更新`
          isShowMessage.value = true;
          setTimeout(() => {
            isShowMessage.value = false;
          }, CUTDOWN)
        }
      })

      watch(() => ipcAccess.state.percentNumber, (newVal) => {
        const val = parseInt(newVal)
        percentage.value = val
        if(val === 100) {
          // ipcAccess.closeMainWin()
        }
      })
      // const res = await versionApi.checkAppVersion()
      // console.log('current app version = ',res);
      // console.log("ipcApiRoutes.test = ",ipcApiRoutes.test);
      // ipc.invoke(ipcApiRoutes.appUpdate)
      // const res = await ipc.invoke(ipcApiRoutes.test)
      // console.log("res123 = ",res);
      // ipc.on('app.updater',(event,result)=>{
      //   console.log("event = ",event);
      //   console.log("result = ",result);
      // })
    })

    const handleClick = async () => {
      try {
        isShowMessage.value = false;
        const res = await ipcAccess.appUpdate()
      } catch(error) {
        console.log('更新出错', error)
      }
      
    }

    return {
      isShowMessage,
      messageInfo,
      handleClick,
      percentage,
    }
  }
}
</script>
<style lang="less">
@--color-primary: '#81FF00';
@import "~/assets/css/Floating-css.css";
@import "~/assets/css/dashboard.css";
@import "~/assets/css/element.css";
</style>
