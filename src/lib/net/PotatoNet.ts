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
    /** Hex */
    color: string,
}

export type IdentifiedPayload = {
    id: PotatoPeerId
}

export default class PotatoNet {
    static peer: Peer;
    static id: Ref<string> = ref("");
    static server?: PotatoServer;
    static client?: PotatoClient;

    static init() {
        this.peer = new Peer();
        this.peer.on("open", (id) => {
            this.id.value = id;
        });
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