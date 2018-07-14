import createApp from '@/main.js'
import router from '@/routers/user.router.js'

createApp(() => {
    return {
        router,
        render: () => {
            return (
                <div id="app">
                    <router-view/>
                </div>
            )
        }
    }
})