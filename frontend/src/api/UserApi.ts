import {get, post} from "./axios";

class UserApi {
    private SUCCESS_CODE = 0

    // 获取用户信息
    public getUserInfo = async () => {
        return await get('/user/info');
    }

    // 保存用户信息
    public saveUserInfo = async (data) => {
        return await post('/user/info', data)
    }
}

const userApi = new UserApi();
export default userApi;
