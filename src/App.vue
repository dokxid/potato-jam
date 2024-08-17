<script setup lang="ts">

// imports
import {ref} from "vue";

// component imports
import UIContainer from "./components/ui/UIContainer.vue";
import UIAddContainer from "./components/ui/UIAddContainer.vue";
import NavBar from "./components/ui/NavBar.vue";
import NetHandler from "./components/NetHandler.vue";
import SoundHandler, {NoteEventPayload} from "./lib/sound/SoundHandler";
import MainEventHandler from "./lib/MainEventHandler";
import EnterOverlay from "./components/ui/EnterOverlay.vue";
import PianoRollUI from "./components/ui/PianoRollUI.vue";
import InstrumentSettingsUI from "./components/ui/InstrumentSettingsUI.vue";
import Instrument from "./lib/sound/Instruments.ts";

// refs
const started = ref<boolean>(false)
const instr_list = ref<Map<number, Instrument>>()

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

      <div class="container mx-auto flex flex-col md:flex-row md:flex-wrap gap-4 py-5 items-center overflow-x-scroll">

        <UIContainer :title="'lobby'" class="">
          <NetHandler v-if="started" ref="NetHandler_ref" :push_payload="push_payload"/>
        </UIContainer>

<!--        <UIContainer :title="'instrument list'">-->
<!--           v-model="sound_events"  -->
<!--        </UIContainer>-->

        <UIContainer :title="'instruments'" class="">
          <div class="flex flex-wrap md:flex-row gap-3 p-4 bg-gradient rounded-xl">
            <h2 class="w-full text-primary-content font-bold text-xl text-end">piano [user]</h2>
            <PianoRollUI @send_key_event="payload => process_key(payload)" :instrument="instr_ctx"/>
            <InstrumentSettingsUI v-model="started"/>
          </div>
          <UIAddContainer class="mt-4" />
        </UIContainer>


      </div>
    </div>
  </div>
</template>
