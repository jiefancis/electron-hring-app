export class Cmd {
    static GPT_GET_BOSS_REPLY_MESSAGE = "getBossReplyMessage";
    static GPT_CHECK_RESUME = "checkResume";
    static DOM_CLICK = "domClick";
    static DOM_MOUSE_MOVE = "domMouseMove";
    static CLOSE_CURRENT_TAB = 'closeCurrentTab';
    static GPT_SHORTEN_SENTENCE = 'gptShortenSentence';
    static SERVER_SEND_VERIFY_CODE = 'serverSendVerifyCode';
    static SERVER_LOGIN = 'serverLogin';
    static SERVER_TASK_SAVE = 'serverTaskSave';
    static SERVER_TASK_LIST = 'serverTaskList';
    static SERVER_TASK_DETAIL = 'serverTaskDetail';
    static SERVER_SHORTEN_SENTENCE = 'serverShortenSentence';
    static SERVER_GENERATE_JOB_GROUP = 'serverGenerateJobGroup';
    static SERVER_GET_BOSS_REPLY_MESSAGE = 'serverGetBossReplyMessage';
    static SERVER_CHECK_RESUME = 'serverCheckResume';
    static SERVER_RESUME_SAVE = 'serverResumeSave';
    static SERVER_CHECK_JOB_TITLE = 'serverCheckJobTitle';
    static SERVER_FILE_UPLOAD = 'serverFileUpload';
    static SERVER_ADD_HIRING_MESSAGE = 'serverAddHiringMessage';
    static SERVER_SAVE_ALL_MESSAGE = 'serverSaveAllMessage';
    static SERVER_GET_HIRING_MESSAGES = 'serverGetHiringMessages';
    static SERVER_RESUME_UPDATE_STATUS = 'serverResumeUpdateStatus';
    static SERVER_RESUME_UPDATE_CONTACT = 'serverResumeUpdateContact';
    static SERVER_RESUME_GET_STATUS = 'serverResumeGetStatus';
    static SERVER_RESUME_UPDATE_ATTACHMENT = 'serverResumeUpdateAttachment';
    static SERVER_RESUME_UPDATE_CONVERSATION_ID_BY_GEEK_ID = 'serverResumeUpdateConversationIdByGeekId';
    static SERVER_TASK_DELETE = 'serverTaskDelete';
    static SERVER_GET_JOB_LABELS = 'serverJobLables';
    static SERVER_GET_RECORD_LIST = 'serverGetRecordList';

    static SERVER_GET_USERINFO = 'serverGetUserInfo';
    static SERVER_SAVE_USERINFO = 'serverSaveUserInfo';
    static SERVER_CHECK_APP_VERSION = 'serverCheckAppVersion';

    static CREATE_lIEPIN_WINDOW = 'createLPWindow';
    static LIEPIN_CHAT_FLOW_START = 'lpChatFlowStart';
    static UPDATE_STORAGE_USERINFO = 'updateStorageUserInfo';
    static GET_STORAGE_USERINFO = 'getStorageUserInfo';
    static TAB_CREATE = 'tabCreate';
    static TAB_CLOSE = 'tabClose';
    static TAB_SEND_MESSAGE = 'tabSendMessage';
    static TAB_SWITCH = 'tabSwitch';
    static TAB_CLOSE_ALL = 'tabCloseAll';
    static TAB_EXISTS = 'tabExists';
    static CREATE_MAIN_WINDOW = 'createMainWindow';
    static CLOSE_MAIN_WINDOW = 'closeMainWindow';
    static MW_AGENT_COMPLETED = 'mwAgentCompleted';
}

export class TabMsgCmd {
    /**
     * 聊天筛选简历
     */
    static CHAT_CHECK_RESUME = 'checkResume';

    /**
     * 候选人投递筛选简历
     */
    static DELIVER_CHECK_RESUME = 'deliverCheckResume';
}

export class ResponseMessage {

    public cmd: string;
    public data: any;

    constructor(cmd: string, data: any) {
        this.cmd = cmd;
        this.data = data;
    }

}

/**
 * 创建浏览器标签数据
 */
export class TabCreateData {

    public uuid: string;
    public uuidMutex: boolean;
    public originMutex: boolean;
    public urlPathMutex: boolean;
    public url: string;


    constructor(uuid: string, uuidMutex: boolean, originMutex: boolean, urlPathMutex: boolean, url: string) {
        this.uuid = uuid;
        this.uuidMutex = uuidMutex;
        this.originMutex = originMutex;
        this.urlPathMutex = urlPathMutex;
        this.url = url;
    }
}

/**
 * 标签发送消息数据
 * 优先使用uuid，如果uuid不存在则使用tabId
 */
export class TabSendMessageData {

    private cmd: string;

    public uuid: string;

    public tabId: number;

    public data: any;

    constructor(cmd: string, uuid: string, tabId: number, data: any) {
        this.cmd = cmd;
        this.uuid = uuid;
        this.tabId = tabId;
        this.data = data;
    }
}
