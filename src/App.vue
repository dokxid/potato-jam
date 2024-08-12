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
const sound_events = ref<Object[]>([])
const InstrumentUI_ref = ref<InstanceType<typeof InstrumentUI>>()


// functions
function process_key(payload: { event: string, note: number }) {
  console.log(`received event: ${payload.event} - ${payload.note}`);

  sound_events.value.push({event: payload.event, note: payload.note})
  InstrumentUI_ref.value?.process_sound_events()
}

</script>

<template>

  <NavBar/>

  <div class="container mx-auto flex flex-col md:grid md:grid-flow-row md:grid-cols-3 gap-4 py-5 items-center overflow-x-scroll">

    <UIContainer :title="'networking'" class="md:col-span-2">
      <NetTest/>
    </UIContainer>

    <UIContainer :title="'instrument'">
      <InstrumentUI
          ref="InstrumentUI_ref"
          v-model="sound_events"
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
