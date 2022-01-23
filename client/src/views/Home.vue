<template>
  <div v-if="userConnected">
    Welcome {{ user.firstName }}!
  </div>
  <div v-if="!userConnected">
    You are not connected
  </div>
  <button @click="myInfos" class="m-4 bg-yellow-600 text-white rounded-lg shadow-lg px-2 py-2 hover:bg-yellow-700">
    Get my Infos
  </button>
  <div v-if="dataUser != ''">
    {{ dataUser }}
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  name: 'Home',
  data() {
    return {
      //user: '',
      TBD: '',
      dataUser: '',
    }
  },
  components: {
  },
  computed: {
    ...mapState(['user','status']),
    userConnected() {
      //console.log('Home.vue user : ', this.user)
      if (this.user._id == -1) return false
      else return true
    },
  },
  methods: {
    myInfos() {
      this.$store.dispatch('myInfos').then( (response) => {
        console.log('Home.vue response : ', response)
        this.dataUser = response
      }, error => {
        console.error('Home.vue something is wrong : ', error)
      })
    }
  },
  mounted() {
    // Do not read the store data from here (not live values)

  },
}
</script>
