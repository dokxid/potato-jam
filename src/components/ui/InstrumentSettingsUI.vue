<script setup lang="ts">
import InstrumentSettings from "../InstrumentSettings.vue";
const started = defineModel()
</script>
<template>
  <div class="p-5 items-center bg-base-100 rounded-xl grow-0">
    <InstrumentSettings
        v-if="started"
        @sound_handler_initialized="started = true"
        class="min-w-40"
    />
  </div>
</template>