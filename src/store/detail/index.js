import { reqGoodsInfo, reqAddOrUpdateShopCart } from '@/api'
import { getNanoidToken } from '@/utils/nanoid_token'

export default {
    state: {
        goodInfo: {},
        // 游客临时身份
        nanoid_token: getNanoidToken(),
    },
    actions: {
        async getGoodInfo({ commit }, skuId) {
            let result = await reqGoodsInfo(skuId)
            if (result.code === 200) {
                commit('GETGOODINFO', result.data)
            }
        },
        async addOrUpdateShopCart(conetxt, { skuId, skuNum }) {
            let result = await reqAddOrUpdateShopCart(skuId, skuNum)
            // 因为服务器并未返回数据，所以不需要向state中存储数据

            // 返回值是promise对象
            if (result.code === 200) {
                return result.message
            } else {
                return Promise.reject(new Error('加入购物车失败！'))
            }
        }
    },
    mutations: {
        GETGOODINFO(state, goodInfo) {
            state.goodInfo = goodInfo
        },
    },
    getters: {
        // 路径导航数据
        categoryView(state) {
            // 如果categoryView还未获取到，是undefined，在页面获取categoryView属性时（即获取undefined.属性），会报错，所以当categoryView是undefined时，应当返回空对象
            return state.goodInfo.categoryView || {}
        },
        // 商品信息
        skuInfo(state) {
            return state.goodInfo.skuInfo || {}
        },
        // 商品属性
        spuSaleAttrList(state) {
            return state.goodInfo.spuSaleAttrList || []
        }
    }
}