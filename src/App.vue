<script setup lang="ts">

// imports
import {ref} from "vue";

// component imports
import UIContainer from "./components/ui/UIContainer.vue";
import PianoRoll from "./components/PianoRoll.vue";
import NavBar from "./components/NavBar.vue";
import NetHandler from "./components/NetHandler.vue";
import InstrumentUI from "./components/InstrumentUI.vue";
import SoundHandler, { NoteEventPayload } from "./lib/SoundHandler";
import MainEventHandler from "./lib/MainEventHandler";

// refs
const started = ref<boolean>(false)
// const sound_events = reactive<NoteEventPayload[]>([])

// functions
function push_payload(payload: NoteEventPayload) {
  console.log(`received event: ${payload.event} - ${payload.note} - ${payload.id}`);
  // sound_events.push(payload)
  MainEventHandler.sendNotePayload(payload);
}

// This one must only be called when the user produces the input, not any remote
function process_key(payload: NoteEventPayload) {
  push_payload(payload);
  MainEventHandler.sendUserNotePayload(payload);
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
      <NetHandler ref="NetHandler_ref"/>
    </UIContainer>

    <UIContainer :title="'instrument'">
      <!-- v-model="sound_events"  -->
      <InstrumentUI
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
