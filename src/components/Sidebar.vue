<template>
    <div>
        <ul class="text-white">
        <li class="m-4"><router-link active-class="text-lg text-yellow-200" class="hover:text-lg hover:text-yellow-200" to="/">Home</router-link></li>
        <li class="m-4"><router-link active-class="text-lg text-yellow-200" class="hover:text-lg hover:text-yellow-200" to="/customer">Customer</router-link></li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>
