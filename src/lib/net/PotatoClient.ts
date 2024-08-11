import Peer, { DataConnection } from "peerjs";
import { PotatoPeerId, PotatoUser } from "./PotatoNet";
import { ServerPayload, ServerPayloadType } from "./PotatoServer";
import { Optional } from "../TypeUtil";

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

export default class PotatoClient {
    peer: Peer;
    serverId: PotatoPeerId;
    connection: DataConnection;
    connected: {[id: PotatoPeerId]: PotatoUser};
    constructor(peer: Peer, serverId: PotatoPeerId) {
        this.peer = peer;
        this.serverId = serverId;
        this.connected = {};
        this.connection = peer.connect(serverId);
        this.connection.on("open", this.openConnection);
        this.connection.on("close", this.closeConnection);
        this.connection.on("data", this.processData);
    }

    openConnection() {

    }

    closeConnection() {

    }

    payload_funs: {[T in ServerPayloadType]: (payload: ServerPayload<T>) => void} = {
        [ServerPayloadType.CONNECTION_ACCEPTED]: (payload) => {
            for(let user of payload.data.connected) {
                this.connected[user.id] = user;
            }
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