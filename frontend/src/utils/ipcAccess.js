import { ipc } from '~/utils/ipcRender'
import { ipcApiRoutes } from '~/constants/ipcApiRoutes'
import { reactive} from 'vue'
import { CreateMessageModel, createMessage } from '~/store/global'

class ipcAccessClient {
    constructor() {
        this.state = reactive({
            status: 0,
            progress: 0,
            percentNumber: 0,
            version: ''
        })
    }
    init() {
        const channel = 'app.updater';
        ipc.removeAllListeners(channel);
        ipc.on(channel, (event, result) => {
            result = JSON.parse(result);
            console.log('on::appUpdater', result)
            this.state.status = result.status;
            this.state.version = result.version;
            if (result.status == 3) {
                console.log('下载进度::%s', result.percentNumber, result)
                this.state.progress = result.desc;
                this.state.percentNumber = result.percentNumber;
            } else if(result.status === 4) {
                this.state.progress = result.desc;
                this.state.percentNumber = 100;
            }
            else {
                console.log('下载进度--else', result);
            }
        })
    }
    async checkForUpdater() {
        return await ipc.invoke(ipcApiRoutes.checkForUpdater)
    }

    async appUpdate() {
        if (this.state.status !== 1) {
            createMessage(new CreateMessageModel({
                type: 'warning',
                message: '没有可用版本'
            }))
            console.log('没有可用版本');
            return
        }
        return await ipc.invoke(ipcApiRoutes.appUpdate)
    }

    async closeMainWin() {
        return await ipc.invoke(ipcApiRoutes.closeMainWin)
        
    }

    openAlipayWin(data) {
        ipc.invoke(ipcApiRoutes.openAlipayWin, data)
    }

    closeAlipayWin() {
        ipc.invoke(ipcApiRoutes.closeAlipayWin)
    }

    on(channel, handle) {
        ipc.removeAllListeners(channel);
        ipc.on(channel, handle)
    }
}

const client = new ipcAccessClient()
export default client
