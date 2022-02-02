<template>
  <header class="text-center bg-yellow-600 text-white p-4 mb-8 grid grid-cols-3 gap-2">
    <div class="place-self-center text-3xl font-bold">
      <router-link to="/"><i class="fas fa-link">&nbsp;</i>Dream CRM appli</router-link>
    </div>
    <div v-if="status =='loggedIn'" class="place-self-center">
      Menu Connected
    </div>
    <div v-if="status == '' || status == 'error_login'" class="place-self-center">
      Menu not connected
    </div>
    <div v-if="status != 'loggedIn'" class="place-self-center">
      <router-link to="/login">Login</router-link>
    </div>
    <div v-if="status =='loggedIn' || status == 'loading'" class="place-self-center">
      <div class="relative grid grid-cols-2" @mouseover="showProfileMenu" @mouseleave="hideProfileMenu">
        <div><i class="fas fa-user-circle"></i></div>
        <div>{{ user.firstName }}</div>
        <div v-show="profileMenu"><router-link to="/" @click="logout">Logout</router-link></div>
      </div>
      
    </div>
  </header>
</template>

<script>

export default {
  name: 'Header',
  data() {
    return {
      profileMenu: false
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout')
    },
    showProfileMenu() {
      this.profileMenu = true
    },
    hideProfileMenu() {
      this.profileMenu = false
    }
  }
}
</script>
