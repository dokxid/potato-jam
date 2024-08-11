<script setup lang="ts">
import { INSTRUMENT_LIST } from '../lib/Instruments';

const selected = defineModel()
const emit = defineEmits({
    async update_instrument() {
        return true
    }
})

</script>

<template>
    <select v-model="selected" onchange="update_instrument()">
        <option v-for="instrument of INSTRUMENT_LIST" :value="instrument">{{ instrument }}</option>
    </select>
</template>