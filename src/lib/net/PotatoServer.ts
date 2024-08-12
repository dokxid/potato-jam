import Peer, { DataConnection } from "peerjs"
import { IdentifiedPayload, PotatoPeerId, PotatoUser } from "./PotatoNet"
import { ClientPayload, ClientPayloadData, ClientPayloadType, PotatoClientProcessing } from "./PotatoClient"

// Please make K=V in this enum!!
export enum ServerPayloadType {
    /** S2B: Sent to all clients when a new client connects */ 
    NEW_CONNECTION = "NEW_CONNECTION",
    /** S2C: Sent to a client after their connection was successfully accepted */ 
    CONNECTION_ACCEPTED = "CONNECTION_ACCEPTED",
    /** S2B: Sent to all clients when a client disconnects */
    REMOVED_CONNECTION = "REMOVED_CONNECTION",
    /** S2B: Echoes a client's NOTE_PAYLOAD */
    NOTE_PAYLOAD = "NOTE_PAYLOAD"
}

type ServerNewConnectionPayload = IdentifiedPayload & {
    user: PotatoUser
}

type ServerStatePayload = {
    connected: PotatoUser[],
}

export type ServerPayloadData<T extends ServerPayloadType> = 
    T extends ServerPayloadType.NEW_CONNECTION ? ServerNewConnectionPayload
    : T extends ServerPayloadType.CONNECTION_ACCEPTED ? ServerStatePayload
    : T extends ServerPayloadType.REMOVED_CONNECTION ? IdentifiedPayload
    : T extends ServerPayloadType.NOTE_PAYLOAD ? ClientPayloadData<ClientPayloadType.NOTE_PAYLOAD>
    : undefined

/**
 * A payload sent by the server to the clients
 */
export type ServerPayload<T extends ServerPayloadType> = {
    type: T
    data: ServerPayloadData<T>
}

type ServerConnectionInfo = {
    connection?: DataConnection;
    user?: PotatoUser;
}

const LOCAL_CLIENT_ID = "localPotatoClient";
const LOCAL_SERVER_ID = "localPotatoServer";
export default class PotatoServer {
    peer: Peer;
    connections: {[id: PotatoPeerId]: ServerConnectionInfo};
    localClient: PotatoClientProcessing;

    constructor(peer: Peer) {
        this.peer = peer;
        this.connections = {};
        this.peer.on("connection", (conn) => {
            const id = conn.peer;
            if(id == LOCAL_CLIENT_ID) {
                console.warn(`Evil connection trying to be the local client!!`)
                conn.close();
                return;
            }
            console.log("Got connection from " + id)
            conn.on("data", (data) => {
                this.processData(id, data)
            })
            conn.on("close", () => {
                delete this.connections[id];
                this.closeConnection(id);
            })
            conn.on("open", async () => {
                console.log("Open " + id)
                this.connections[id] = {
                    connection: conn
                };
            })
        })
        let localClient = new PotatoClientProcessing(LOCAL_SERVER_ID, LOCAL_CLIENT_ID, async (type, data) => {
            let payload: ClientPayload<typeof type> = {
                type, data
            } 
            return this.processData(LOCAL_CLIENT_ID, payload);
        })
        this.localClient = localClient;
        this.connections[LOCAL_CLIENT_ID] = {}
        this.localClient.openConnection();
    }

    async send<T extends ServerPayloadType>(id: PotatoPeerId, type: T, data: ServerPayloadData<T>) {
        let peer = this.connections[id];
        if(peer === undefined) {
            console.warn(`Trying to send data to ${id} but it is not connected!`);
            return false;
        }
        const payload: ServerPayload<T> = {
            type,
            data
        }
        if(id == LOCAL_CLIENT_ID) {
            this.localClient.processData(payload);
            return true;
        }
        // pls only non nullable after you've checked for local client :)
        await (peer.connection as NonNullable<typeof peer["connection"]>).send(payload);
        return true;
    }

    broadcast<T extends ServerPayloadType>(type: T, data: ServerPayloadData<T>) {
        let promises = [];
        for(let id in this.connections) {
            promises.push(this.send(id, type, data));
        }
        return Promise.allSettled(promises);
    }

    broadcastExcept<T extends ServerPayloadType>(except: PotatoPeerId, type: T, data: ServerPayloadData<T>) {
        let promises = [];
        for(let id in this.connections) {
            if(id == except) continue;
            promises.push(this.send(id, type, data));
        }
        return Promise.allSettled(promises)
    }


    getState(): ServerStatePayload {
        let connected: PotatoUser[] = [];
        for(let id in this.connections) {
            let connection = this.connections[id]
            if(connection.user === undefined) continue;
            connected.push(connection.user);
        }
        return {
            connected
        }
    }

    // the client is in this.connections at this point!
    openConnection(id: PotatoPeerId, payload: ClientPayloadData<ClientPayloadType.IDENTIFY>) {
        let peer = this.connections[id]
        if(peer === undefined) {
            console.warn(`Recieved IDENTIFY but ${id} has no connection info!`)
            return
        }
        let user = payload as PotatoUser
        user.id = id
        peer.user = user
        return Promise.allSettled([
            this.send(id, ServerPayloadType.CONNECTION_ACCEPTED, this.getState()),
            this.broadcastExcept(id, ServerPayloadType.NEW_CONNECTION, { id, user }),
        ]);
    }

    // by this point the client is already disconnected and not in this.connections
    closeConnection(id: PotatoPeerId) {
        this.broadcast(ServerPayloadType.REMOVED_CONNECTION, { id })
    }

    payload_funs: {[T in ClientPayloadType]: (id: PotatoPeerId, payload: ClientPayload<T>) => void} = {
        [ClientPayloadType.IDENTIFY]: (id, payload) => {
            this.openConnection(id, payload.data);
        },
        [ClientPayloadType.NOTE_PAYLOAD]: (id, payload) => {
            // todo: please check payload.data to protect against EVIl people!!
            this.broadcastExcept(id, ServerPayloadType.NOTE_PAYLOAD, payload.data);
        }
    }

    processData(id: PotatoPeerId, data: unknown) {
        if(data === null || data === undefined) {
            console.warn(`Got ${data} from ${id}!`)
            return;
        }
        console.log("server got", data)
        if(typeof(data) !== "object") {
            console.warn(`Received unknown data type from ${id}! Expected "object" got "${typeof(data)}"`)
            return;
        }
        let payload = data as ClientPayload<ClientPayloadType>
        let type = payload.type;
        let fun = this.payload_funs[type] as (id: PotatoPeerId, payload: any) => void;
        if(fun === undefined) throw new Error(`Unknown client payload type received ${type}!`);
        fun(id, payload);
    }
}