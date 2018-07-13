'use strict'
const path              = require('path')
const webpack           = require('webpack')
const merge             = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const utils             = require('./utils')
const config            = require('../config')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const eachViewsResult = utils.eachViews(
    resolve(path.join('dist')),
    filename => resolve(path.join('dist', filename))
)

const prodWebpackConfig = merge(baseWebpackConfig, {
    mode   : 'production',
    entry  : eachViewsResult.entries,
    output : {
        publicPath: "",
        path      : resolve(path.join('dist')),
        filename  : 'js/[name].js'
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    module: {
        rules: utils.generateModuleRules('/static/')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/prod.env')
        }),
        new OptimizeCSSPlugin(),
        ...utils.extractStyle(),
        ...eachViewsResult.htmlWebpackPluginArray
    ]
})

module.exports = prodWebpackConfig