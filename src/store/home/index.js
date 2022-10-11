// home模块仓库

import { reqCategoryList, reqBannerList, reqFloorList } from '@/api/'

export default {
    // state中的数据根据接口返回数据格式进行初始化
    state: {
        // 三级联动导航数据
        categoryList: [],
        // 轮播图ListContainer数据
        bannerList: [],
        // floor数据
        floorList: [],
    },
    actions: {
        async getCategoryList({ commit }) {
            let result = await reqCategoryList();
            if (result.code === 200) {
                commit('GETCATEGORYLIST', result.data)
            }
        },

        async getBannerList({ commit }) {
            let result = await reqBannerList()
            if (result.code === 200) {
                commit('GETBANNERLIST', result.data)
            }
        },

        async getFloorList({ commit }) {
            let result = await reqFloorList()
            if (result.code === 200) {
                commit('GETFLOORLIST', result.data)
            }
        },
    },
    mutations: {
        GETCATEGORYLIST(state, categoryList) {
            state.categoryList = categoryList
        },
        GETBANNERLIST(state, bannerList) {
            state.bannerList = bannerList
        },
        GETFLOORLIST(state, floorList) {
            state.floorList = floorList
        }
    },
    getters: {},
}