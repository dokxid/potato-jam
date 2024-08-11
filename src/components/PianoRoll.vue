<script setup lang="ts">
import SettingsUtil from "../lib/SettingsUtil";
import PianoKey from "./piano/PianoKey.vue";

import {onMounted, ref} from "vue";

// emits
const emit = defineEmits({
  send_key_event(payload: { event: string, note: number }) {
    // validating

    console.log(payload)
    return true;
  }
})

const key_amt = ref<number>(0)
const key_names = [
  // LOL? HARDCODED (；′⌒`)
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
]

function calculate_keys() {
  const note_min = SettingsUtil.get("note_min")
  const note_max = SettingsUtil.get("note_max")
  if (!isNaN(note_min) && !isNaN(note_max)) {
    console.log('hello q_q')
    console.log(note_min)
    key_amt.value = Math.abs(note_min - note_max)
  }
}

function init() {
  calculate_keys()
}

onMounted(init)
</script>

<template>
  <div class="flex flex-col">
    <p><i>note: this currently only does absolute display</i></p>
    <div class="flex flex-row space-x-1 justify-center">
      <PianoKey
          v-for="(_, idx) in key_amt"
          :note="key_names[idx%(key_names.length)]"
          @mousedown="$emit('send_key_event', {event: 'pressed', note: idx})"
          @mouseup="$emit('send_key_event', {event: 'released', note: idx})"
      />
    </div>
  </div>
</template>

<style scoped>

</style>