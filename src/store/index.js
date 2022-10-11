import Vue from 'vue'
import Vuex from 'vuex'

// 引入模块仓库
import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'
import user from './user'
import trade from './trade'

// 使用Vuex插件
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        home,
        search,
        detail,
        shopcart,
        user,
        trade,
    },
})