import Peer from "peerjs";
import { Ref, ref } from "vue";
import PotatoServer from "./PotatoServer";
import PotatoClient from "./PotatoClient";

/** 
 * Must be the DataConnection's .peer on the server.
*/ 
export type PotatoPeerId = string

/** Information about an user connected to a server */
export type PotatoUser = {
    id: PotatoPeerId,
    display_name: string,
    /** Image URL */
    icon: string,
    /** A valid css color */
    color: string,
}

export type IdentifiedPayload = {
    id: PotatoPeerId
}

function dec2hex (dec: number) {
    return dec.toString(16).padStart(2, "0")
}

const potato = ["jam", "milk", "meatball", "pizza", "casserole", "salad", "hash", "beef", "dinner", "cake", "pancakes", "chili", "pie", "soup", "fries", "steak", "rolls", "starch", "gaming", "music"]
function generateId(): PotatoPeerId {
    var arr = new Uint8Array((8) / 2)
    window.crypto.getRandomValues(arr)
    return `potato-${potato[arr[0] % potato.length]}-${Array.from(arr, dec2hex).join('')}`
}

export default class PotatoNet {
    static peer: Peer;
    static id: Ref<string> = ref("");
    static server?: PotatoServer;
    static client?: PotatoClient;

    static init() {
        return new Promise<void>((res) => {
            this.peer = new Peer(generateId(), {
                config: {
                    iceServers: [
                        { urls: "stun:stun.l.google.com:19302" },
                        {
                            urls: 'turn:openrelay.metered.ca:80',
                            username: 'openrelayproject',
                            credential: 'openrelayproject'
                        }                    
                    ],
                    sdpSemantics: "unified-plan"
                }
            });
            this.peer.on("open", (id) => {
                this.id.value = id;
                res();
            });
        })
    }
    static initServer() {
        this.server = new PotatoServer(this.peer);
        return this.server;
    }
    static initClient(serverId: PotatoPeerId) {
        this.client = new PotatoClient(this.peer, serverId);
        return this.client;
    }
}