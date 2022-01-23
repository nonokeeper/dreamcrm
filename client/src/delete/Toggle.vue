<template>
    <div class="flex items-center bg-gray-300 rounded-full w-14 h-7 p-1 duration-300"
    :class="{ 'bg-yellow-600': value }"
    :aria-checked="value.toString()"
    @click="toggle">
        <div class="h-5 w-5 rounded-full shadow-md transform duration-300 bg-white"
        :class="{ 'translate-x-7': value }">
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        toggle() {
            console.log('toggle clicked, val :' + !this.value)
            this.$emit('input', !this.value)
        }
    }
}
</script>