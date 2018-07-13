'use strict'
const path              = require('path')
const merge             = require('webpack-merge')
const utils             = require('./utils')
const config            = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')
const chalk             = require('chalk')
const webpack           = require('webpack')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const eachViewsResult = utils.eachViews(
    resolve(path.join('src', 'views')),
    filename => {
        console.log(
            chalk.green(
                `Generate filename: ${filename} ` +
                'Run here: ' + chalk.blue.underline.bold('http://' + config.dev.host +  ':' + config.dev.port + '/' + filename)
            )
        )
        return filename
    },
    template => {
        return resolve(path.join('src', 'app.html'))
    }
)

console.log('\n')

const devWebpackConfig = merge(baseWebpackConfig, {
    mode     : 'development',
    entry    : eachViewsResult.entries,
    devtool  : config.dev.devtool,
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
        host              : config.dev.host,
        port              : config.dev.port,
        noInfo            : true,
        proxy             : config.dev.proxyTable,
        open              : config.dev.autoOpenBrowser,
        openPage          : 'webpack-dev-server'
    },
    module   : {
        rules: utils.generateModuleRules()
    },
    plugins  : [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        ...utils.extractStyle(),
        ...eachViewsResult.htmlWebpackPluginArray
    ]
})

module.exports = devWebpackConfig