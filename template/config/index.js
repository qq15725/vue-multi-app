'use strict'

const path = require('path')

module.exports = {
    commonsName: 'common',
    dev: {
        // Paths
        assetsPublicPath: '',

        proxyTable: {},

        rewrites: [],

        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
    },
    build: {
        assetsPublicPath: ''
    }
}