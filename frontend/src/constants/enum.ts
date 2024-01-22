export enum TAB_STATUS_ENUM {
    COMPLETE = 'complete'
}

export enum ENUM_RESUME {
    PREVIEW = 'resume::preview'
}

export enum ENUM_PLATFORM {
    BOSS = 1,
    LIEPIN = 2,
}

export enum ENUM_HIRING_MODE {
    SEARCH_AND_FILTER = 1,  //自动搜索并筛选
    RECOMMEND_AND_CHAT = 2,  //系统推荐和沟通
    ONLY_CHAT = 3,  //仅沟通
    ONLY_FILTER = 4,  //仅筛选推荐页
}

export enum VisibilityStateEnum {
    HIDDEN = 'hidden',
    VISIBLE = 'visible'
}

export enum SendVerifyCodeTypeEnum {
    LOGIN = 1,
    REGISTER = 2
}

export enum ResumeStatusEnum {
    CHECKING = 0,
    SUITABLE = 1,
    UNSUITABLE = 2,
    ERROR = 3,

}

export const ResumeStatusProperties = {
    [ResumeStatusEnum.CHECKING]: {desc: '筛选中'},
    [ResumeStatusEnum.SUITABLE]: {desc: '合适'},
    [ResumeStatusEnum.UNSUITABLE]: {desc: '不合适'},
    [ResumeStatusEnum.ERROR]: {desc: '错误'}
}

export enum HiringChatMessageSenderTypeEnum {
    SYSTEM = 1,
    CANDIDATE = 2,
    HIRING = 3
}

export enum ResumeStatus {
    CHECKING = 0,
    SUITABLE = 1,
    UNSUITABLE = 2,
    ERROR = 3,
}

export enum ResumeFilterMethod {
    /**
     * 自动搜索并筛选候选人
     */
    AUTO_SEARCH_FILTER = 1,

    /**
     * 系统推荐和沟通
     */
    FILTER_AND_CHAT = 2,

    /**
     * 仅沟通
     */
    CHAT = 3,

    /**
     * 仅筛选推荐页
     */
    FILTER = 4,
}

export enum AgentTypeEnum {
    BOSS_RESUME_AGENT = "BossResumeAgent",
    BOSS_CHAT_AGENT = "BossChatAgent",
    LIEPIN_RESUME_AGENT = "LiepinResumeAgent",
    LIEPIN_CHAT_AGENT = "LiepinChatAgent",
    LIEPIN_CHAT_CHECK_RESUME_AGENT = "LiepinChatCheckResumeAgent",
}

export enum AgentStatusEnum {
    READY = "ready",
    RUNNING = "running",
    FINISH = "finish",
    ERROR = "error",
    CHECK_RESUME = 'check_resume'
}

/**
 * 流程状态
 */
export enum FlowStatusEnum {
    /**
     * 准备状态
     */
    READY = 0,

    /**
     * 运行状态
     */
    RUNNING = 1,

    /**
     * 挂起
     */
    SUSPEND = 2,

    /**
     * 完成
     */
    FINISHED = 3,

    /**
     * 筛选简历中
     */
    CHECKING_RESUME = 4,

    /**
     * 中断
     */
    INTERRUPT = 5,
}

const CACHE_PREFIX = "tshiring:";

export enum CacheKeyEnum {

    /**
     * 流程上下文 platform
     */
    FLOW_CONTEXT = CACHE_PREFIX + "%s:flow:context",

    /**
     * 筛选简历agent上下文 platform
     */
    CHECK_RESUME_AGENT_CONTEXT = CACHE_PREFIX + "%s:resume:flow:context",

    /**
     * 用户token
     */
    TOKEN = CACHE_PREFIX + 'Tshiring-Token',

    /**
     * 用户登录信息
     */
    LOGIN_USER_INFO = CACHE_PREFIX + 'user:info',

}

export enum GrantType {
    PHONE_VERIFY = 1,
    QR_CODE = 2,
}

export enum AgentCmdEnum {
    LOGIN_DIALOG = 'loginDialog',
    LOGIN_SUCCESS = 'loginSuccess',
    STATUS_CHANGE = 'agentStatusChange',
    TEST = 'test',
    START = 'startAgent',
    STOP = 'stopAgent',
    INPUT_VERIFY_CODE = 'loginInputVerifyCode',
    SEND_VERIFY_CODE = 'loginSendVerifyCode',
    MESSAGE_TOAST = 'messageToast',
    MESSAGE_DIALOG = 'messageDialog'
}
