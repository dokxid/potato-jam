<script setup lang="ts">

// imports
import {ref} from "vue";

// component imports
import UIContainer from "./components/ui/UIContainer.vue";
import PianoRoll from "./components/PianoRoll.vue";
import NavBar from "./components/NavBar.vue";
import NetTest from "./components/NetTest.vue";
import InstrumentUI from "./components/InstrumentUI.vue";
import SoundHandler from "./lib/SoundHandler";

// refs
const started = ref<boolean>(false)
const sound_event = ref<Object>()

// functions
function process_key(payload: { event: string, note: number }) {
  console.log(`received event: ${payload.event} - ${payload.note}`);
  sound_event.value = {event: payload.event, note: payload.note}
}

async function initSoundHandler() {
  await SoundHandler.init();
  started.value = true;
}

</script>

<template>

  <NavBar/>
  <div class="container mx-auto flex flex-col md:grid md:grid-flow-row md:grid-cols-3 gap-4 py-5 items-center overflow-x-scroll">
    <!-- pls someone somehow center this -->
    <button
          class="btn btn-primary w-full"
          v-if="!started"
          @click="initSoundHandler"> 
    Click to start audio
    </button>
  </div>

  <div v-if="started" class="container mx-auto flex flex-col md:grid md:grid-flow-row md:grid-cols-3 gap-4 py-5 items-center overflow-x-scroll">

    <UIContainer :title="'lobby'" class="md:col-span-2">
      <NetTest/>
    </UIContainer>

    <UIContainer :title="'instrument'">
      <InstrumentUI
          v-model="sound_event"
          @sound_handler_initialized="started = true"
      />
    </UIContainer>

    <UIContainer :title="'piano roll'" class="md:col-span-3">
      <div class="flex container justify-start lg:justify-center items-center" v-show="started">
        <PianoRoll class="" @send_key_event="payload => process_key(payload)"/>
      </div>
    </UIContainer>

  </div>

</template>
