// export * from '~/utils/is'
// export { default as Message }  from '~/utils/message'
export { default as CreateLoading } from '~/utils/loading'
export * from '~/utils/localStorage'

export const sleep = async (time) => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

export function isWindows() {
    const platform = navigator.platform.toLowerCase();

    if (platform.includes('win')) {
        return true;
    }
    if (platform.includes('mac')) {
        return false;
    }
    // 可以继续添加其他平台的检测，如 Linux 等
    return false;
}