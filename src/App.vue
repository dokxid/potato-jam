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

// refs
const started = ref<boolean>(false)
// const sound_events = reactive<NoteEventPayload[]>([])
const InstrumentUI_ref = ref<InstanceType<typeof InstrumentUI>>();
const NetHandler_ref = ref<InstanceType<typeof NetHandler>>();


// functions
function push_payload(payload: NoteEventPayload) {
  console.log(`received event: ${payload.event} - ${payload.note}`);
  // sound_events.push(payload)
  InstrumentUI_ref.value?.process_sound_events(payload)
}

// This one must only be called when the user produces the input, not any remote
function process_key(payload: NoteEventPayload) {
  push_payload(payload);
  NetHandler_ref.value?.process_payload(payload);
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
      <NetHandler ref="NetHandler_ref" :push_payload="push_payload"/>
    </UIContainer>

    <UIContainer :title="'instrument'">
      <!-- v-model="sound_events"  -->
      <InstrumentUI
          ref="InstrumentUI_ref"
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
