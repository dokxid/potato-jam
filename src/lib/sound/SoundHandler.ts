// i dont know what to name these help

import * as Tone from "tone";
import Instrument, { DEFAULT_INSTRUMENT, InstrumentID } from "./Instruments"
import { ServerNotePayload, LOCAL_CLIENT_ID, SwitchInstrumentPayload, KeyboardPayload} from "../net/PotatoServer";
import { Optional } from "../TypeUtil";
import PotatoNet, { PotatoPeerId } from "../net/PotatoNet";
import { DEFAULT_KEYBOARD_DATA, Keyboard, KeyboardData, KeyboardID } from "./Keyboard";

/** This payload might come from the user itself or from a remote client */
export type NoteEventPayload = Optional<ServerNotePayload, "id">
export type ClientSwitchInstrumentPayload = Optional<SwitchInstrumentPayload, "id">
export type ClientKeyboardPayload = Optional<KeyboardPayload, "id">

export default class SoundHandler {

    loaded: boolean

    peer_keyboards: Map<PotatoPeerId, Keyboard[]>
    peer_keyboards_data: Map<PotatoPeerId, KeyboardData[]>

    constructor() {
        this.peer_keyboards = new Map<PotatoPeerId, Keyboard[]>();
        this.peer_keyboards_data = new Map<PotatoPeerId, KeyboardData[]>();
        this.loaded = false
    }

    static async init() {
        await Tone.start()
    }

    load_peer_keyboard(peer: PotatoPeerId, keyboard_id: KeyboardID) {
        if (peer === undefined) {
            peer = LOCAL_CLIENT_ID
        }

        console.log(`loading keyboard ${keyboard_id}`)
        
        this.init_peer_keyboards(peer)
        let keyboard_data: KeyboardData = this.peer_keyboards_data.get(peer)[keyboard_id]

        if (keyboard_data === undefined) {
            console.log("keyboard_data undefined??? set it please")
            keyboard_data = DEFAULT_KEYBOARD_DATA
            // this.set_defaults(peer, keyboard_id)
        }

        this.peer_keyboards.get(peer)?.push(new Keyboard(keyboard_data))
        console.log(`pushed keyuboard ${keyboard_data.keyboard_id}`)
        console.log(`keyboards are now ${this.peer_keyboards.get(peer)}`)
    }

    add_peer_keyboard(peer: PotatoPeerId, keyboard_data: KeyboardData) {
        if (peer === undefined) {
            peer = LOCAL_CLIENT_ID
        }

        this.init_peer_keyboards(peer)

        let peer_keyboard_data = this.peer_keyboards_data.get(peer)

        if (peer_keyboard_data === undefined) {
            throw new Error("WHAT???")
        }

        
        if (!keyboard_data.keyboard_id) {
            keyboard_data.keyboard_id = peer_keyboard_data.length || 0
            console.log(`keyboard data keyboard id is undefined setting to ${peer_keyboard_data.length || 0}`)
        }

        console.log(`adding new keyboard ${peer} ${keyboard_data.instrument_id} ${keyboard_data.keyboard_id}`)

        peer_keyboard_data.push(keyboard_data)

        console.log(`keyboard data is now ${this.peer_keyboards_data.get(peer)}`)

        this.load_peer_keyboard(peer, keyboard_data.keyboard_id)
    }

    change_peer_keyboard_instrument(peer: PotatoPeerId, keyboard_id: KeyboardID, instrument_id: InstrumentID) {
        if (peer === undefined) {
            peer = LOCAL_CLIENT_ID
        }

        this.init_peer_keyboards(peer)

        let peer_keyboards = this.peer_keyboards.get(peer)

        if (peer_keyboards === undefined) {
            throw new Error("HELP MEEE")
        }
        if (peer_keyboards[keyboard_id] === undefined) {
            throw new Error("KEYBOARD WHICH YOU TRYING TO CHANGEI NSTRUN IS NOT LOADED")
        }

        peer_keyboards[keyboard_id].set_instrument(instrument_id)
    }

    init_peer_keyboards(peer: PotatoPeerId) {
        if (peer === undefined) {
            peer = LOCAL_CLIENT_ID
        }
        if (this.peer_keyboards.get(peer) === undefined) this.peer_keyboards.set(peer, [])
        if (this.peer_keyboards_data.get(peer) === undefined) this.peer_keyboards_data.set(peer, [])
    }

    set_defaults(peer: PotatoPeerId, keyboard_id: KeyboardID) {
        if (peer === undefined) {
            peer = LOCAL_CLIENT_ID
        }
        this.init_peer_keyboards(peer)

        let keyboards_data = this.peer_keyboards_data.get(peer)
        if (keyboards_data === undefined) {
            throw new Error("i must be asleep or something cuz this is not possible")
        }

        if (keyboards_data[keyboard_id] === undefined) {
            keyboards_data[keyboard_id] = DEFAULT_KEYBOARD_DATA
        }

        if (this.peer_keyboards.size === 0) {
            this.load_peer_keyboard(peer, 0)
        }
    }

    set_loaded() {
        this.loaded = true
    }

    async play(note_event: NoteEventPayload) {
        if(PotatoNet.processing === undefined) return;

        let peer_id = note_event.id || PotatoNet.processing.localId
        this.init_peer_keyboards(peer_id)

        let peer_keyboards = this.peer_keyboards_data.get(peer_id)
        if (peer_keyboards === undefined) {
            throw new Error("PEER HAS NO KEYBOARDS!!")
        }

        let keyboard_id = note_event.keyboard_id
        if (keyboard_id === undefined) {
            throw new Error("KEYBOARD ID IS UNDEFINED!!")
        }

        //let keyboard_data: KeyboardData = peer_keyboards[keyboard_id]
        //this.load_peer_keyboard(peer_id, keyboard_id)

        console.log("peer id " + peer_id)

        if (note_event.event === "pressed")
            this.press(note_event.note, peer_id, keyboard_id)
        else
            this.release(note_event.note, peer_id, keyboard_id)
    }

    async press(pitch: number, peer: PotatoPeerId, keyboard: KeyboardID) {
        let keyboards = this.peer_keyboards.get(peer)

        keyboards[keyboard].press(pitch)
    }

    async release(pitch: number, peer: PotatoPeerId, keyboard: KeyboardID) {
        let keyboards = this.peer_keyboards.get(peer)

        keyboards[keyboard].release(pitch)
    }


}