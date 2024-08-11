<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PotatoNet from '../lib/net/PotatoNet';

let connectId = ref("");

async function init() {
    await PotatoNet.init()
}

function initServer() {
    PotatoNet.initServer();
}

function initClient() {
    PotatoNet.initClient(connectId.value);
}

onMounted(init)
</script>

<template>
    Your room id: {{ PotatoNet.id }}
    <button @click="initServer" class="btn btn-accent">Init server</button><br>
    <input placeholder="connect id" v-model="connectId">
    <button @click="initClient" class="btn btn-accent">Init client</button>
</template>