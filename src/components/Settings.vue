<script setup lang="ts">

import {onBeforeMount, ref} from 'vue';
import SettingsUtil, { DEFAULT_SETTINGS, SettingKey } from '../lib/SettingsUtil';

const input_refs = ref<HTMLInputElement[]>([])

function apply_settings() {
  for (let i = 0; i < input_refs.value.length; i++) {
    let id = input_refs.value[i].id as SettingKey
    let value = input_refs.value[i].value
    console.log(`updating value ${id} to ${value}`)
    SettingsUtil.set(id, value);
  }
}

function reset_local_storage() {
  SettingsUtil.reset()
}

function init() {}
onBeforeMount(() => init())

let key: SettingKey
</script>

<template>
  <div class="space-y-3">
    <div class="bg-base-100 max-w-xs text-base-content">
      <div v-for="item of Object.keys(DEFAULT_SETTINGS)" :set="key = item as SettingKey" class="flex flex-col space-y-3 mb-2">
        <span>{{ item }} {{ ' (default: ' + DEFAULT_SETTINGS[key] + ')' }}</span>
        <input
            type="text"
            :value="SettingsUtil.get(key)"
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