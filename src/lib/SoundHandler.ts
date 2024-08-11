// i dont know what to name these help

import * as Tone from "tone";
import Instrument from "./Instruments"

export default class SoundHandler {
    
    loaded: boolean
    instruments: Map<string, Instrument>

    constructor() {
        this.instruments = new Map<string, Instrument>()
        this.loaded = false
    }

    async init() {
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
        console.log(this.is_instrument_loaded(id))

        if (!this.is_instrument_loaded(id)) {
            await this.load_instrument(Instrument.idInstancer(id))
        }
        console.log(this.instruments.get(id))

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