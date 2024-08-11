<script setup lang="ts">

import PianoRoll from "./components/PianoRoll.vue";
import NavBar from "./components/NavBar.vue";
import SoundHandler from "./lib/SoundHandler"
import { onMounted } from "vue";

let soundHandler:SoundHandler; 

function process_key(payload: { event: string, note: number }) {
  console.log(`received event: ${payload.event} - ${payload.note}`);
  soundHandler.play(payload.event, payload.note)
}

function init() {
  soundHandler = new SoundHandler()
}

onMounted(() => init())

</script>

<template>
  <NavBar/>
  <div class="flex justify-center items-center">
    <PianoRoll class="container" @send_key_event="payload => process_key(payload)"/>
  </div>
</template>
