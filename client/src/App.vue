<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <div class="max-w-screen-2xl mx-auto">
    <Header/>
    <div class="space-x-4 md:flex mb-4">
      <div></div>
      <div class="w-1/4 rounded-md bg-yellow-600 text-white font-semibold py-3 px-6">
        <Sidebar/>
      </div>
      <div class="w-3/4 rounded-md border-2 border-yellow-600 py-3 px-6">
        <router-view/>
      </div>
      <div></div>
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
    console.log('NODE_ENV :' + process.env.NODE_ENV)
  }
}
</script>
