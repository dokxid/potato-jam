<script setup lang="ts">

// imports
import {ref} from "vue";

// component imports
import UIContainer from "./components/ui/UIContainer.vue";
import UIAddContainer from "./components/ui/UIAddContainer.vue";
import PianoRoll from "./components/piano/PianoRoll.vue";
import NavBar from "./components/NavBar.vue";
import NetHandler from "./components/NetHandler.vue";
import InstrumentUI from "./components/InstrumentUI.vue";
import SoundHandler, {NoteEventPayload} from "./lib/SoundHandler";
import MainEventHandler from "./lib/MainEventHandler";
import EnterOverlay from "./components/ui/EnterOverlay.vue";

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

    <div class="grow relative">
      <EnterOverlay v-model="started" @init-sound-handler="initSoundHandler"/>

      <div
           class="container mx-auto flex flex-col md:grid md:grid-flow-row md:grid-cols-3 gap-4 py-5 items-center overflow-x-scroll">

        <UIContainer :title="'lobby'" class="md:col-span-2">
          <NetHandler ref="NetHandler_ref" :push_payload="push_payload"/>
        </UIContainer>

        <UIContainer :title="'instrument list'">
          <!-- v-model="sound_events"  -->
        </UIContainer>

        <UIContainer :title="'instruments'" class="md:col-span-3">
          <div class="flex flex-wrap gap-3">
            <div class="p-5 items-center bg-base-100 rounded-xl grow overflow-x-scroll">
              <PianoRoll class="" @send_key_event="payload => process_key(payload)"/>
            </div>
            <div class="p-5 items-center bg-base-100 rounded-xl grow-0">
            <InstrumentUI
                v-if="started"
                @sound_handler_initialized="started = true"
                class="min-w-40"
            />
            </div>
          </div>
        </UIContainer>

        <UIAddContainer class="md:col-span-3" />

      </div>
    </div>
  </div>
</template>
