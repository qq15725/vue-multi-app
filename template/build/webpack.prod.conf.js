'use strict'

process.env.NODE_ENV = 'production'

const webpack           = require('webpack')
const merge             = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const config            = require('../config')

const prodWebpackConfig = merge(baseWebpackConfig, {
    mode   : 'production',
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.build.env
        }),
        new OptimizeCSSPlugin()
    ]
})

module.exports = prodWebpackConfig