<script setup lang="ts">

import SettingsUtil from "../lib/SettingsUtil";
import PianoKeyDefault from "./piano/PianoKeyDefault.vue";
import {constants} from "../data/constants.ts";

import {computed, onMounted, ref, watch} from "vue";
import PianoKeyBlack from "./piano/PianoKeyBlack.vue";

// emits
const emit = defineEmits({
  send_key_event(payload: { event: string, note: number }) {
    if (SettingsUtil.get('debug')) {
      console.log(payload)
    }
    return true;
  }
})

const key_amt = ref<number>(0)
const scale_selected = ref("chromatic")

const key_names = constants.SEMITONE_NAMES
const keybinds = constants.KEYBINDS

let prev_key = ""
let scale_pattern: Array<number> = []

function calculate_keys() {
  const note_min = SettingsUtil.get("note_min")
  const note_max = SettingsUtil.get("note_max")
  if (!isNaN(note_min) && !isNaN(note_max)) {
    console.log('hello q_q')
    console.log(note_min)
    key_amt.value = Math.abs(note_min - note_max)
  }
}

const keysDown = ref<{ [note: number]: boolean }>({})

function press_key(note: number) {
  emit("send_key_event", {event: "pressed", note})
  keysDown.value[note] = true;

}

function release_key(note: number) {
  emit("send_key_event", {event: "released", note})
  delete keysDown.value[note];
}

function check_input(ev: KeyboardEvent) {
  return !(ev.target && "tagName" in ev.target && ev.target.tagName == "INPUT")
}

function change_scale(scale_name: string) {
  scale_pattern = constants.SCALES[scale_name]
  console.log(`pattern for ${scale_name} is ${scale_pattern}`)
}

watch(scale_selected, async (new_scale) => {
  console.log(new_scale)
  change_scale(new_scale)
})

function init() {
  window.addEventListener("keydown", function (ev) {
    let keybind_uppercase = ev.key.toUpperCase()

    if (keybinds.includes(keybind_uppercase) && check_input(ev) && keybind_uppercase !== prev_key) {
      press_key(keybinds.indexOf(keybind_uppercase));
      prev_key = keybind_uppercase
    }
  })
  window.addEventListener("keyup", function (ev) {
    let keybind_uppercase = ev.key.toUpperCase()

    if (keybinds.includes(keybind_uppercase) && check_input(ev)) {
      release_key(keybinds.indexOf(keybind_uppercase))
      prev_key = ""
    }
  })
  calculate_keys()
}

onMounted(init)
</script>

<template>
  <div class="flex flex-col space-y-4">
    <p><i>note: this currently only does absolute display</i></p>
    <div class="flex flex-row min-h-20 p-2 bg-base-100 dark:bg-base-300 space-x-1 justify-center">
      <PianoKeyDefault
          v-for="(_, idx) in key_amt"
          :note="key_names[idx%(key_names.length)]"
          :is-down="computed(() => keysDown[idx])"
          :highlighted="scale_pattern.includes(idx%12)"
          @mousedown="press_key(idx)"
          @mouseup="release_key(idx)"
          @mouseleave="release_key(idx)"
      />
    </div>
    <select v-model="scale_selected" class="select select-bordered w-full max-w-xs">
      <option
          :value="scale"
          v-for="scale in Object.keys(constants.SCALES)">{{ scale }}
      </option>
    </select>
    <div>{{scale_pattern}}</div>
  </div>
</template>

<style scoped>

</style>