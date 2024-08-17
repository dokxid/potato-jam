import * as Tone from "tone";

export const INSTRUMENT_LIST = [
    "meow",
    "synth"
]
export const DEFAULT_INSTRUMENT: string = INSTRUMENT_LIST[0]

export type InstrumentID = string

export default class Instrument {
    divisions: number = 12
    octave: number = 4
    volume: number = -6

    locked: boolean = true
    id: string = "default"

    unlock() {
        this.locked = false
    }
    
    constructor() {
        
    }

    static idInstancer(id: string): Instrument {
        switch (id) {
            case "meow":
                return new meow()
            case "synth":
                return new PolySynth()
            default:
                return new Instrument()
        }
    }
    get_pitch(pitch: number) {
        return 440*2**(((pitch+this.octave * this.divisions) - 69)/this.divisions)
    }

    set_divisions(divisions: number) {
        this.divisions = divisions
    }
    
    async press(_pitch: number) {

    }
    async release(_pitch: number) {

    }

    async release_all() {

    }
}

export class meow extends Instrument {
    public id: string = "meow"
    sampler: Tone.Sampler

    constructor() {
        super()

        // woops i thought it did something completely different this does fit
        this.sampler = new Tone.Sampler({
            urls: {
                C4: "meow.ogg"
            },
            release: 1,
            baseUrl: "/potato-jam/instruments/",
            onload: () => {
                this.unlock()
            }
        }).toDestination()

        this.sampler.volume.value = this.volume
    }

    async press(pitch: number) {
        if (this.locked)
            return
        await console.log("pressed")
        await this.sampler.triggerAttack(this.get_pitch(pitch))
    }
    async release(pitch: number) {
        if (this.locked)
            return
        await console.log("released")
        await this.sampler.triggerRelease(this.get_pitch(pitch))
    }
    async release_all(){
        if (this.locked)
            return
        await this.sampler.releaseAll()
    }
}

export class PolySynth extends Instrument {
    public id: string = "synth"
    polysynth: Tone.PolySynth

    constructor() {
        super()

        this.polysynth = new Tone.PolySynth().toDestination()
        this.polysynth.volume.value = this.volume

        this.unlock()
    }

    async press(pitch: number) {
        if (this.locked)
            return
        await this.polysynth.triggerAttack(this.get_pitch(pitch))
    }
    async release(pitch: number) {
        if (this.locked)
            return
        await this.polysynth.triggerRelease(this.get_pitch(pitch))
    }
    async release_all() {
        if (this.locked)
            return
        await this.polysynth.releaseAll()
    }
}