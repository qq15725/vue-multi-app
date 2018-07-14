import createApp from '@/main.js'
import router from '@/routers/user.router.js'

createApp({
    router,
    template: `
        <div id="app">
            <router-view/>            
        </div>         
        `
})