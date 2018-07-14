import 'babel-polyfill'
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http    = axios

const createApp = App => {
    new Vue({
        el    : '#app',
        render: h => h(App)
    })
}

export default createApp