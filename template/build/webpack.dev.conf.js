'use strict'
const merge             = require('webpack-merge')
const config            = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
    mode     : 'development',
    devtool  : '#cheap-module-eval-source-map',
    devServer: {
        clientLogLevel    : 'warning',
        historyApiFallback: {
            rewrites: config.dev.rewrites
        },
        overlay           : config.dev.errorOverlay
            ? {warnings: false, errors: true}
            : false,
        publicPath        : config.dev.assetsPublicPath,
        compress          : true,
        contentBase       : false, // since we use CopyWebpackPlugin.
        host              : process.env.HOST || config.dev.host,
        port              : process.env.PORT || config.dev.port,
        noInfo            : true,
        proxy             : config.dev.proxyTable,
        open              : config.dev.autoOpenBrowser,
        openPage          : '' // webpack-dev-server
    }
})

module.exports = devWebpackConfig