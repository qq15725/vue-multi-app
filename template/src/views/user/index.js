import createApp from '@/main.js'
import routes from '@/routers/user.router.js'

createApp(() => {
    return {
        routes,
        render: () => {
            return (
                <div id="app">
                    <router-view/>
                </div>
            )
        }
    }
})