<script setup lang="ts">

import { computed, Ref } from 'vue';
import SettingsUtil from '../../lib/SettingsUtil';

const props = defineProps<{
  note?: string,
  isDown: Ref<boolean>,
  highlighted: boolean,
}>()

let debug = SettingsUtil.getRef("debug")
const classObject = computed(() => ({
  'bg-pink-500': props.isDown.value,
  'bg-pink-800': !props.isDown.value && !props.highlighted,
  'h-10': !props.highlighted,
  'bg-pink-200 h-16': props.highlighted,
}))

</script>

<template>
  <div 
      class="flex w-5 font-mono text-black justify-center items-center flex-initial"
      :class="classObject"
  >
    <p class="note-name" v-show="debug">{{ note }}</p>
  </div>
</template>

<style scoped>
  .note-name {
    pointer-events: none;
  }
</style>