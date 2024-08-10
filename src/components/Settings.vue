<script setup lang="ts">

const settings = defineModel<Map<string, any>>({required: true})

</script>

<template>
  <div class="space-y-3">
    <div class="bg-indigo-300 p-5 max-w-xs">
      <h1 class="text-xl font-bold mb-3">settings</h1>
      <div v-for="item in settings.keys()" class="flex flex-row space-x-3 mb-2">
        <span>{{ item }}</span>
        <input type="text" placeholder="NOTE_MIN" :value="settings.get(item)" class="w-full"/>
      </div>
    </div>
    <div class="bg-amber-300 p-5 max-w-xs">
      <h1 class="text-xl font-bold mb-3">settings</h1>
      <div v-for="item in settings.keys()">
        <p>{{ item }} is {{ settings.get(item) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>