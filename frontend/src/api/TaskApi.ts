import {TaskInfo} from "./Model";
import {get, post} from "./axios";
import { ApiCodeEnum } from '~/constants/ApiCodeEnum'

class TaskApi {

    public queryJobLabels = async () => {
        return await get('/task/labels');
    }

    /**
     * 保存任务信息
     * @param task  任务信息
     */
    public saveTask = async (task: TaskInfo) => {
        const apiResult = await post('/task/save', task);
        if (apiResult.code !== ApiCodeEnum.OK) {
            throw new Error(apiResult.msg);
        }

        return apiResult
    }

    /**
     * 删除任务
     * @param id 任务id
     */
    public deleteTask = async (id: string) => {
        const apiResult = await get('/task/delete/' + id);
        if (apiResult.code !== ApiCodeEnum.OK) {
            throw new Error(apiResult.msg);
        }
        return apiResult;
    }


    /**
     * 获取任务列表
     */
    public getTasks = async (data: any) => {
        return await post('/task/list', data);
    }

    /**
     * 获取任务详情
     * @param id    任务id
     */
    public detailTask = async (id: string) => {
        const apiResult = await get('/task/detail/' + id);
        if (apiResult.code !== ApiCodeEnum.OK) {
            throw new Error(apiResult.msg);
        }
        return apiResult.data;
    }

}

export const taskApi = new TaskApi();
