<template>
  <Header/>

  <div class="ml-4 grid grid-row:3 grid-flow-col gap-4">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
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
