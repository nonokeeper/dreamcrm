<template>
  <Header/>

  <div class="ml-4 grid grid-row:3 grid-flow-col gap-4">
    <div class="row-span-full rounded-md bg-yellow-600 text-white font-semibold items-center py-3 px-6">
      <Sidebar/>
    </div>
    <div class="row-span-full col-span-4 rounded-md border-2 border-yellow-600 py-3 px-6">
      <router-view/>
    </div>
  </div>

</template>

<script>
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default {
  components: {
    Header,
    Sidebar
  },
  mounted () {
    // console.log('NODE_ENV :' + process.env.VUE_APP_NODE_ENV)
  }
}
</script>
