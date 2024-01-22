import {post} from "./axios";
import {CacheKeyEnum, SendVerifyCodeTypeEnum} from "~/constants";
import {ApiCodeEnum} from "~/constants/ApiCodeEnum";
import {storageSet} from "~/utils";

class AuthApi {

    /**
     * 发送验证码
     * @param phone 手机号
     */

    public sendVerifyCode = async (phone: string) => {
        return await post('/auth/sendVerifyCode', {
            type: SendVerifyCodeTypeEnum.LOGIN,
            phone: phone
        });
    }
    /**
     * 登录
     * @param phone     手机号
     * @param verifyCode    验证码
     */
    public login = async (phone: string, verifyCode: string) => {

        let apiResult = await post('/auth/login', {
            phone: phone,
            verifyCode: verifyCode
        });
        if (apiResult?.code === ApiCodeEnum.OK) {
            // 保存 token
            storageSet(CacheKeyEnum.TOKEN, apiResult.data.token);
            // 保存用户登录信息
            storageSet(CacheKeyEnum.LOGIN_USER_INFO, apiResult.data);
        }
        return apiResult;
    }
}

export const authApi = new AuthApi();
