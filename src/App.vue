<script setup lang="ts">

import PianoRoll from "./components/PianoRoll.vue";
import NavBar from "./components/NavBar.vue";
import SoundHandler from "./lib/SoundHandler"
import { onMounted, ref } from "vue";

let soundHandler:SoundHandler;
let started = ref(false); 

function process_key(payload: { event: string, note: number }) {
  console.log(`received event: ${payload.event} - ${payload.note}`);
  soundHandler.play(payload.event, payload.note, "meow")
}

function init() {
  soundHandler = new SoundHandler()
}

async function initSoundHandler() {
  await soundHandler.load_instrument_id("meow")
  await soundHandler.init()
  started.value = true
}

onMounted(() => init())

</script>

<template>
  <NavBar/>
  <button class="btn btn-accent" v-if="!started" @click="initSoundHandler">Click to start audio</button>
  <div class="flex justify-center items-center" v-if="started">
    <PianoRoll class="container" @send_key_event="payload => process_key(payload)"/>
  </div>
</template>
