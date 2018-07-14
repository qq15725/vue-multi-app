import Router from 'vue-router'
import Vue from 'vue'
import Info from '@/views/user/info.vue'
import Index from '@/views/user/index.vue'

Vue.use(Router)

const routes = [
    {
        path: '/info',
        name: 'Info',
        component: Info,
    },
    {
        path: '/',
        name: 'Index',
        component: Index
    }
]

export default new Router({
    routes
})