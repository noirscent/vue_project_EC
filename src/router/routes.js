// 路由配置信息
export default [
    {
        name: 'home',
        path: '/home',
        component: () => import('@/pages/Home'),
        meta: { isShowFooter: true },
    },
    {
        name: 'search',
        path: '/search/:keyword?',
        component: () => import('@/pages/Search'),
        meta: { isShowFooter: true },
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/pages/Login'),
        meta: { isShowFooter: false },
    },
    {
        name: 'register',
        path: '/register',
        component: () => import('@/pages/Register'),
        meta: { isShowFooter: false },
    },
    {
        name: 'detail',
        path: '/detail/:skuId',
        component: () => import('@/pages/Detail'),
        meta: { isShowFooter: true }
    },
    {
        name: 'addcartsuccess',
        path: '/addcartsuccess',
        component: () => import('@/pages/AddCartSuccess'),
        meta: { isShowFooter: true }
    },
    {
        name: 'shopcart',
        path: '/shopcart',
        component: () => import('@/pages/ShopCart'),
        meta: { isShowFooter: true }
    },
    {
        name: 'trade',
        path: '/trade',
        component: () => import('@/pages/Trade'),
        meta: { isShowFooter: true },
        // 路由独享守卫
        beforeEnter(to, from, next) {
            // 必须从购物车页面才能跳转到交易页面
            if (from.path === '/shopcart') {
                next()
            } else {
                // 打断当前路由跳转，停留在当前页面，将url重置到from路由对应的地址
                next(false)
            }

        },
    },
    {
        name: 'pay',
        path: '/pay',
        component: () => import('@/pages/Pay'),
        meta: { isShowFooter: true },
        beforeEnter(to, from, next) {
            // 只能从交易页面跳转到支付页面
            if (from.path === '/trade') {
                next()
            } else {
                next(false)
            }
        },
    },
    {
        name: 'paysuccess',
        path: '/paysuccess',
        component: () => import('@/pages/PaySuccess'),
        meta: { isShowFooter: true },
        beforeEnter(to, from, next) {
            // 只能从交易页面跳转到支付页面
            if (from.path === '/pay') {
                next()
            } else {
                next(false)
            }
        },
    },
    {
        name: 'center',
        path: '/center',
        component: () => import('@/pages/Center'),
        meta: { isShowFooter: true },
        // 二级路由
        children: [
            {
                path: 'myorder',
                component: () => import('@/pages/Center/MyOrder'),
            },
            {
                path: 'gruoporder',
                component: () => import('@/pages/Center/GroupOrder'),
            },
            // 重定向，访问/center默认显示MyOrder
            {
                path: '/',
                redirect: '/center/myorder'
            },
        ]
    },
    // 重定向：访问/，能定向到首页
    {
        path: '*',
        redirect: '/home'
    }
]