<script setup lang="ts">

import InstrumentSwitcher from "./InstrumentSwitcher.vue";
import SoundHandler, { NoteEventPayload } from "../lib/SoundHandler.ts";
import {onMounted, ref } from "vue";

let sound_events = defineModel<NoteEventPayload[]>()

let soundHandler: SoundHandler;
let instrument_selected: string = "meow"

const file_loaded = ref<boolean>(false)
let file = ""

// emits
const emit = defineEmits(['sound_handler_initialized'])

defineExpose({
  process_sound_events
})

async function process_sound_events() {
  let new_sound_events = sound_events.value
  if(new_sound_events === undefined) return;
  try {
    let promises = []
    for (const note_event of new_sound_events) {
      promises.push(soundHandler.play(note_event.event, note_event.note, instrument_selected))
      sound_events.value?.shift()
    }
    await Promise.allSettled(promises);
  } catch (e) {
    console.log('HELLO!')
    console.error(e)
  }
}

async function read_file(files: any) {
  file = await files.item(0).type
}

async function update_instrument() {
  await soundHandler.load_instrument_id(instrument_selected)
}

async function init() {
  soundHandler = new SoundHandler()
  await soundHandler.load_instrument_id("meow")
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
          @update_instrument="update_instrument"
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