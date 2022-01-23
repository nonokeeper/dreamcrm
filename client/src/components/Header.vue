<template>
  <header class="text-center bg-yellow-600 text-white p-4 mb-8 grid grid-cols-3 gap-2">
    <div class="place-self-center text-3xl font-bold">
      <router-link to="/"><i class="fas fa-link">&nbsp;</i>Dream CRM appli</router-link>
    </div>
    <div v-if="status =='loggedIn'" class="place-self-center">
      Menu Connected
    </div>
    <div v-if="status =='' || status =='error_login'" class="place-self-center">
      Menu not connected
    </div>
    {{ status }}
    <div v-if="status =='' || status =='error_login'" class="place-self-center">
      <router-link to="/login">Login</router-link>
    </div>
    <div v-if="status =='loggedIn' || status == 'loading'" class="place-self-center">
      <router-link to="/" @click="logout">Logout</router-link>
    </div>
  </header>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: 'Header',
  computed: {
    ...mapState(['status'])
  },
  methods: {
    logout() {
      this.$store.commit('logout')
    },
  }
}
</script>
