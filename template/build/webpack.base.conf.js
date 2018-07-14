'use strict'
const path    = require('path')
const config  = require('../config')
const webpack = require('webpack')
const utils   = require('./utils')

function resolve(dir) {
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
{{#less}}
const lessOptions = [...cssOptions, {
    loader : 'less-loader',
    options: {
        sourceMap: true
    }
}]
{{/less}}
{{#sass}}
const sassOptions = [...cssOptions, {
    loader : 'sass-loader',
    options: {
        sourceMap: true
    }
}]
{{/sass}}
const eachViewsResult = utils.eachViews(
    path.resolve(__dirname, '../src/views'),
    outputFilename => path.join('views', outputFilename),
    template => process.env.NODE_ENV === 'production'
        ? template : path.resolve(__dirname, '../src/app.html')
)

const baseWebpackConfig = {
    entry       : eachViewsResult.entries,
    output      : {
        path      : config.build.assetsRoot,
        filename  : 'js/[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath : config.dev.assetsPublicPath
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
            ...utils.generateModuleRules(process.env.NODE_ENV === 'production' ? config.build.staticPublicPath : ''),
            {
                test   : /\.vue$/,
                loader : 'vue-loader',
                options: {
                    loaders           : {
                        css    : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use     : cssOptions,
                            fallback: styleLoaderOptions
                        })),
                        {{#less}}
                        less   : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use     : lessOptions,
                            fallback: styleLoaderOptions
                        })),
                        {{/less}}
                        {{#sass}}
                        scss   : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use     : sassOptions,
                            fallback: styleLoaderOptions
                        })),
                        {{/sass}}
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
            {{#less}}
            {
                test: /\.less$/,
                use : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use     : lessOptions,
                    fallback: styleLoaderOptions
                }))
            },
            {{/less}}
            {{#sass}}
            {
                test: /\.scss$/,
                use : ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use     : sassOptions,
                    fallback: styleLoaderOptions
                }))
            },
            {{/sass}}
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
        new webpack.DefinePlugin({
            'process.env': process.env.NODE_ENV === 'production'
                ? config.build.env : config.dev.env
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        ...utils.extractStyle(),
        ...eachViewsResult.htmlWebpackPluginArray
    ]
}

module.exports = baseWebpackConfig
