import 'babel-polyfill'
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http = axios

const createApp = App => {
    let option = {
        el    : '#app',
        render: h => h(App)
    }

    if (typeof App === "function") {
        option = Object.assign({}, option, App() || {})
    }

    new Vue(option)
}

export default createApp