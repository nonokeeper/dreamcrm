<template>
  <div v-if="userConnected">
    Welcome {{ user.firstName }}!
  </div>
  <div v-if="!userConnected">
    You are not connected
  </div>
</template>

<script>
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
    userConnected() {
      //console.log('Home.vue user : ', this.user)
      if (this.user._id == -1) return false
      else return true
    },
  },
  methods: {
  },
  mounted() {
    // Do not read the store data from here (not live values)

  },
}
</script>
