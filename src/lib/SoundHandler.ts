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

    instruments: Map<string, Instrument>
    peer_instruments: Map<PotatoPeerId, string>

    constructor() {
        this.instruments = new Map<string, Instrument>()
        this.peer_instruments = new Map<PotatoPeerId, string>();
        this.loaded = false
    }

    static async init() {
        await Tone.start()
    }

    load_peer_instrument(peer: PotatoPeerId): string { // returns peer instrument id as well
        let instrument_id = this.peer_instruments.get(peer)
        
        if (instrument_id === undefined) {
            instrument_id = DEFAULT_INSTRUMENT
        }

        if (!this.is_instrument_loaded(instrument_id)) {
            this.load_instrument(Instrument.idInstancer(instrument_id))
        }

        return instrument_id
    }
    set_peer_instrument(peer: PotatoPeerId, instrument_id: string) {
        this.peer_instruments.set(peer, instrument_id)
        this.load_peer_instrument(peer)
    }

    load_instrument(instrument: Instrument) {
        this.instruments.set(instrument.id, instrument)
    }

    load_instrument_id(id: string) {
        this.load_instrument(Instrument.idInstancer(id))
    }

    is_instrument_loaded(id: string): boolean {
        return this.instruments.has(id)
    }

    set_loaded() {
        this.loaded = true
    }

    async play(note_event: NoteEventPayload) {
        if(PotatoNet.processing === undefined) return;
        let instrument_id: string = this.load_peer_instrument(note_event.id || PotatoNet.processing.localId);

        console.log("instrument id " + instrument_id)

        if (note_event.event === "pressed")
            this.press(note_event.note, instrument_id)
        else
            this.release(note_event.note, instrument_id)
    }

    async press(pitch: number, id: string) {
        this.instruments.get(id)?.press(pitch)
    }

    async release(pitch: number, id: string) {
        this.instruments.get(id)?.release(pitch)
    }


}