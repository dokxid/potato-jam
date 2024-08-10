<script setup lang="ts">

import {onBeforeMount, ref} from 'vue';

const input_refs = ref<Array<any>>([])
const local_settings = new Map()

const DEFAULT_SETTINGS = new Map()
    .set("note_min", 0)
    .set("note_max", 36)
    .set("piano_roll_mode", "default")

function apply_settings() {
  for (let i = 0; i < input_refs.value.length; i++) {
    console.log(`updating value ${input_refs.value[i].id} to ${input_refs.value[i].value}`)
    localStorage.setItem(input_refs.value[i].id, input_refs.value[i].value)
    load_local_storage()
    input_refs.value[i].value = ""
  }
}

function set_default_settings() {
  for (const [key, value] of DEFAULT_SETTINGS) {
    if (localStorage.getItem(key) == null) {
      localStorage.setItem(key, value)
    }
  }
}

function load_local_storage() {
  for (const [key, _] of DEFAULT_SETTINGS) {
    local_settings.set(key, localStorage.getItem(key))
  }
}

function reset_local_storage() {
  localStorage.clear()
  set_default_settings()
}

function init() {
  set_default_settings()
  load_local_storage()
}

onBeforeMount(() => init())

</script>

<template>
  <div class="space-y-3">
    <div class="bg-base-100 max-w-xs text-base-content">
      <div v-for="item in local_settings.keys()" class="flex flex-col space-y-3 mb-2">
        <span>{{ item }}</span>
        <input
            type="text"
            :placeholder="local_settings.get(item) + ' (default: ' + DEFAULT_SETTINGS.get(item) + ')'"
            :id="item"
            ref="input_refs"
            class="input input-bordered text-base-content max-w-xs"
        />
      </div>
      <div class="space-x-2">
        <button class="btn btn-primary mt-4" @click="apply_settings">
          apply
        </button>
        <button class="btn btn-ghost mt-4" @click="reset_local_storage">
          reset
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>