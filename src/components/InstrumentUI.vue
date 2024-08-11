<script setup lang="ts">

import InstrumentSwitcher from "./InstrumentSwitcher.vue";
import SoundHandler from "../lib/SoundHandler.ts";
import {onMounted, ref, watch} from "vue";

const sound_event = defineModel()

let started = ref(false);
let soundHandler: SoundHandler;
let instrument_selected: string = "meow"

// emits
const emit = defineEmits(['sound_handler_initialized'])

watch(sound_event, async (new_sound_event: Object) => {
  try {
    await soundHandler.play(new_sound_event.event, new_sound_event.note, instrument_selected)
  } catch (e) {
    console.log('HELLO!')
    console.error(e)
  }
})

async function initSoundHandler() {
  await soundHandler.load_instrument_id("meow")
  await soundHandler.init()
  emit('sound_handler_initialized')
}

async function update_instrument() {
  await soundHandler.load_instrument_id(instrument_selected)
}

function init() {
  soundHandler = new SoundHandler()
}

onMounted(() => init())

</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="space-x-2">
      <button
          class="btn btn-accent"
          v-if="!started"
          @click="initSoundHandler"
      > Click to start audio </button>
      <button class="btn btn-accent">select file</button>
    </div>
    <input type="file" class="file-input file-input-bordered w-full max-w-xs"/>
    <div class="bottom text-right text-bottom">
      <InstrumentSwitcher
          @update_instrument="update_instrument"
          v-model="instrument_selected"
          class="fixed-bottom select select-bordered w-full max-w-xs"
      />
    </div>
  </div>
</template>

<style scoped>

</style>