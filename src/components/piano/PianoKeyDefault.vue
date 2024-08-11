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
  'contrast-200': props.isDown.value,
  'brightness-50': !props.isDown.value && !props.highlighted,
  'h-10 w-3': !props.highlighted,
  'brightness-150 h-16': props.highlighted,
}))

</script>

<template>
  <div 
      class="flex w-5 font-mono bg-primary text-black justify-center items-center flex-initial rounded-sm"
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