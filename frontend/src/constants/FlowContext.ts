import {AgentStatusEnum, CacheKeyEnum, ENUM_PLATFORM, FlowStatusEnum, ResumeFilterMethod} from "~/constants";
import {TaskInfo} from "~/api/Model";
// import {Pipeline} from "~components/pipeline/Pipeline";
// import {removeLoadScreen} from "~components/flowable/DomUtil";
// import {FlowExecutor} from "~components/flowable/FlowExecutor";
// import {platform} from "@floating-ui/dom";
// import util from "util";
// import {AbstractPipelineContext} from "~components/pipeline/context/AbstractPipelineContext";

export class FlowContext {

    /**
     * 运行次数
     * @private {number}
     */
    public runTimes: number = 1;

    /**
     * 简历筛选方式
     * @private {number}
     */
    public filterMethod: number = ResumeFilterMethod.FILTER_AND_CHAT;

    /**
     * 任务信息
     * @private {TaskInfo}
     */
    public taskInfo: TaskInfo;

    /**
     * 当前运行次数
     * @private {number}
     */
    public currentRunTimes: number = 0;

    /**
     * 状态
     * @see FlowStatusEnum
     * @private {number}
     */
    public status: number = FlowStatusEnum.READY;

    /**
     * 状态变更的原因
     */
    public statusReason: string;

    /**
     * 是否启动检查简历agent
     * @private {boolean}
     */
    public startCheckResumeAgent: boolean = false;

    /**
     * 运行平台
     * @private {ENUM_PLATFORM}
     */
    public platform: ENUM_PLATFORM;

    /**
     * 当前聊天会话ID
     * @private
     */
    public currentConversationId: string;

    /**
     * 标签唯一ID
     * 有值代表已经有标签页在处理流程
     * @private {string}
     */
    public uuid: string;

    public agentStatus: AgentStatusEnum;

    /**
     * 当前筛选方式
     */
    public currentFilterMethod: ResumeFilterMethod;

    public watchDogId: string;

    constructor(runTimes: number, filterMethod: number, taskInfo: TaskInfo, currentRunTimes: number, status: number,
                statusReason: string,
                startCheckResumeAgent: boolean, platform: ENUM_PLATFORM, currentConversationId: string, uuid: string,
                agentStatus: AgentStatusEnum, watchDogId: string, currentFilterMethod: ResumeFilterMethod) {
        this.runTimes = runTimes;
        this.filterMethod = filterMethod;
        this.taskInfo = taskInfo;
        this.currentRunTimes = currentRunTimes;
        this.status = status;
        this.statusReason = statusReason;
        this.startCheckResumeAgent = startCheckResumeAgent;
        this.platform = platform;
        this.currentConversationId = currentConversationId;
        this.uuid = uuid;
        this.agentStatus = agentStatus;
        this.watchDogId = watchDogId;
        this.currentFilterMethod = currentFilterMethod;
    }

    getRunTimes(): number {
        return this.runTimes;
    }

    getFilterMethod(): number {
        return this.filterMethod;
    }

    getTaskInfo(): TaskInfo {
        return this.taskInfo;
    }

    getPlatform(): ENUM_PLATFORM {
        return this.platform;
    }

    getCurrentRunTimes(): number {
        return this.currentRunTimes;
    }


    getStatus(): number {
        return this.status;
    }

    setStatus(status: number, statusReason: string = ''): void {
        this.status = status;
        this.statusReason = statusReason;
    }

    getAgentStatus() {
        return this.agentStatus;
    }

    setAgentStatus(agentStatus: AgentStatusEnum) {
        this.agentStatus = agentStatus;
    }

    getCurrentConversationId() {
        return this.currentConversationId;
    }

    setCurrentConversationId(conversationId: string) {
        this.currentConversationId = conversationId;
    }

    getStartCheckResumeAgent(): boolean {
        return this.startCheckResumeAgent;
    }

    setStartCheckResumeAgent(startCheckResumeAgent: boolean) {
        this.startCheckResumeAgent = startCheckResumeAgent;
    }

    getUuid(): string {
        return this.uuid;
    }

    setUuid(uuid: string) {
        this.uuid = uuid;
    }

    increaseCurrentRunTimes(): void {
        this.currentRunTimes++;
    }

    // async start(pipeline: Pipeline) {
    //     this.status = FlowStatusEnum.RUNNING;
    //     await super.start(pipeline);
    // }

    // async end() {
    //     await super.end();
    //     this.status = FlowStatusEnum.FINISHED;
    //     await FlowExecutor.setFlowContext(util.format(CacheKeyEnum.FLOW_CONTEXT, platform), this);
    //     removeLoadScreen();
    // }

    // getEndTime(): number {
    //     return this.endTime;
    // }

    // getStartTime(): number {
    //     return this.startTime;
    // }

}
