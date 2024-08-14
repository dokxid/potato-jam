<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    default: ""
  }
})

</script>

<template>
  <div
      class="
      flex
      p-5
      bg-transparent
      border-4
      border-base-200
      hover:border-primary
      text-base-200
      hover:text-primary
      rounded-lg
      h-full
      w-full
      justify-center
      items-center
      cursor-pointer
  ">
    <p class="font-extrabold text-xl">add </p>
    <p class="font-extrabold text-7xl">＋</p>
  </div>
</template>

<style scoped>

</style>