<script setup lang="ts">

// imports
import {ref} from "vue";

// component imports
import UIContainer from "./components/ui/UIContainer.vue";
import PianoRoll from "./components/PianoRoll.vue";
import NavBar from "./components/NavBar.vue";
import NetTest from "./components/NetTest.vue";
import InstrumentUI from "./components/InstrumentUI.vue";

// refs
const started = ref<boolean>(false)
const sound_event = ref<Object>()

// functions
function process_key(payload: { event: string, note: number }) {
  console.log(`received event: ${payload.event} - ${payload.note}`);
  sound_event.value = {event: payload.event, note: payload.note}
}

</script>

<template>

  <NavBar/>

  <div class="container mx-auto grid grid-flow-row grid-cols-3 gap-4 py-5 items-center">

    <UIContainer :title="'networking'" class="col-span-2">
      <NetTest/>
    </UIContainer>

    <UIContainer :title="'instrument'">
      <InstrumentUI
          v-model="sound_event"
          @sound_handler_initialized="started = true"
      />
    </UIContainer>

    <UIContainer :title="'piano roll'" class="col-span-3">
      <div class="flex container justify-center items-center" v-show="started">
        <PianoRoll class="" @send_key_event="payload => process_key(payload)"/>
      </div>
    </UIContainer>

  </div>

</template>
