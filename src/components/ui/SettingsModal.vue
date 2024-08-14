<script setup lang="ts">

import Settings from "../Settings.vue";

</script>

<template>
  <dialog class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="text-2xl font-bold mb-4">settings</h3>
      <Settings/>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped>

</style>