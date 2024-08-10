<script setup lang="ts">
defineProps<{
  note?: string
}>()

const debug = localStorage.getItem('debug')
</script>

<template>
  <div class="flex w-6 h-16 bg-white text-black min-w-1 justify-center items-center">
    <p v-show="debug === 'true'">{{ note }}</p>
  </div>
</template>

<style scoped>

</style>