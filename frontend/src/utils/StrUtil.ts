export class StrUtil {

    static trim(str: string) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
}

