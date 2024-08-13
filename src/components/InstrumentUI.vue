<script setup lang="ts">

import InstrumentSwitcher from "./InstrumentSwitcher.vue";
import SoundHandler, { NoteEventPayload } from "../lib/SoundHandler.ts";
import {onMounted, ref, watch } from "vue";
import MainEventHandler from "../lib/MainEventHandler.ts";
import { DEFAULT_INSTRUMENT } from "../lib/Instruments";
import { LOCAL_CLIENT_ID } from "../lib/net/PotatoServer";

// let sound_events = defineModel<NoteEventPayload[]>()

let soundHandler: SoundHandler;
let instrument_selected = ref<string>(DEFAULT_INSTRUMENT)

const file_loaded = ref<boolean>(false)
let file = ""

// emits
const emit = defineEmits(['sound_handler_initialized'])

async function process_sound_events(note_event: NoteEventPayload) {
  soundHandler.play(note_event)
}
MainEventHandler.on("notePayload", process_sound_events)

async function read_file(files: any) {
  file = await files.item(0).type
}

watch(instrument_selected, (new_instrument) => {
  MainEventHandler.sendUserSwitchInstrumentPayload({instrument_id: new_instrument})
})

MainEventHandler.on("remoteSwitchInstrumentPayload", (payload) => {
  soundHandler.set_peer_instrument(payload.id, payload.instrument_id);
})

async function init() {
  soundHandler = new SoundHandler()
  emit('sound_handler_initialized')
}

onMounted(() => init())

</script>

<template>
  <div class="flex flex-col gap-3">
    <div>
      <h3>general settings</h3>
      
    </div>
    <div>
      <h3>sample settings</h3>
      <div class="flex flex-row space-x-2">
        <input type="file" @change="(e) => {read_file((e.target as HTMLInputElement).files); file_loaded = true }"
               class="file-input file-input-primary w-full text-base-content"/>
        <button class="btn btn-primary shrink" v-show="file_loaded">apply</button>
      </div>
      <div v-show="file_loaded">
        {{ "loaded type: " + file }}
      </div>
    </div>
    <div>
      <h3>instrument settings</h3>
      <InstrumentSwitcher
          v-model="instrument_selected"
          class="fixed-bottom select select-bordered w-full text-base-content"
      />
    </div>
  </div>
</template>

<style scoped>
h3 {
  @apply text-lg mb-2
}
</style>