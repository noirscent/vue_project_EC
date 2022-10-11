import { reqCartList, reqDeleteCartItem, reqUpdateChecked } from '@/api'

export default {
    state: {
        cartList: [],
    },
    actions: {
        // 获取购物车列表数据
        async getCartList({ commit }) {
            let result = await reqCartList()
            if (result.code === 200) {
                // 保存数据到sessionsStorage中, 避免ShopCart刷新页面后渲染失败
                // sessionStorage.setItem('cartInfoList', JSON.stringify(result.data[0].cartInfoList))
                commit('GETCARTLIST', result.data)
                return result.message
            } else {
                return Promise.reject(new Error('获取购物车数据失败！'))
            }
        },
        // 删除购物车商品
        async deleteCartItem({ commit }, skuId) {
            let result = await reqDeleteCartItem(skuId)
            if (result.code === 200) {
                return result.message
            } else {
                return Promise.reject(new Error('删除购物车数据失败！'))
            }
        },
        // 修改商品选中状态
        async updateChecked({ commit }, { skuId, isChecked }) {
            let result = await reqUpdateChecked(skuId, isChecked)
            if (result.code === 200) {
                return result.message
            } else {
                return Promise.reject(new Error('修改商品选中状态失败！'))
            }
        },
        // 删除所有选中商品
        deleteAllCheckedItem({ dispatch, getters }) {
            let promiseAll = []
            getters.cartInfoList.forEach(item => {
                let result = item.isChecked === 1 ? dispatch('deleteCartItem', item.skuId) : ''
                promiseAll.push(result)
            });
            return Promise.all(promiseAll)
        },
        // 全选/全不选
        updateAllItemIsChecked({dispatch, getters}, isAllChecked) {
            let promiseAll = []
            getters.cartInfoList.forEach((item) => {
                // 让所有商品的选中状态与全选按钮一致
                promiseAll.push(dispatch('updateChecked', {skuId: item.skuId, isChecked: isAllChecked}))
            })
            return Promise.all(promiseAll)
        }
    },
    mutations: {
        GETCARTLIST(state, cartList) {
            state.cartList = cartList
        }
    },
    getters: {
        // 购物车列表数据简化版
        cartInfoList(state) {
            // 避免购物车列表为空时，出现undefined[0]的错误
            if (!state.cartList.length) {
                return []
            }
            return state.cartList[0].cartInfoList || { cartInfoList: [] }
        }
    }
}