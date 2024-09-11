<script setup lang="ts">
import { ref } from 'vue';
import {INSTRUMENT_LIST} from '../lib/Instruments';
import { Input, WebMidi } from 'webmidi';
import MainEventHandler from '../lib/MainEventHandler';
const device_list = ref<[number, string | null, Input][]>([])
const selected = defineModel()

const id_to_device: {[k: string]: Input} = {}
const midi_access = ref<boolean>();

async function request_midi_access() {
  await WebMidi.enable()
  midi_access.value = true;
  device_list.value = Array.from(WebMidi.inputs.entries()).map((arr) => {
    let [id, device] = arr;
    id_to_device[id] = device;
    return [id, device.name, arr[1]]
  })
}

function update_midi_device() {
  console.log("update", selected.value)
  const device = id_to_device[Number(selected.value)];
  if(device === undefined) return console.warn("no device for " + selected.value); // todo: show this error to user
  device.addListener("noteon", (e) => {
    MainEventHandler.sendUserMIDINotePayload({note: e.note.number, event: "pressed"})
  }) 
  device.addListener("noteoff", (e) => {
    MainEventHandler.sendUserMIDINotePayload({note: e.note.number, event: "released"})
  })
}

</script>

<template>
  <button @click="request_midi_access()" class="btn btn-primary mt-4" v-if="midi_access !== true">
    Allow MIDI access
  </button>
  <select class="fixed-bottom select select-bordered w-full text-base-content" v-if="device_list.length !== 0" v-model="selected" @change="() => update_midi_device()">
    <option value="-1" selected>None</option>
    <option v-for="device of device_list" :value="device[0]">{{ device[1] }}</option>
  </select>
  <p v-if="midi_access && device_list.length == 0">
    No MIDI input devices were detected!
  </p>
</template>