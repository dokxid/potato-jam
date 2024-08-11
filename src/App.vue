<script setup lang="ts">

import PianoRoll from "./components/PianoRoll.vue";
import NavBar from "./components/NavBar.vue";
import NetTest from "./components/NetTest.vue";

function process_key(payload: { event: string, note: number }) {
  console.log(`received event: ${payload.event} - ${payload.note}`);
}

</script>

<template>
  <NavBar/>
  <div class="flex justify-center items-center">
    <PianoRoll class="container" @send_key_event="payload => process_key(payload)"/>
  </div>
  <NetTest/>
</template>
