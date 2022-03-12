<template>
    <div class="w-1/4">
      <ul class="text-white text-lg">
        <li class="m-4"><router-link active-class="text-lg text-yellow-200" class="hover:text-lg hover:text-yellow-200" to="/">Home</router-link></li>
        <li class="m-4"><router-link active-class="text-lg text-yellow-200" class="hover:text-lg hover:text-yellow-200" to="/customer">Customer</router-link></li>
        <li class="m-4"><router-link active-class="text-lg text-yellow-200" class="hover:text-lg hover:text-yellow-200" to="/marketing">Marketing</router-link></li>
      </ul>
    </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>
