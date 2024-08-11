<script setup lang="ts">

import PianoRoll from "./components/PianoRoll.vue";
import InstrumentSwitcher from "./components/InstrumentSwitcher.vue";
import NavBar from "./components/NavBar.vue";
import NetTest from "./components/NetTest.vue";
import SoundHandler from "./lib/SoundHandler"
import { onMounted, ref } from "vue";

let soundHandler:SoundHandler;
let started = ref(false); 

let instrument_selected: string = "meow"

function process_key(payload: { event: string, note: number }) {
  console.log(`received event: ${payload.event} - ${payload.note}`);
  soundHandler.play(payload.event, payload.note, instrument_selected)
}

function init() {
  soundHandler = new SoundHandler()
}

async function initSoundHandler() {
  await soundHandler.load_instrument_id("meow")
  await soundHandler.init()
  started.value = true
}

async function update_instrument() {
  await soundHandler.load_instrument_id(instrument_selected)
}

onMounted(() => init())

</script>

<template>
  <NavBar/>
  <button class="btn btn-accent" v-if="!started" @click="initSoundHandler">Click to start audio</button>
  <div class="flex justify-center items-center" v-if="started">
    <PianoRoll class="container" @send_key_event="payload => process_key(payload)"/>
  </div>
  <NetTest/>
  <div class="bottom text-right text-bottom">
    <InstrumentSwitcher @update_instrument="update_instrument" v-model="instrument_selected" class="fixed-bottom" />
  </div>
</template>
