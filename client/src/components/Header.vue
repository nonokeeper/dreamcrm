<template>
  <header class="text-center bg-yellow-600 text-white p-4 mb-8 grid grid-cols-3 gap-2">
    <div class="place-self-center text-3xl font-bold">
      <router-link class="hover:text-yellow-200" to="/"><i class="fas fa-link">&nbsp;</i>Dream CRM appli</router-link>
    </div>
    <div v-if="status =='loggedIn'" class="place-self-center">
      Menu Connected
    </div>
    <div v-if="status == '' || status == 'error_login'" class="place-self-center">
      Menu not connected
    </div>
    <div v-if="status != 'loggedIn'" class="place-self-center">
      <router-link class="hover:text-yellow-200" to="/login">Login</router-link>
    </div>
    <div v-if="status =='loggedIn' || status == 'loading'" @click="switchProfileMenu" v-click-outside="hideProfileMenu" class="relative cursor-pointer place-self-center">
      <i class="fas fa-user-circle">
        &nbsp;{{ user.firstName }}&nbsp;
        <i v-if="profileMenu" class="fas fa-caret-up"></i>
        <i v-if="!profileMenu" class="fas fa-caret-down"></i>
      </i>
      <div v-show="profileMenu" class="bg-yellow-600 text-white absolute mt-6 origin-top-right rounded-md shadow-lg md:w-48">
        <div class="my-2 text-left"><router-link to="/profile" class="block hover:text-yellow-200">&nbsp;&nbsp;&nbsp;My Account</router-link></div>
        <div v-if="userAdmin" class="my-2 text-left"><router-link to="/setup" class="block hover:text-yellow-200">&nbsp;&nbsp;&nbsp;Setup</router-link></div>
        <div class="border-t border-white my-1 mb-2 text-left"><router-link to="/" class="block hover:text-yellow-200" @click="logout">&nbsp;&nbsp;&nbsp;Logout</router-link></div>
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
    switchProfileMenu() {
      this.profileMenu = !this.profileMenu
    },
    hideProfileMenu() {
      this.profileMenu = false
    }
  },
  computed: {
    userAdmin() {
      //console.log('Header.vue user admin flag : ', this.user.roles.admin)
      //if (this.user.roles)
      return this.user.roles.admin
    }
  }
}
</script>
