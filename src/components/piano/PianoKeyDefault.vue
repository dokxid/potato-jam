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
  'bg-amber-500': props.isDown.value,
  'bg-white': !props.isDown.value && !props.highlighted,
  'bg-amber-300': props.highlighted,
}))

</script>

<template>
  <div 
      class="flex w-6 h-16 text-black min-w-1 justify-center items-center"
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