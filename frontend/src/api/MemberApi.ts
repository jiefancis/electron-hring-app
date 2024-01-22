import service, {post, get} from "./axios";

class MemberApi {

    async querySubscriptionsInfo() {
        return await get(`/member/info`)
    }

    // async queryExpired() {
    //     return await get('/member-service/member/subscriptions/expired');
    // }

    // async queryMemberInfo() {
    //     return await get('/member-service/member/subscriptions/member-info');
    // }

    async queryGoodList() {
        return await get('/payment-service/payment/products/list');
    }
    
    async createOrder(data) {
        return await post('/payment-service/payment/orders', data)
    }

    async updateOrderStatus(orderId) {
        return await service({
            method: 'PUT',
            url: `/payment-service/payment/orders/${orderId}`
        })
    }
    async queryOrderStatus(orderId) {
        return await get(`/payment-service/payment/orders/${orderId}`)
    }

    async payOrder(data) {
        return await post(`/payment-service/ali-pay/submitPayOrder-pc`, data)
    }
}

export const memberApi = new MemberApi()
export enum OrderStatusEnum {
    PENDING = 0,
    SUCCESS = 1,
    FAIL = 2,
    TIMEOUT = 3,
    PAYING = 4,
}