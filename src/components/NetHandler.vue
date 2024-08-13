<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref } from 'vue';
import PotatoNet from '../lib/net/PotatoNet';
import PotatoClient, { PotatoClientProcessing } from '../lib/net/PotatoClient';
import PotatoServer, { ServerNotePayload } from '../lib/net/PotatoServer';
import SoundHandler, { ClientSwitchInstrumentPayload, NoteEventPayload } from '../lib/SoundHandler';
import MainEventHandler from '../lib/MainEventHandler';
import { DEFAULT_INSTRUMENT } from '../lib/Instruments';

let url = new URL(window.location.href)
let urlRoom = url.searchParams.get("room") || "";
let roomId = ref("");
let processingRef: Ref<PotatoClientProcessing | null> = ref(null)
// let connectId = ref("");

function panic(msg: string) {
    console.warn(msg) // This should be shown to the user somehow after the location is replaced,,
    window.location.replace(window.location.pathname);
}

async function accepted() {
    let processing = processingRef.value
    console.log(":HELLOAS")
    if(!processing) {
        return panic("Accepted without processing?!?!")
    }
    roomId.value = urlRoom
    window.history.replaceState(roomId.value, roomId.value, `?room=${roomId.value}`)
    processing.on("notePayload", (event) => {
        //props.push_payload(event);
        MainEventHandler.sendNotePayload(event);
    })
    processing.on("switchInstrumentPayload", (event) => {
        MainEventHandler.sendRemoteSwitchInstrumentPayload(event);
    })

    console.log(processing.connected)

    for(let id in processing.connected) {
        let user = processing.connected[id];
        let instrument = user.instrument || DEFAULT_INSTRUMENT

        console.log(id, instrument)

        MainEventHandler.sendRemoteSwitchInstrumentPayload({
            id,
            instrument_id: instrument
        })
    }
    // When a key is pressed by the user
    MainEventHandler.on("userNotePayload", (payload) => {
        processing.sendNotePayload(payload);
    });
    // When instrument is changed by the user
    MainEventHandler.on("userSwitchInstrumentPayload", (payload) => {
        processing.sendSwitchInstrumentPayload(payload);
    })
}

let server: PotatoServer | undefined;
let client: PotatoClient | undefined;
async function init() {
    if(processingRef.value) return;
    await PotatoNet.init();
    if(urlRoom === "") {
        server = await PotatoNet.initServer();
        urlRoom = server.peer.id;
        processingRef.value = server.localClient;
    } else {
        client = await PotatoNet.initClient(urlRoom);
        processingRef.value = client.processing;
    }
    let processing = processingRef.value
    processing.on("connectionClosed", () => {
        panic("Connection closed!")
    })
    if(!processing.accepted) {
        setInterval(() => {
            if(!processing.accepted) {
                panic("Server did not respond!");
            }
        }, 10000)
        processing.once("accepted", () => accepted())
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
    if(!processingRef) return;
    navigator.clipboard.writeText(window.location.href)
}

onMounted(init)
onUnmounted(unmounted)
</script>

<template>
    Room: <b><button id="copyRoomLink" class="btn btn-link" @click="copyRoomLink">{{ roomId || "Connecting..." }}</button></b>
    <div class="flex" v-if="processingRef !== null">
        <div v-for="user in processingRef.connected">
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