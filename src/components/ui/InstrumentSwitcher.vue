<script setup lang="ts">
import {INSTRUMENT_LIST} from '../../lib/sound/Instruments.ts';

const selected = defineModel()
const emit = defineEmits({
  update_instrument() {
    return true
  }
})

</script>

<template>
  <select v-model="selected" @onchange="$emit('update_instrument')">
    <option v-for="instrument of INSTRUMENT_LIST" :value="instrument">{{ instrument }}</option>
  </select>
</template>