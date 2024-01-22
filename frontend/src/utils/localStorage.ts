import {STORE_LIEPIN_CURRENT_CONVERSACTIONID} from '~/constants';

export const storeActiveConversationId = (conversactionId) => localStorage.setItem(STORE_LIEPIN_CURRENT_CONVERSACTIONID, JSON.stringify(conversactionId))

export const getStoreActiveConversationId = () => {
    const id = localStorage.getItem(STORE_LIEPIN_CURRENT_CONVERSACTIONID)
    return id && JSON.parse(id)
}

export const storageGet = ( key:string) => {
    return localStorage.getItem(key)
}

export const storageSet = ( key: string, data: string) => {
    localStorage.setItem(key,data)
}

export const storageRemove = async (key) => {
    await localStorage.remove(key);
};

export const storageWatch = (options) => {
    
}
