'use strict'

const path = require('path')

module.exports = {
    dev  : {
        env: require('./dev.env'),

        assetsPublicPath: '/',                                 // 资源公共路径
        assetsRoot      : path.resolve(__dirname, '../src'),   // 资源输出目录

        // webpack-dev-server
        host           : 'localhost',                          // 可以被 process.env.HOST 覆盖
        port           : 8080,                                 // 可以被 process.env.PORT 覆盖
        proxyTable     : {},                                   // 代理配置
        rewrites       : [],                                   // 重写配置
        autoOpenBrowser: true,                                 // 自动打开浏览器
        openPage       : 'home/index',                         // 打开的页面
        errorOverlay   : true,                                 // 错误叠加
    },
    build: {
        env: require('./prod.env'),

        assetsPublicPath: '/',                                  // 资源公共路径
        assetsRoot      : path.resolve(__dirname, '../dist'),   // 资源输出目录

        assetsCommonsJsName: 'common',                          // 资源公共js名称
        staticPublicPath   : '',                                // 静态资源公共路径（font等）

        productionSourceMap: false,
    }
}