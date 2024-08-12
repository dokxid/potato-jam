import Peer, { DataConnection } from "peerjs";
import { PotatoPeerId, PotatoUser } from "./PotatoNet";
import { ServerPayload, ServerPayloadType } from "./PotatoServer";
import { Optional } from "../TypeUtil";
import SettingsUtil from "../SettingsUtil";
import { reactive } from "vue";
import EventEmitter from "eventemitter3";

// Please make K=V in this enum!!
export enum ClientPayloadType {
    /** C2S: Sent to the server to give it information about the client */
    IDENTIFY = "IDENTIFY",
}

export type ClientPayloadData<T extends ClientPayloadType> = 
    T extends ClientPayloadType.IDENTIFY ? Optional<PotatoUser, "id">
    : undefined

/**
 * A payload sent by the client to the server
 */
export type ClientPayload<T extends ClientPayloadType> = {
    type: T
    data: ClientPayloadData<T>
}

type ClientSender = <T extends ClientPayloadType>(type: T, data: ClientPayloadData<T>) => Promise<any>
type PotatoClientEvents = {
    "connectionClosed": () => {}
    "connectionOpen": () => {}
    "accepted": () => {}
}
export class PotatoClientProcessing extends EventEmitter<PotatoClientEvents> {
    connected: {[id: PotatoPeerId]: PotatoUser};
    serverId: PotatoPeerId;
    localId: PotatoPeerId;
    send: ClientSender;
    accepted: boolean;

    constructor(serverId: PotatoPeerId, localId: PotatoPeerId, sender: ClientSender) {
        super()
        this.serverId = serverId;
        this.localId = localId;
        this.accepted = false;
        this.send = sender;
        this.connected = reactive({});
    }

    async openConnection() {
        console.log("Connection open to server!")
        this.emit("connectionOpen");
        await this.identify();
    }

    closeConnection() {
        this.emit("connectionClosed");
    }

    async identify() {
        let user = SettingsUtil.get("user");
        await this.send(ClientPayloadType.IDENTIFY, {
            display_name: user.display_name,
            icon: user.icon,
            color: user.color
        })
    }

    payload_funs: {[T in ServerPayloadType]: (payload: ServerPayload<T>) => void} = {
        [ServerPayloadType.CONNECTION_ACCEPTED]: (payload) => {
            for(let user of payload.data.connected) {
                this.connected[user.id] = user;
            }
            this.accepted = true;
            this.emit("accepted");
        },
        [ServerPayloadType.NEW_CONNECTION]: (payload) => {
            this.connected[payload.data.id] = payload.data.user;
        },
        [ServerPayloadType.REMOVED_CONNECTION]: (payload) => {
            delete this.connected[payload.data.id];
        }
    }

    processData(data: unknown) {
        if(data === null || data === undefined) {
            console.warn(`Got ${data} from server ${this.serverId}!`)
            return;
        }
        console.log(data)
        if(typeof(data) !== "object") {
            console.warn(`Received unknown data type from server ${this.serverId}! Expected "object" got "${typeof(data)}"`)
            return;
        }
        let payload = data as ServerPayload<ServerPayloadType>
        let type = payload.type;
        let fun = this.payload_funs[type] as (payload: any) => void;
        if(fun === undefined) throw new Error(`Unknown server payload type received ${type}!`);
        fun(payload);
    }
}

export default class PotatoClient {
    peer: Peer;
    serverId: PotatoPeerId;
    connection: DataConnection;
    processing: PotatoClientProcessing;
    constructor(peer: Peer, serverId: PotatoPeerId) {
        this.peer = peer;
        this.serverId = serverId;
        this.connection = peer.connect(serverId);
        this.processing = new PotatoClientProcessing(serverId, peer.id, (t, d) => this.send(t,d))
        this.connection.on("open", () => this.processing.openConnection());
        this.connection.on("close", () => this.processing.closeConnection());
        this.connection.on("data", (data) => this.processing.processData(data));
    }

    async send<T extends ClientPayloadType>(type: T, data: ClientPayloadData<T>) {
        if(!this.connection.open) {
            console.warn(`Connection to server is closed!`, type, data)
            return false;
        }
        const payload: ClientPayload<T> = {
            type,
            data
        } 
        await this.connection.send(payload);
        return true;
    }
}