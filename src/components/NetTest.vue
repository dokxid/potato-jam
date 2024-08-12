<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref } from 'vue';
import PotatoNet from '../lib/net/PotatoNet';
import PotatoClient, { PotatoClientProcessing } from '../lib/net/PotatoClient';
import PotatoServer from '../lib/net/PotatoServer';

let url = new URL(window.location.href)
let urlRoom = url.searchParams.get("room") || "";
let roomId = ref("");
let processing: Ref<PotatoClientProcessing | null> = ref(null)
let connectId = ref("");

function panic(msg: string) {
    console.warn(msg) // This should be shown to the user somehow after the location is replaced,,
    window.location.replace("/");
}

async function accepted() {
    if(!processing.value) {
        return panic("Accepted without processing?!?!")
    }
    roomId.value = urlRoom
    window.history.replaceState(roomId.value, roomId.value, `/?room=${roomId.value}`)
}

let server: PotatoServer | undefined;
let client: PotatoClient | undefined;
async function init() {
    if(processing.value) return;
    await PotatoNet.init();
    if(urlRoom === "") {
        server = await PotatoNet.initServer();
        urlRoom = server.peer.id;
        processing.value = server.localClient;
    } else {
        client = await PotatoNet.initClient(urlRoom);
        processing.value = client.processing;
    }
    processing.value.on("connectionClosed", () => {
        panic("Connection closed!")
    })
    if(!processing.value.accepted) {
        setInterval(() => {
            if(!processing.value?.accepted) {
                panic("Server did not respond!");
            }
        }, 2000)
        processing.value.once("accepted", () => accepted())
    } else {
        accepted()
    }
}

async function unmounted() {
    if(server) {
        server.peer.destroy();
    }
    if(client) {
        client.peer.destroy();
    }
}

function copyRoomLink() {
    if(!processing) return;
    navigator.clipboard.writeText(window.location.href)
}

onMounted(init)
onUnmounted(unmounted)
</script>

<template>
    Room: <b><button id="copyRoomLink" class="btn btn-link" @click="copyRoomLink">{{ roomId || "Connecting..." }}</button></b>
    <div class="flex" v-if="processing !== null">
        <div v-for="user in processing.connected">
            <img :src="user.icon" width="64" height="64">
            <span :style="{color: user.color}">{{ user.display_name }}</span>
        </div>
    </div>
</template>

<style scoped>
    #copyRoomLink {
        padding: 0;
    }
</style>