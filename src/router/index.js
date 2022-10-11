import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用插件
Vue.use(VueRouter)

// 引入路由配置信息
import routes from './routes'
// 引入store
import store from '@/store'

// 备份原来的push方法
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

// 重写push|replace方法
VueRouter.prototype.push = function (location, resolve = () => { }, reject = () => { }) {
    // 直接调用originPush时，this指向window，需要修改为VueRouter实例
    originPush.call(this, location, resolve, reject)
}

// 重写replace方法
VueRouter.prototype.replace = function (location) {
    return originReplace.call(this, location).catch(err => err)
}

let router = new VueRouter({
    routes,
    // 控制滚动行为
    scrollBehavior(to, from, savedPosition) {
        // 滚动到最上方
        return { y: 0 }
    }
})

// 配置全局路由守卫
router.beforeEach(async (to, from, next) => {
    let token = store.state.user.token
    let name = store.state.user.userInfo.loginName
    // 已登录
    if (token) {
        // 登录状态下阻止跳转到/login
        if (to.path === '/login') {
            next('/home')
        } else {
            // 登录状态下已经获取到用户信息
            if (name) {
                next()
                // 登录状态下未获取到用户信息
            } else {
                try {
                    await store.dispatch('getUserinfo')
                    next()
                } catch (error) {
                    // token失效无法获取用户信息
                    // 清除token
                    await store.dispatch('userLogout').then(() => { }).catch(() => { })
                    next('/login')
                }
            }
        }
        // 未登录
    } else {
        if (/\/pay|\/myorder|\/trade/.test(to.path)) {
            alert('请先登录！')
            // 记录用户之前想要跳转的页面，方便登录后直接跳转
            next('/login?redirect=' + to.path)
        } else {
            next()
        }
    }
})

// 配置路由
export default router