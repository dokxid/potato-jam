import Instrument, { DEFAULT_INSTRUMENT, InstrumentID } from "./Instruments";

export type KeyboardID = number | undefined

export type KeyboardData = {
    keyboard_id: KeyboardID,
    instrument_id: InstrumentID
}

export const DEFAULT_KEYBOARD_DATA: KeyboardData = {keyboard_id: undefined, instrument_id: DEFAULT_INSTRUMENT}

export class Keyboard {

    keyboard_id: KeyboardID
    instrument_id: InstrumentID
    instrument: Instrument

    constructor(data: KeyboardData) {
        this.keyboard_id = data.keyboard_id
        this.instrument_id = data.instrument_id
        this.instrument = Instrument.idInstancer(this.instrument_id)
    }

    get_serializable_configuration(): KeyboardData {
        return {
            keyboard_id: this.keyboard_id,
            instrument_id: this.instrument_id
        }
    }

    set_instrument(instrument: InstrumentID) {
        this.instrument = Instrument.idInstancer(instrument)
    }

    async press(note: number) {
        await this.instrument.press(note)
    }

    async release(note: number) {
        await this.instrument.release(note)
    }

    async release_all() {
        await this.instrument.release_all()
    }
}