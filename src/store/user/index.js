import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqUserLogout } from '@/api'
import { setToken, getToken, removeToken } from '@/utils/token'

export default {
    state: {
        code: '',
        token: getToken(),
        userInfo: {},
    },
    actions: {
        // 获取验证码
        async getCode({ commit }, phone) {
            let result = await reqGetCode(phone)
            if (result.code === 200) {
                commit('GETCODE', result.data)
                return '获取验证码成功'
            } else {
                return Promise.reject('获取验证码失败！')
            }
        },

        // 注册
        async userRegister(context, user) {
            let result = await reqUserRegister(user)
            if (result.code === 200) {
                return result.message
            } else {
                return Promise.reject(result.message)
            }
        },

        // 登录
        async userLogin({ commit }, user) {
            let result = await reqUserLogin(user)
            if (result.code === 200) {
                // token持久化存储
                setToken(result.data.token)
                commit('USERLOGIN', result.data.token)
                return '登录成功！'
            } else {
                return Promise.reject(result.message)
            }
        },

        // 获取用户信息(携带token验证)
        async getUserinfo({ commit }) {
            let result = await reqUserInfo()
            if (result.code === 200) {
                commit('GETUSERINFO', result.data)
            } else {
                return Promise.reject(result.message)
            }
        },

        // 退出登录
        async userLogout({ commit }) {
            let result = await reqUserLogout()
            if (result.code === 200) {
                commit('USERLOGOUT')
                return result.message
            } else {
                return Promise.reject(result.message)
            }
        }
    },
    mutations: {
        GETCODE(state, code) {
            state.code = code
        },
        USERLOGIN(state, token) {
            state.token = token
        },
        GETUSERINFO(state, userInfo) {
            state.userInfo = userInfo
        },
        USERLOGOUT(state) {
            // 清除仓库中的数据
            state.userInfo = {}
            state.token = ''
            // 清除本地存储的token
            removeToken()
        }
    },
    getters: {

    }
}