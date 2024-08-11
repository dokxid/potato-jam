<script setup lang="ts">
import SettingsUtil from '../../lib/SettingsUtil';

defineProps<{
  note?: string
}>()

let debug = SettingsUtil.getRef("debug")
</script>

<template>
  <div class="flex w-6 h-16 bg-white text-black min-w-1 justify-center items-center">
    <p v-show="debug">{{ note }}</p>
  </div>
</template>

<style scoped>

</style>