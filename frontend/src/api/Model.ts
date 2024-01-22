import {ENUM_PLATFORM} from "~constants";

/**
 * 任务信息
 */
export class TaskInfo {

    public id: number;

    public jobTitle: string;

    public jobRequirement: string;

    public sayHello: string;

    public resumeFilterMethod: number;

    public runTimes: number;

    constructor(id: number, jobTitle: string, jobRequirement: string, sayHello: string, resumeFilterMethod: number, runTimes: number) {
        this.id = id;
        this.jobTitle = jobTitle;
        this.jobRequirement = jobRequirement;
        this.sayHello = sayHello;
        this.resumeFilterMethod = resumeFilterMethod;
        // this.runTimes = runTimes;
    }
}

/**
 * GPT筛选简历结果
 */
export class GptCheckResumeResult {

    /**
     * 简历是否合格
     */
    public qualified: boolean;

    /**
     * 简历评分
     */
    public score: number;

    /**
     * 评判理由
     */
    public reason: string;

    /**
     * 简历摘要
     */
    public resumeSummary: string;


    constructor(qualified: boolean, score: number, reason: string, resumeSummary: string) {
        this.qualified = qualified;
        this.score = score;
        this.reason = reason;
        this.resumeSummary = resumeSummary;
    }
}

/**
 * GPT检查职位标题是否符合要求结果
 */
export class GptCheckJobTitleResult {

    /**
     * 职位标题是否合格
     */
    public qualified: boolean;
}

export class ResumeInfo {

    /**
     * 任务id
     */
    public taskId: number;

    /**
     * 候选人唯一ID
     */
    public geekId?: string;

    /**
     * 会话ID,如果是相同会话会覆盖数据
     */
    public conversationId?: string;

    /**
     * 招聘平台(1:boss直聘,2:猎聘)
     */
    public platform: number;

    /**
     * 评估分数
     */
    public score: number;

    /**
     * 简历状态(0:筛选中,1:合适,2:不合适,3:错误)
     */
    public status: number;

    /**
     * 候选人姓名
     */
    public candidateName: string;

    /**
     * 候选人手机号
     */
    public phone?: string;

    /**
     * 候选人微信号
     */
    public wechat?: string;

    /**
     * 应聘职位
     */
    public jobTitle: string;

    /**
     * 通过或淘汰的原因
     */
    public reason: string;

    /**
     * 简历摘要
     */
    public resumeSummary: string;

    /**
     * 简历文本URL
     */
    public resumeTextUrl: string;

    /**
     * 简历URL
     */
    public resumeImgUrl: string;


    constructor(taskId: number, geekId: string, conversationId: string, platform: number, score: number, status: number,
                candidateName: string, phone: string, wechat: string, jobTitle: string, reason: string, resumeSummary: string, resumeTextUrl: string, resumeImgUrl: string) {
        this.taskId = taskId;
        this.geekId = geekId;
        this.conversationId = conversationId;
        this.platform = platform;
        this.score = score;
        this.status = status;
        this.candidateName = candidateName;
        this.phone = phone;
        this.wechat = wechat;
        this.jobTitle = jobTitle;
        this.reason = reason;
        this.resumeSummary = resumeSummary;
        this.resumeTextUrl = resumeTextUrl;
        this.resumeImgUrl = resumeImgUrl;
    }
}


export class FileUploadAuthResult {

    /**
     * 服务器返回的文件名
     */
    public filename: string;

    /**
     * 上传地址
     */
    public uploadUrl: string;

    /**
     * 下载地址
     */
    public downloadUrl: string;
}

export class FileUploadInfo {
    public filename: string;
    public base64: string;

    constructor(filename: string, base64: string) {
        this.filename = filename;
        this.base64 = base64;
    }
}

export class HiringChatMessage {

    /**
     * 会话ID
     */
    public conversationId: string;

    /**
     * 招聘平台(1:boss直聘,2:猎聘)
     */
    public platform: number;

    /**
     * 消息项索引
     */
    public messageItemIndex: number;

    /**
     * 发送者类型(1:系统消息,2:候选人,3:招聘者)
     * @see HiringChatMessageSenderTypeEnum
     */
    public senderType: number;

    /**
     * 消息类型
     * @see HiringChatMessageTypeEnum
     */
    public messageType: number;

    /**
     * 消息内容
     */
    public message: string;

    constructor(conversationId: string, platform: number, messageItemIndex: number, senderType: number,
                messageType: number, message: string) {
        this.conversationId = conversationId;
        this.platform = platform;
        this.messageItemIndex = messageItemIndex;
        this.senderType = senderType;
        this.messageType = messageType;
        this.message = message;
    }

}

export class ResumeUpdateStatusReq {

    /**
     * 招聘平台(1:boss直聘,2:猎聘)
     */
    public platform: number;

    /**
     * 会话ID
     */
    public conversationId: string;

    /**
     * 简历状态(0:筛选中,1:合适,2:不合适,3:错误)
     */
    public status: number;

    constructor(platform: number, conversationId: string, status: number) {
        this.platform = platform;
        this.conversationId = conversationId;
        this.status = status;
    }
}

/**
 * 更新简历联系方式请求
 */
export class ResumeUpdateContactReq {

    /**
     * 招聘平台(1:boss直聘,2:猎聘)
     */
    public platform: number;

    /**
     * 会话ID
     */
    public conversationId: string;

    /**
     * 手机号
     */
    public phone: string;

    /**
     * 微信号
     */
    public wechat: string;

    constructor(platform: number, conversationId: string, phone: string, wechat: string) {
        this.platform = platform;
        this.conversationId = conversationId;
        this.phone = phone;
        this.wechat = wechat;
    }

}

/**
 * 更新简历附件请求
 */
export class ResumeUpdateAttachmentReq {
    /**
     * 招聘平台(1:boss直聘,2:猎聘)
     */
    public platform: number;

    /**
     * 会话ID
     */
    public conversationId: string;

    /**
     * 附件URL
     */
    public attachmentUrl: string;

    constructor(platform: number, conversationId: string, attachmentUrl: string) {
        this.platform = platform;
        this.conversationId = conversationId;
        this.attachmentUrl = attachmentUrl;
    }
}

/**
 * 根据geekId更新简历会话ID请求
 */
export class ResumeUpdateConversationIdByGeekIdReq {
    /**
     * 招聘平台(1:boss直聘,2:猎聘)
     */
    public platform: number;

    /**
     * 会话ID
     */
    public conversationId: string;

    /**
     * 任务ID
     */
    public taskId: number;
    public geekId: string;

    constructor(platform: number, conversationId: string, taskId: number, geekId: string) {
        this.platform = platform;
        this.conversationId = conversationId;
        this.taskId = taskId;
        this.geekId = geekId;
    }
}

/**
 * 获取简历状态请求
 */
export class ResumeGetStatusReq {

    /**
     * 招聘平台(1:boss直聘,2:猎聘)
     */
    public platform: number;

    /**
     * 会话ID
     */
    public conversationId: string;

    constructor(platform: number, conversationId: string) {
        this.platform = platform;
        this.conversationId = conversationId;
    }
}

/**
 * GPT检查职位标题是否符合要求请求
 */
export class GptCheckJobTitleReq {

    /**
     * 职位标题
     */
    public jobTitle: string;

    /**
     * 任务ID
     */
    public taskId: number;

    constructor(jobTitle: string, taskId: number) {
        this.jobTitle = jobTitle;
        this.taskId = taskId;
    }
}

/**
 * 保存所有照片聊天消息请求
 */
export class HiringMessageSaveAllReq {

    /**
     * 会话ID
     */
    public conversationId: string;

    /**
     * 招聘平台
     */
    public platform: ENUM_PLATFORM;

    /**
     * 消息
     */
    public messages: HiringChatMessage[];

    constructor(conversationId: string, platform: ENUM_PLATFORM, messages: HiringChatMessage[]) {
        this.conversationId = conversationId;
        this.platform = platform;
        this.messages = messages;
    }
}

/**
 * APP版本检查信息
 */
export class AppVersionCheckInfo {

    /**
     * 版本号
     */
    public appVersion: string;

    /**
     * 是否需要更新
     */
    public needUpdate: boolean;

    /**
     * 是否强制更新
     */
    public forceUpdate: boolean;

    /**
     * 更新链接
     */
    public updateUrl: string;

    /**
     * 发布时间
     */
    public releaseTime: string;

    constructor(appVersion: string, needUpdate: boolean, forceUpdate: boolean, updateUrl: string, releaseTime: string) {
        this.appVersion = appVersion;
        this.needUpdate = needUpdate;
        this.forceUpdate = forceUpdate;
        this.updateUrl = updateUrl;
        this.releaseTime = releaseTime;
    }
}
