<script setup lang="ts">
  import PianoRoll from "../piano/PianoRoll.vue";

  import {NoteEventPayload} from "../../lib/SoundHandler.ts";
  import SettingsUtil from "../../lib/SettingsUtil.ts";

  const emit = defineEmits({
    send_key_event(payload: NoteEventPayload) {
      if (SettingsUtil.get('debug')) {
        console.log(payload)
      }
      return true;
    }
  })

</script>
<template>
  <div class="p-5 items-center bg-base-300 rounded-xl flex-auto overflow-x-scroll content-center">
    <PianoRoll class="" @send_key_event="(e) => emit('send_key_event', e)"/>
  </div>
</template>