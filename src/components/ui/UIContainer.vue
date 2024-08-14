<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    default: "no title,,,"
  }
})

</script>

<template>
  <div class="p-5 bg-neutral text-neutral-content rounded-lg h-full w-full">
    <h1 class="text-xl font-bold mb-4">{{ props.title }}</h1>
    <slot/>
  </div>
</template>

<style scoped>

</style>