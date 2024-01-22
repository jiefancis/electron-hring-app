import {STORE_RESUME_FLOW_FINISH_KEY} from '~/constants'
import {TaskInfo} from "~/api/Model";
import {Cmd, ResponseMessage} from "~/constants/MessageModel";
import { taskApi } from '~/api/TaskApi';

const JOB_INFO_KEY = 'agent.jobInfo';

export const getJobInfo = () => {
    return JSON.parse(localStorage.getItem(JOB_INFO_KEY));
}

export const setJobInfo = (jobInfo: any) => {
    localStorage.setItem(JOB_INFO_KEY, JSON.stringify(jobInfo))
}
export const getTaskInfoByServer = async (): Promise<TaskInfo> => {
    const page = await taskApi.getTasks({current: 1})
    return await taskApi.detailTask(page?.data?.records.length > 0 ? parseInt(page?.data?.records[0].id) : null)
}

export const setJobInfoToServer = async (taskInfo: TaskInfo) => {
    taskApi.saveTask(taskInfo)
}


// export const LPResumeFlowStatusInfo = {
//     setStore: (key, value) => {
//         localStorage.setItem(STORE_RESUME_FLOW_FINISH_KEY, JSON.stringify(isFinish))
//     }
// }

export const getLiepinResumeFlowStatus = () => {
    const status = localStorage.getItem(STORE_RESUME_FLOW_FINISH_KEY)
    return status ? JSON.parse(status) : false
}

export const setLiepinResumeFlowStatus = (isFinish: boolean) => {
    localStorage.setItem(STORE_RESUME_FLOW_FINISH_KEY, JSON.stringify(isFinish))
}

export const removeLiepinResumeFlowStatus = () => {
    localStorage.removeItem(STORE_RESUME_FLOW_FINISH_KEY)
}
