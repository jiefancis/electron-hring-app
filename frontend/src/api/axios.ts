// axios.js
import axios from 'axios';
import {CacheKeyEnum} from "~/constants/index.ts";
import { storageGet } from '../utils';
import {ApiCodeEnum} from "../constants/ApiCodeEnum"
import i18nInstance from '~/i18n'
import { CreateMessageModel, createMessage } from '~/store/global';
import router from '~/router'
// import { useI18n } from 'vue-i18n'
// const { locale } = useI18n({ useScope: 'global' })

console.log('import.meta.env = ',import.meta.env);

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_HTTP_URL, // API 的 base_url
  timeout: 60*1000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const locale = i18nInstance?.global.locale?.value;
    config.headers['authorization'] = 'Bearer ' + getToken();
    
    // config.headers['Tshiring-Token'] = getToken();
    config.headers.lang = locale === 'cn' ? 'zh_CN' : 'en_US';

    const prefix = [
      '/payment-service',
      '/member-service',
    ];
    if(prefix.some(url => config.url.startsWith(url))) {
      config.headers['ts-app-name'] = 'hiring'
      config.url = `${import.meta.env.VITE_MEMBER_HTTP_URL}${config.url}`
    }
    return config;
  },
  error => {
    // 处理请求错误
    console.error('请求出错：', error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    console.log('响应拦截', response)
    switch (response.data.code) {
      case ApiCodeEnum.ERROR:
      case ApiCodeEnum.UNAUTHORIZED:
        createMessage(new CreateMessageModel('warning', response?.data.msg))
        break;
    }
    return response.data;
  },
  error => {
    console.error('响应出错：', error, error.response?.status === ApiCodeEnum.INVALIDTOKEN ||
    error.response?.data?.code === ApiCodeEnum.INVALIDTOKEN,
    
    );
    if(error.response?.status === ApiCodeEnum.INVALIDTOKEN ||
      error.response?.data?.code === ApiCodeEnum.INVALIDTOKEN  
    ) {
      createMessage(new CreateMessageModel('warning', error.response?.data?.msg))
      console.log("接口token失效")
      router.push('/Login')
    }
    return Promise.reject(error);
  }
);

const getToken = () => {
    return storageGet(CacheKeyEnum.TOKEN)
}

// 封装get方法
export const get = async (url:string, params:any={}) => {
    return await service.get(url, {
        params
    });
}
  
  // 封装post方法
export const post = async (url:string, data:any={}) => {
    return await service.post(url, data);
}

export interface ApiResult<T> {
  code: number;
  msg: string;
  data: T;
}
  
export default service;
