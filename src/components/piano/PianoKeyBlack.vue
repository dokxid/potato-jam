<script setup lang="ts">
import { computed, Ref } from 'vue';
import SettingsUtil from '../../lib/SettingsUtil';

const props = defineProps<{
  note?: string,
  isDown: Ref<boolean>
}>()
let debug = SettingsUtil.getRef("debug")
const classObject = computed(() => ({
  'bg-amber-300': props.isDown.value,
  'bg-black': !props.isDown.value
}))
</script>

<template>
  <div 
      class="flex w-4 h-10 text-white min-w-1 justify-center items-center"
      :class="classObject">
    <p class="note-name" v-show="debug">{{ note }}</p>
  </div>
</template>

<style scoped>
  .note-name {
    pointer-events: none;
  }
</style>