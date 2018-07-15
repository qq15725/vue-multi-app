const config            = require('../config')
const path              = require('path')
const glob              = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const fs                = require('fs')
const chalk             = require('chalk')

exports.assetsPath = function (_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
}

exports.getModule = function (entry) {
    entry = entry.split('/').filter(dir => ['.', 'src', 'views'].indexOf(dir) === -1)
    entry[entry.length - 1] = path.basename(entry[entry.length - 1], path.extname(entry[entry.length - 1]))
    return entry.join('/')
}

exports.getChunk = function (entry) {
    return '_' + exports.getModule(entry).replace(/\//g, '_')
}

exports.getEntries = function (globPath) {
    let entries = {}
    glob.sync(globPath).forEach(function (entry) {
        entry = entry.replace(/\\/g, '/')
        entries[exports.getChunk(entry)] = entry
    })
    return entries
}

exports.getHtmlWebpackPluginArray = function (entries) {
    return entries.map(function (entry) {
        let module = exports.getModule(entry)
        let filename = process.env.NODE_ENV === 'production'
            ? path.join(config.build.assetsRoot, `${module}.htm`) : module
        let template = process.env.NODE_ENV === 'production'
            ? path.join(config.dev.assetsRoot, 'views', `${module}.ejs`) : path.join(config.dev.assetsRoot, 'app.html')
        if (!fs.existsSync(template)) {
            template = path.join(config.dev.assetsRoot, 'app.ejs')
        }

        console.log(chalk.green(`Generate filename: ${filename}`))
        if (process.env.NODE_ENV !== 'production') {
            console.log(chalk.green(
                'Run here: ' +
                chalk.blue.underline.bold(
                    'http://' + config.dev.host + ':' + config.dev.port + '/' + filename
                )
            ))
        }
        console.log(chalk.green(`Use template: ${template}`))

        return new HtmlWebpackPlugin({
            filename: filename,
            template: template,
            inject  : template.indexOf('.ejs') > -1 ? false : 'body',
            chunks  : [config.build.assetsCommonsJsName, exports.getChunk(entry)]
        })
    })
}

exports.extractStyle = function () {
    const filename = 'css/[name].css'

    const extractCSS = new ExtractTextPlugin({
        filename : filename,
        allChunks: true
    })

    {{#less}}
    const extractLESS = new ExtractTextPlugin({
        filename : filename,
        allChunks: true
    })
    {{/less}}
    {{#sass}}
    const extractSASS = new ExtractTextPlugin({
        filename : filename,
        allChunks: true
    })
    {{/sass}}
    return [
        {{#less}}
        extractLESS,
        {{/less}}
        {{#sass}}
        extractSASS,
        {{/sass}}
        extractCSS
    ]
}

exports.generateModuleRules = function (publicPath = null) {
    return [
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            use : [{
                loader : 'url-loader',
                options: Object.assign({}, {
                    limit: 10000,
                    name : 'img/[name].[ext]'
                }, publicPath ? {publicPath} : {})
            }]
        },
        {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            use : [{
                loader : 'url-loader',
                options: Object.assign({}, {
                    limit: 10000,
                    name : 'media/[name].[ext]'
                }, publicPath ? {publicPath} : {})
            }]
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            use : [{
                loader : 'url-loader',
                options: Object.assign({}, {
                    limit: 10000,
                    name : 'fonts/[name].[ext]'
                }, publicPath ? {publicPath} : {})
            }]
        }
    ]
}