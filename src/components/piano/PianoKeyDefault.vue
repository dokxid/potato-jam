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
  'contrast-150 saturate-150 brightness-150': props.isDown.value,
  'brightness-[.35]': !props.isDown.value && !props.highlighted,
  'h-10 w-3': !props.highlighted,
  'brightness-100 saturate-[.50] h-16 w-5': props.highlighted,
}))

</script>

<template>
  <div 
      class="flex grow font-mono bg-gradient-to-t from-primary from-30% to-secondary to-9fh0% text-black justify-center items-center flex-initial rounded-sm"
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