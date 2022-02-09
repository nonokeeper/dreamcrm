<template>
  <div>
    Your first name is {{ user.firstName }}<br/>
    Status : {{ status }}
    <div v-if="user.roles.admin">You are an Admin!</div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  components: {
  },
  created () {
    // console.log('created')
  }
}
</script>