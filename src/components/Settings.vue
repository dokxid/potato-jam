<script setup lang="ts">

const settings = defineModel<Map<string, any>>({required: true})

function apply_settings() {

}

</script>

<template>
  <div class="space-y-3">
    <div class="bg-primary p-5 max-w-xs text-primary-content">
      <h1 class="text-xl font-bold mb-3">settings</h1>
      <div v-for="item in settings.keys()" class="flex flex-col space-y-3 mb-2">
        <span>{{ item }}</span>
        <input
            type="text"
            :placeholder="item + ' (currently: ' + settings.get(item) + ')'"
            :id="item"
            class="input input-bordered text-base-content max-w-xs"
        />
      </div>
      <button class="btn mt-4">apply</button>
    </div>
    <div class="bg-base-100 p-5 max-w-xs">
      <h1 class="text-xl font-bold mb-3">settings</h1>
      <div v-for="item in settings.keys()">
        <p>{{ item }} is {{ settings.get(item) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>