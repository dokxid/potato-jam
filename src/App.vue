<script setup lang="ts">

import PianoRoll from "./components/PianoRoll.vue";
import Settings from "./components/Settings.vue"

const user_settings = new Map()
user_settings.set("note_min", 0)
user_settings.set("note_max", 36)
user_settings.set("piano_roll_mode", "default")

</script>

<template>
  <Settings v-model="user_settings"/>
  <PianoRoll
      :note_min="user_settings.get('note_min')"
      :note_max="user_settings.get('note_max')"
      :piano_roll_mode="user_settings.get('piano_roll_mode')"
  />
</template>
