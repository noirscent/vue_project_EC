import { reqUserAddress, reqOrderInfo } from '@/api'

export default {
    state: {
        userAddress: [],
        orderInfo: {},
    },
    actions: {
        async getUserAddress({commit}) {
            let result = await reqUserAddress()
            if (result.code === 200) {
                commit('GETUSERADDRESS', result.data)
                return result.message
            } else {
                return Promise.reject(result.message)
            }
        },
        async getOrderInfo({commit}) {
            let result = await reqOrderInfo()
            if (result.code === 200) {
                commit('GETORDERINFO', result.data)
                return result.message
            } else {
                return Promise.reject(result.message)
            }
        }
    },
    mutations: {
        GETUSERADDRESS(state, userAddress) {
            state.userAddress = userAddress
        },
        GETORDERINFO(state, orderInfo) {
            state.orderInfo = orderInfo
        },
    },
    getters: {},
}