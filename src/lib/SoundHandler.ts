// i dont know what to name these help

import * as Tone from "tone";
import Instrument from "./Instruments"
import { ServerNotePayload } from "./net/PotatoServer";
import { Optional } from "./TypeUtil";

/** This payload might come from the user itself or from a remote client */
export type NoteEventPayload = Optional<ServerNotePayload, "id">

export default class SoundHandler {

    loaded: boolean
    instruments: Map<string, Instrument>

    constructor() {
        this.instruments = new Map<string, Instrument>()
        this.loaded = false
    }

    static async init() {
        await Tone.start()
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

    async play(event: string, pitch: number, id: string) {
        if (!this.is_instrument_loaded(id)) {
            await this.load_instrument(Instrument.idInstancer(id))
        }

        if (event === "pressed")
            this.press(pitch, id)
        else
            this.release(pitch, id)
    }

    async press(pitch: number, id: string) {
        this.instruments.get(id)?.press(pitch)
    }

    async release(pitch: number, id: string) {
        this.instruments.get(id)?.release(pitch)
    }


}