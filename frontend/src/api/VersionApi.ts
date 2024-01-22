import {AppVersionCheckInfo} from "~/api/Model";

class VersionApi {

    /**
     * 检查版本
     */
    public async checkAppVersion() {
        return await ipc.invoke(ipcApiRoutes.checkVersion);
    }
}

export const versionApi = new VersionApi();
