<script setup lang="ts">

// imports
import {ref} from "vue";

// component imports
import UIContainer from "./components/ui/UIContainer.vue";
import PianoRoll from "./components/piano/PianoRoll.vue";
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

  <div class="flex flex-col h-lvh" >
    <NavBar class="grow-0"/>

    <div class="grow">
      <div v-show="!started" class="flex bg-base-200 h-full bg-opacity-50 justify-center items-center">
        <div class="flex flex-col gap-10 items-center">
          <h1 class="text-5xl font-semibold"><b class="font-extrabold bg-gradient-to-br from-primary to-secondary text-primary-content px-5">potato jam!!</b> YEY</h1>
          <button
              class="btn btn-primary bg-gradient-to-br from-primary to-secondary hover:brightness-150 w-full max-w-lg"
              v-if="!started"
              @click="initSoundHandler">
            click me to open lobby
          </button>
          <div class="w-full items-start">
            <p class="text-xs font-mono">note: this will play audio,,,</p>
            <p class="text-xs font-mono">repo:
              <a href="https://github.com/dokxid/potato-jam" class="underline">github.com/dokxid/potato-jam</a>
            </p>
          </div>
        </div>
      </div>

      <div v-if="started"
           class="container mx-auto flex flex-col md:grid md:grid-flow-row md:grid-cols-3 gap-4 py-5 items-center overflow-x-scroll">

        <UIContainer :title="'lobby'" class="md:col-span-2">
          <NetHandler ref="NetHandler_ref" :push_payload="push_payload"/>
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
    </div>
  </div>
</template>
