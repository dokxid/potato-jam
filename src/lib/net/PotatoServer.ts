import Peer, { DataConnection } from "peerjs"
import { IdentifiedPayload, PotatoPeerId, PotatoUser } from "./PotatoNet"
import { ClientPayload, ClientPayloadData, ClientPayloadType, PotatoClientProcessing } from "./PotatoClient"
import { DEFAULT_KEYBOARD_DATA, Keyboard, KeyboardData, KeyboardID } from "../sound/Keyboard"
import { InstrumentID } from "../sound/Instruments"

// Please make K=V in this enum!!
export enum ServerPayloadType {
    /** S2B: Sent to all clients when a new client connects */ 
    NEW_CONNECTION = "NEW_CONNECTION",
    /** S2C: Sent to a client after their connection was successfully accepted */ 
    CONNECTION_ACCEPTED = "CONNECTION_ACCEPTED",
    /** S2B: Sent to all clients when a client disconnects */
    REMOVED_CONNECTION = "REMOVED_CONNECTION",
    /** S2B: Echoes a client's NOTE_PAYLOAD */
    NOTE_PAYLOAD = "NOTE_PAYLOAD",

    /** S2B: Asks to switch instrument for peer */
    SWITCH_INSTRUMENT_PAYLOAD = "SWITCH_INSTRUMENT_PAYLOAD",

    /** S2B: Creates/deletes keyboards */
    KEYBOARD_PAYLOAD = "KEYBOARD_PAYLOAD"
}

type ServerNewConnectionPayload = IdentifiedPayload & {
    user: PotatoUser
}

type ServerStatePayload = {
    connected: PotatoUser[],
}


export type ServerNotePayload = {
    event: string,
    note: number,
    keyboard_id: KeyboardID
} & IdentifiedPayload

export type SwitchInstrumentPayload = {
    keyboard_id: KeyboardID,
    instrument_id: InstrumentID
} & IdentifiedPayload

export type KeyboardPayload = {
    event: string,
    keyboard_data?: KeyboardData, //keyboard_data if the event is "create", for creating the keyboard from the data
    keyboard_id?: KeyboardID, //keyboard_id if the event is "delete", to delete the keyboard with the specified id
} & IdentifiedPayload

export type ServerPayloadData<T extends ServerPayloadType> = 
    T extends ServerPayloadType.NEW_CONNECTION ? ServerNewConnectionPayload
    : T extends ServerPayloadType.CONNECTION_ACCEPTED ? ServerStatePayload
    : T extends ServerPayloadType.REMOVED_CONNECTION ? IdentifiedPayload
    : T extends ServerPayloadType.NOTE_PAYLOAD ? ServerNotePayload
    : T extends ServerPayloadType.SWITCH_INSTRUMENT_PAYLOAD ? SwitchInstrumentPayload
    : T extends ServerPayloadType.KEYBOARD_PAYLOAD ? KeyboardPayload
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

export const LOCAL_CLIENT_ID = "localPotatoClient";
export const LOCAL_SERVER_ID = "localPotatoServer";
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
            let data = payload.data as ServerNotePayload
            data.id = id;
            this.broadcastExcept(id, ServerPayloadType.NOTE_PAYLOAD, data);
        },
        [ClientPayloadType.SWITCH_INSTRUMENT_PAYLOAD]: (id, payload) => {
            let data = payload.data as SwitchInstrumentPayload
            data.id = id;
            let user = this.connections[id].user
            if (user?.keyboards === undefined) {
                user.keyboards = new Array<KeyboardData>
            }
            console.log(`switching instruments thing is ${user.keyboards[payload.data.keyboard_id]}`)
            if(user) {
                user.keyboards[payload.data.keyboard_id].instrument_id = payload.data.instrument_id;
            }
            this.broadcast(ServerPayloadType.SWITCH_INSTRUMENT_PAYLOAD, data);
        },
        [ClientPayloadType.KEYBOARD_PAYLOAD]: (id, payload) => {
            let data = payload.data as KeyboardPayload
            let event = data.event
            let user = this.connections[id].user
            data.id = id

            console.log(`received keyboard data ${data.keyboard_data}`)

            if (user?.keyboards === undefined)
                user.keyboards = new Array<KeyboardData>

            console.log(`user keyboards is now ${user?.keyboards}`)

            let keyboards = user?.keyboards

            if (keyboards === undefined) {
                console.log("UNDEFINED KEYBOARDS!!!!")
                return
            }

            console.log(`keyboard data keyboard id is ${data.keyboard_data?.keyboard_id}`)

            /*if (data.keyboard_data?.keyboard_id === undefined) {
                data.keyboard_data.keyboard_id = keyboards.length
            }*/

            switch(event) {
                case "create":
                    keyboards.push(data.keyboard_data)
                    break
                case "delete":
                    keyboards[data.keyboard_id] = undefined
                    break
                default:
                    console.log("no event?")
            }

            console.log(`done my thing ${keyboards}`)

            this.broadcast(ServerPayloadType.KEYBOARD_PAYLOAD, data)
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