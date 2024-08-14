<script setup lang="ts">
import InstrumentSettings from "../InstrumentSettings.vue";
const started = defineModel()
</script>
<template>
  <div class="p-5 items-center bg-base-300 rounded-xl max-w-fit flex-auto">
    <InstrumentSettings
        v-if="started"
        @sound_handler_initialized="started = true"
        class="min-w-40"
    />
  </div>
</template>