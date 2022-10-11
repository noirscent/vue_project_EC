import Vue from 'vue'
import App from '@/App.vue'

// 三级联动组件
import TypeNav from '@/components/TypeNav'
// 轮播图组件
import Carousel from '@/components/Carousel'
// 分页器组件
import Pagination from '@/components/Pagination'
// elementUI组件
import { MessageBox } from 'element-ui'

// 注册全局组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)

// 将elementUI组件挂载到原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

// 引入路由
import router from '@/router'
// 引入仓库
import store from '@/store'
// 引入mockServe.js
import '@/mock/mockServe'
// 引入swiper样式
import 'swiper/css/swiper.css'
// 引入字体图标样式
import '@/assets/iconfont/iconfont.css'
// 引入api下的全部请求函数
import * as API from '@/api'

// 懒加载插件
import VueLazyload from 'vue-lazyload'
// 图片加载中/失败图片
import loadImage from '@/assets/load.gif'
// 表单校验插件
import '@/plugins/validate.js'

// 注册插件
Vue.use(VueLazyload, {
  // 懒加载默认图片
  loading: loadImage,
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
  // 配置全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },
  // 注册路由，注册后所有组件都有$route、$router属性
  router,
  // 注册仓库，注册后所有组件都有$store属性
  store,
})
