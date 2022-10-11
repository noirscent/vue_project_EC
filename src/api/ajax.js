// 对axois进行二次封装

import axios from 'axios'
// 引入进度条
import nProgress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// 引入store
import store from '@/store'

// 创建axios实例
const requests = axios.create({
    baseURL: "/api", // 基础路径
    timeout: 5000 // 请求超时时间
});

// 请求拦截器
requests.interceptors.request.use((config) => {
    if (store.state.detail.nanoid_token) {
        // 向请求头添加字段 userTempId (需要后端配合)
        config.headers.userTempId = store.state.detail.nanoid_token
    }

    // 向请求头添加字段 token(需要后端配合)
    if (store.state.user.token) {
        config.headers.token = store.state.user.token
    }

    // 进度条开始
    nProgress.start()
    return config
})

// 响应拦截器
requests.interceptors.response.use((res) => {
    // 响应成功的回调函数
    // 进度条结束
    nProgress.done()
    return res.data
}, (error) => {
    // 响应失败的回调函数
    return Promise.reject(new Error('false'))
})

// 导出
export default requests