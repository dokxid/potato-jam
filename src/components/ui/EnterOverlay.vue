<script setup lang="ts">
const started = defineModel()
const emit = defineEmits(['initSoundHandler'])
</script>

<template>
  <div v-show="!started" class="absolute flex bg-base-200 h-full w-full bg-opacity-95 justify-center items-center z-50">
    <div class="flex flex-col gap-16 items-center">
      <h1 class="text-6xl font-semibold"><b
          class="font-extrabold bg-gradient-to-br from-primary to-secondary text-primary-content text-7xl pl-5 pr-3">potato_JAM</b>
        🥔</h1>
      <button
          class="btn btn-gradient h-16 rounded-full w-52 max-w-lg font-bold"
          @click="$emit('initSoundHandler')">
        open lobby,,,
      </button>
      <div class="w-full items-start">
        <p class="text-xs font-mono">note: this will play audio,,,</p>
        <p class="text-xs font-mono">built with love by @littletsu @noden @dokxid</p>
        <p class="text-xs font-mono">repo:
          <a href="https://github.com/dokxid/potato-jam" class="underline">github.com/dokxid/potato-jam</a>
        </p>
      </div>
    </div>
  </div>
</template>