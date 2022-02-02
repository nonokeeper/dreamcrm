import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import store from './store'
import { mapState } from 'vuex'

export const mixin = {
    computed: mapState(['user','status'])
}

//app.config.devtools = true

createApp(App).use(router).use(store).mixin(mixin).mount('#app')
