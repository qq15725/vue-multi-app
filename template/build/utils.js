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

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

// support windows path
function fixPath(_path) {
    return _path.replace(/\\/g, '/')
}

exports.eachViews = function (viewsDirectory, outputFilenameCallback = null, templateCallback = null) {
    let entries                = {}
    let chunks                 = []
    let htmlWebpackPluginArray = []

    viewsDirectory = fixPath(viewsDirectory)

    glob.sync(`${viewsDirectory}/**/*.js`).forEach(filePath => {
        filePath       = fixPath(filePath)
        const view     = filePath.split(`${viewsDirectory}/`)[1].replace('.js', '')
        const chunk    = `_${view.replace(/\//g, '_')}`
        entries[chunk] = filePath
        chunks.push(chunk)
        let filename = `${view}.htm`
        let template = filePath.replace(/\.js/g, '.ejs')

        if (typeof outputFilenameCallback === 'function') {
            filename = outputFilenameCallback(filename)
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

        if (typeof templateCallback === 'function') {
            template = templateCallback(template)
        }

        if (!fs.existsSync(template)) {
            template = resolve(path.join('src', 'app.ejs'))
        }

        console.log(chalk.green(`Use template: ${template}`))

        const htmlConf = {
            filename: filename,
            template: template,
            inject  : template.indexOf('app.htm') > -1 ? 'body' : false,
            chunks  : [config.commonsName, chunk]
        }

        htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
    })

    return {
        entries,
        chunks,
        htmlWebpackPluginArray
    }
}

exports.extractStyle = function () {
    const filename = 'css/[name].css'

    const extractCSS = new ExtractTextPlugin({
        filename : filename,
        allChunks: true
    })

    const extractLESS = new ExtractTextPlugin({
        filename : filename,
        allChunks: true
    })

    const extractSASS = new ExtractTextPlugin({
        filename : filename,
        allChunks: true
    })

    return [
        extractLESS,
        extractSASS,
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