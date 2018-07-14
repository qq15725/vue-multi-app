import 'babel-polyfill'
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http = axios

const createApp = options => {
    new Vue({
        el: '#app',
        ...options
    })
}

export default createApp