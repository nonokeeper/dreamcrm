<template>

  <!-- LOGIN Mode Begin -->
  <div class="ml-8" v-if="mode == 'login' && (status == '' || status == 'error_login' || status == null)">
    <div class="mt-4 w-1/2">
      <div class="text-yellow-800 text-xl">Log in</div>
      <div class="text-gray-500 text-right text-sm">No Account yet?<button class="bg-white hover:bg-yellow-100 text-yellow-800 ml-2 py-1 px-1 border border-yellow-600 rounded shadow" @click="switchToCreateAccount">&nbsp;Create an Account</button></div>
    </div>
    <button v-if="mode === 'login' && status == 'loading'" type="button" class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-yellow-600 hover:bg-yellow-800 transition ease-in-out duration-150 cursor-not-allowed" disabled="">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </button>
    <form v-on:change="change" ref="login" class="flex flex-col w-1/2 place-items-center mt-4 rounded border border-yellow-600">
      <div class="mt-4">
        <label class="block left-1 -top-2 text-gray-500 text-sm">Username</label>
        <input v-model.trim="username" required :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800"/>
      </div>
      <div class="mt-4" v-if="mode === 'login'">
          <div class="flex flex-auto items-center">
              <div class="ml-14 text-sm"></div>
              <div>
                  <label class="block left-1 -top-2 text-gray-500 text-sm">Password</label>
                  <input v-model.trim="password" type="password" required :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800"/>
              </div>
              <div v-if="mode === 'login'"><router-link class="ml-2 text-sm text-yellow-600" to="/forgot">Forgot?</router-link></div>
          </div>
      </div>
      <div v-if="mode === 'login' && status == 'error_login' && first" class="mt-4">
        <div role="alert">
          <div class="grid grid-cols-2 bg-red-500 text-white font-bold rounded-t px-2 py-1">
            <div class="">Error</div><div @click="change" class="text-right cursor-pointer">X</div>
          </div>
          <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-2 py-2 text-red-700 text-sm">
            <p>Bad credentials, please try again.</p>
          </div>
        </div>
      </div>
      <div class="mt-4 mb-4" v-if="mode === 'login'">
          <button type="button" @click="login" :disabled="formInvalid" class="disabled:opacity-30 rounded mt-4 px-2 py-1 text-gray-100 bg-yellow-600 hover:bg-yellow-700">
            <span v-if="status == '' || status == 'error_login' || status == 'error_create'">Login</span>
            <span v-if="status == 'loading'">Login in progress...</span>
          </button>
      </div>
    </form>
  </div>
  <div class="ml-8" v-if="mode == 'login' && status == 'loggedIn'">
    {{ user.firstName }}, you're already logged in<br>
    Wanna quit : <button @click="logout" class="bg-white hover:bg-yellow-100 text-yellow-800 ml-2 py-1 px-1 border border-yellow-600 rounded shadow">Logout</button>
  </div>
  <!-- LOGIN Mode End -->

  <!-- CREATE Mode Begin -->
  <div class="ml-8" v-if="mode === 'create'">
    <div class="mt-4 w-1/2">
        <div class="text-yellow-800 text-xl">Create an Account</div>
        <div class="text-gray-500 text-right text-sm">Already an Account?<button class="bg-white hover:bg-yellow-100 text-yellow-800 ml-2 py-1 px-1 border border-yellow-600 rounded shadow" @click="switchToLogin">&nbsp;Login</button></div>
    </div>
    <form ref="create" class="flex flex-col w-1/2 place-items-center mt-4 rounded border border-yellow-600">
      <div class="mt-4">
        <label class="block left-1 -top-2 text-gray-500 text-sm">First Name</label>
        <input v-model.trim="firstName" :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800" ref="firstName"/>
      </div>
      <div class="mt-4">
        <label class="required block left-1 -top-2 text-gray-500 text-sm">Last Name</label>
        <input v-model.trim="lastName" required :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800" ref="lastName"/>
      </div>
      <div class="mt-4">
        <label class="block left-1 -top-2 text-gray-500 text-sm">Username</label>
        <input v-model.trim="username" required :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800"/>
      </div>
      <div class="mt-4">
          <div class="flex flex-auto items-center">
              <div>
                  <label class="block left-1 -top-2 text-gray-500 text-sm">Password</label>
                  <input v-model.trim="password" type="password" required :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800"/>
              </div>
          </div>
      </div>
      <div class="mt-4">
        <label class="block left-1 -top-2 text-gray-500 text-sm">Confirm Password</label>
        <input v-model.trim="password2" type="password" required :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800"/>
      </div>

      <div class="mt-4" v-if="displayMessageCreate">
        {{ messageCreate }}
      </div>
      <div class="mt-4 mb-4">
          <button type="button" @click="createUser" :disabled="formInvalid" class="disabled:opacity-30 rounded mt-4 px-2 py-1 text-gray-100 bg-yellow-600 hover:bg-yellow-700">Create User</button>
      </div>
    </form>
  </div>
  <!-- CREATE Mode End -->

</template>

<script>
import UserService from '@/services/UserService'

export default {
  name: 'Login',
  components: {
  },
  data () {
    return {
      focusMedium: 'focus:outline-none border border-gray-300 focus:border-yellow-600 focus:ring-0',
      mode: 'login',
      username: '',
      password: '',
      password2: '',
      firstName: '',
      lastName: '',
      first: false,
      messageCreate: '',
      displayMessageCreate: false,
      statusCreate: false,
    }
  },
  computed: {
    formInvalid() {
      if(this.mode == 'create') {
        if (this.lastName != '' && this.username != '' && this.password != '' && this.password2 != '' && this.password == this.password2) {
          return false
        }
      }
      if (this.mode == 'login') {
        if (this.username != '' && this.password != '') {
          return false
        }
      }
      return true
    }
  },
  methods: {
    change() {
      this.first = false
    },
    login() {
      this.first = true
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password,
      }).then((response) => {
        console.log('Login.vue -- Connected user : ', this.username)
      }).catch((error) => {
        console.log('Login.vue Error : ',error)
      })
    },
    logout() {
      this.$store.commit('logout')
    },
    switchToCreateAccount() {
      this.mode = 'create'
    },
    switchToLogin() {
      this.mode = 'login'
    },
    async createUser() {
      let body = {
        username: this.username,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
      }
      if (this.password.length <= 6 ) {
        this.messageCreate = 'Your password must contain more than 6 characters!'
        this.password = this.password2 = ''
      }
      if (this.password == this.password2 && this.password.length > 6) {
        try {
          await UserService.insertUser(body)
          this.messageCreate = 'User '+this.username+' created successfully!'
          this.statusCreate = true
        } catch (err) {
          this.messageCreate = 'User not created, this username already exists!'
        }
        this.password = this.password2 = ''
      }
      this.displayMessageCreate = true
    }
  }
}
</script>
