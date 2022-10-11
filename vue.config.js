module.exports = {
    // 关闭eslint
    lintOnSave: false, 
    // 打包时不需要map文件
    productionSourceMap: false,
    // 配置代理
    devServer: {
        proxy: {
            '/api': {
                target: 'http://gmall-h5-api.atguigu.cn',
                // pathRewrite: { '^/api': '' },
                ws: true, // 用于支持websocket
                changeOrigin: true // 用于控制请求头中的host值
            }
        }
    }
}