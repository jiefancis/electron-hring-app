import ws from './websocket'
import { ENUM_PLATFORM,ENUM_HIRING_MODE,AgentCmdEnum } from '~/constants/enum'
import { get } from "./axios";
import { ipc } from '~/utils/ipcRender.js'
import {ipcApiRoutes} from '~/constants/ipcApiRoutes.js'
import { createMessage,CreateMessageModel } from '~/store/global.ts'
import { isWindows } from '~/utils';

class AgentApi {
    constructor(){
        this.wsClient = null
    }

    public test() {
        this.wsClient.send({
            cmd: 'test',
            data: {
                verifyCode: '111'
            },
            needResponse: false
        })
    }
    public connectEngine(handleMessage:Function) {
        console.log('connectEngine');
        this.wsClient = new ws(handleMessage)
        
        this.wsClient.connect()
    }
    public async startEngine(){
        const res = await ipc.invoke(ipcApiRoutes.startEngine)
        console.log('startEngine = res ',res);

        return res
    }
    public async startAgent(platform:ENUM_PLATFORM, hiringMode:ENUM_HIRING_MODE, taskId:string) {
        // console.log('startAgent');
        
        const res = await this.wsClient.send({
            cmd: AgentCmdEnum.START,
            data: {
                "platform": platform,
                "hiringMode": hiringMode,
                "taskId": taskId
            },
            needResponse: true
        })

        return res
    }
    public stopAgent(agentId: string) {
        this.wsClient.send({
            cmd: 'stopAgent',
            data: {
                "agentId": agentId,
            },
            needResponse: false
        })
    }
    public loginInputVerifyCode(agentId:string, platform:ENUM_PLATFORM, verifyCode:string) {
        this.wsClient.send({
            cmd: 'loginInputVerifyCode',
            data: {
                "agentId": agentId,
                "platform": platform,
                "verifyCode": verifyCode
            },
            needResponse: false
        })
    }
    public loginSendVerifyCode(agentId:string, platform:ENUM_PLATFORM, phone:string) {
        this.wsClient.send({
            cmd: 'loginSendVerifyCode',
            data: {
                "agentId": agentId,
                "platform": platform,
                "phone": phone
            },
            needResponse: false
        })
    }
    public async engineUpdate(downloadUrl:string){
        const res = await ipc.invoke(ipcApiRoutes.engineUpdate,downloadUrl)
        console.log('engineUpdate res = ',res);
        
        return true
    }
    public async checkEngineVersion() {
        const localAgentVersion = await ipc.invoke(ipcApiRoutes.checkEngineVersion)
        
        console.log('localAgentVersion = ',localAgentVersion);
        try{
            const res = await get('/engine/info',{os: isWindows() ? 1 : 2})
            const serverAgentVersion = res.data.md5
            console.log('serverAgentVersion = ',serverAgentVersion);
            if(localAgentVersion!=serverAgentVersion){
                createMessage(new CreateMessageModel('warning', "引擎更新中"));
                try{
                    await this.engineUpdate(res.data.downloadUrl)
                    createMessage(new CreateMessageModel('success', "引擎启动成功"));
                    return true
                }catch(error){
                    return false
                }
            }else{
                createMessage(new CreateMessageModel('warning', "引擎启动中"));
                try{
                    const res = await this.startEngine()
                    console.log('agentApi checkEngineVersion start engine res = ',res);
                    
                    if(res == 'success'){
                        createMessage(new CreateMessageModel('success', "引擎启动成功"));
                    }else{
                        createMessage(new CreateMessageModel('error', "引擎启动失败"));
                    }
                    return true
                }catch(error){
                    console.log('checkEngineVersion startEngine error = ',error)
                    createMessage(new CreateMessageModel('error', "引擎启动失败"));
                    return false
                }
            }
        }catch(error){
            console.log('checkEngineVersion error = ',error);
            return false
        }
    }
}

export const agentApi = new AgentApi()