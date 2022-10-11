// search模块仓库

import { reqSearchInfo } from '@/api'

export default {
    state: {
        searchList: {},
    },
    actions: {
        // 获取search模块数据
        async getSearchList({ commit }, params = {}) {
            let result = await reqSearchInfo(params)
            if (result.code === 200) {
                commit('GETSEARCHLIST', result.data)
            }
            
        }
    },
    mutations: {
        GETSEARCHLIST(state, searchList) {
            state.searchList = searchList
        }
    },
    getters: {
        // 形参state是search仓库state
        goodsList(state) {
            // 网络不良时应返回一个空数组
            return state.searchList.goodsList || []
        },
        trademarkList(state) {
            return state.searchList.trademarkList || []
        },
        attrsList(state) {
            return state.searchList.attrsList || []
        }
    },
}