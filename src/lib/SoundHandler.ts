// i dont know what to name these help

import * as Tone from "tone";
import Instrument, { DEFAULT_INSTRUMENT } from "./Instruments"
import { ServerNotePayload, LOCAL_CLIENT_ID, SwitchInstrumentPayload} from "./net/PotatoServer";
import { Optional } from "./TypeUtil";
import PotatoNet, { PotatoPeerId } from "./net/PotatoNet";

/** This payload might come from the user itself or from a remote client */
export type NoteEventPayload = Optional<ServerNotePayload, "id">
export type ClientSwitchInstrumentPayload = Optional<SwitchInstrumentPayload, "id">

export default class SoundHandler {

    loaded: boolean

    peer_instruments: Map<PotatoPeerId, Instrument>
    peer_instrument_ids: Map<PotatoPeerId, string>

    constructor() {
        this.peer_instruments = new Map<PotatoPeerId, Instrument>();
        this.peer_instrument_ids = new Map<PotatoPeerId, string>();
        this.loaded = false
    }

    static async init() {
        await Tone.start()
    }

    load_peer_instrument(peer: PotatoPeerId): string { // returns peer instrument id as well
        let instrument_id = this.peer_instrument_ids.get(peer)

        if (instrument_id === undefined) {
            console.log("instrument id undefined??? set it please")
            return ""
        }

        if (!this.peer_is_correct_instrument_loaded(peer, instrument_id)) {
            this.peer_instruments.set(peer, Instrument.idInstancer(instrument_id))
        }

        return instrument_id
    }
    set_peer_instrument(peer: PotatoPeerId, instrument_id: string) {
        this.peer_instrument_ids.set(peer, instrument_id)
        this.load_peer_instrument(peer)
    }

    peer_is_any_instrument_loaded(peer: PotatoPeerId) {
        return this.peer_instruments.get(peer) !== undefined
    }
    peer_is_correct_instrument_loaded(peer: PotatoPeerId, correct_instrument_id: string): boolean {
        return this.peer_instruments.get(peer)?.id === correct_instrument_id
    }

    set_loaded() {
        this.loaded = true
    }

    async play(note_event: NoteEventPayload) {
        if(PotatoNet.processing === undefined) return;
        let id = note_event.id || PotatoNet.processing.localId
        this.load_peer_instrument(id); 

        console.log("peer id " + id)

        if (note_event.event === "pressed")
            this.press(note_event.note, id)
        else
            this.release(note_event.note, id)
    }

    async press(pitch: number, peer: string) {
        this.peer_instruments.get(peer)?.press(pitch)
    }

    async release(pitch: number, peer: string) {
        this.peer_instruments.get(peer)?.release(pitch)
    }


}