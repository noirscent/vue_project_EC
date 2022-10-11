// 对所有api接口进行统一管理

import requests from './ajax'
import mockRequests from './mockAjax'

// 三级联动接口
// /api/product/getBaseCategoryList GET 无参

export const reqCategoryList = () => {
    // 发送请求
    return requests({ url: '/product/getBaseCategoryList', method: 'GET' })
}

// 获取banner数据(Home首页轮播图)
export const reqBannerList = () => {
    return mockRequests.get('/banner')
}

// 获取floor数据
export const reqFloorList = () => {
    return mockRequests.get('/floor')
}

// 获取search模块数据
export const reqSearchInfo = (params) => {
    return requests({ url: '/list', method: 'POST', data: params })
}

// 获取detail模块数据
export const reqGoodsInfo = (skuId) => {
    return requests({ url: `/item/${skuId}`, method: 'GET' })
}

// 添加商品到购物车/更新购物车中商品个数
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'POST' })

// 获取购物车信息
export const reqCartList = () => requests({ url: '/cart/cartList', method: 'GET' })

// 删除购物车商品
export const reqDeleteCartItem = (skuId) => requests({ url: `/cart/deleteCart/${skuId}`, method: 'DELETE' })

// 修改商品选中状态
export const reqUpdateChecked = (skuId, isChecked) => requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: 'GET' })

// 获取验证码（阉割版功能）
export const reqGetCode = (phone) => requests({ url: `/user/passport/sendCode/${phone}`, method: 'GET' })

// 用户注册
export const reqUserRegister = (data) => requests({ url: '/user/passport/register', method: 'POST', data, })

// 用户登录
export const reqUserLogin = (data) => requests({ url: '/user/passport/login', method: 'POST', data })

// 获取用户登录信息(token验证)
export const reqUserInfo = () => requests({ url: '/user/passport/auth/getUserInfo', method: 'GET' })

// 退出登录(通知服务器销毁token)
export const reqUserLogout = () => requests({ url: '/user/passport/logout', method: 'GET' })

// 获取用户地址
export const reqUserAddress = () => requests({ url: '/user/userAddress/auth/findUserAddressList', method: 'GET' })

// 获取订单信息
export const reqOrderInfo = () => requests({ url: '/order/auth/trade', method: 'GET' })

// 提交订单信息
export const reqSubmitOrder = (tradeNo, data) => requests({ url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, data, method: 'POST' })

// 获取订单支付信息
export const reqPayInfo = (orderId) => requests({ url: `/payment/weixin/createNative/${orderId}`, method: 'GET' })

// 获取支付状态
export const reqPayStatus = (orderId) => requests({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: 'GET' })

// 获取个人中心数据
export const reqMyOrderList = (page, limit) => requests({ url: `/order/auth/${page}/${limit}`, method: 'GET' })


