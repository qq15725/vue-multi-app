'use strict'
const path = require('path')
const config  = require('../config')
const webpack = require('webpack')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const styleLoaderOptions = {
    loader : 'style-loader',
    options: {
        sourceMap: true
    }
}

const cssOptions = [
    {loader: 'css-loader', options: {sourceMap: true}},
    {loader: 'postcss-loader', options: {sourceMap: true}}
]

const lessOptions = [...cssOptions, {
    loader : 'less-loader',
    options: {
        sourceMap: true
    }
}]

const sassOptions = [...cssOptions, {
    loader : 'sass-loader',
    options: {
        sourceMap: true
    }
}]

const baseWebpackConfig = {
    output      : {
        path      : config.build.assetsRoot,
        filename  : '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve     : {
        extensions: ['.js', '.vue'],
        alias     : {
            'vue$': 'vue/dist/vue.esm.js',
            '@'   : resolve('src')
        }
    },
    module      : {
        rules: [
            {
                test   : /\.vue$/,
                loader : 'vue-loader',
                options: {
                    loaders           : {
                        css    : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use     : cssOptions,
                            fallback: styleLoaderOptions
                        })),
                        less   : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use     : lessOptions,
                            fallback: styleLoaderOptions
                        })),
                        scss   : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use     : sassOptions,
                            fallback: styleLoaderOptions
                        })),
                        postcss: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use     : cssOptions,
                            fallback: styleLoaderOptions
                        }))
                    },
                    cssSourceMap      : true,
                    cacheBusting      : false,
                    transformToRequire: {
                        video : ['src', 'poster'],
                        source: 'src',
                        img   : 'src',
                        image : 'xlink:href'
                    }
                }
            },
            {
                test   : /\.js$/,
                use    : 'babel-loader',
                include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.css$/,
                use : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use     : cssOptions,
                    fallback: styleLoaderOptions
                }))
            },
            {
                test: /\.less$/,
                use : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use     : lessOptions,
                    fallback: styleLoaderOptions
                }))
            },
            {
                test: /\.scss$/,
                use : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use     : sassOptions,
                    fallback: styleLoaderOptions
                }))
            },
            {
                test: /\.html$/,
                use : [{
                    loader : 'html-loader',
                    options: {
                        root : resolve('src'),
                        attrs: ['img:src', 'link:href']
                    }
                }]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks   : 'initial',
                    minChunks: 3,
                    name     : config.commonsName,
                    enforce  : true
                }
            }
        }
    },
    performance : {
        hints: false
    },
    plugins     : [
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
}
module.exports          = baseWebpackConfig
