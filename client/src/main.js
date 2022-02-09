import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import store from './store'
import { mapState } from 'vuex'

export const mixin = {
    computed: mapState(['user','status'])
}

const app = createApp(App)

app.directive("size", (el, binding, vnode) => {
    var size = 16
    el.style.fontSize = size + "px"
})

app.directive('click-outside', {
    beforeMount(el, binding, vnode) {
      el.clickOutsideEvent = function(event) {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event, el);
        }
      };
      document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) {
      document.body.removeEventListener('click', el.clickOutsideEvent);
    }
})

//app.config.devtools = true

app.use(router).use(store).mixin(mixin).mount('#app')
