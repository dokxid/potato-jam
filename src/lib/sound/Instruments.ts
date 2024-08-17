import * as Tone from "tone";

export const INSTRUMENT_LIST = [
    "meow",
    "synth",
    "rhodes"
]
export const DEFAULT_INSTRUMENT: string = INSTRUMENT_LIST[0]

export type InstrumentID = string

export default class Instrument {
    divisions: number = 12
    octave: number = 4
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
            case "rhodes":
                return new Rhodes()
            default:
                return new Instrument()
        }
    }
    get_pitch(pitch: number) {
        return 440*2**(((pitch+this.octave * this.divisions) - 69)/12)
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
                C3: "meow.ogg"
            },
            release: 1,
            baseUrl: "/potato-jam/instruments/",
            onload: () => {
                this.unlock()
            }
        }).toDestination()
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

export class Rhodes extends Instrument {
    public id: string = "rhodes"
    sampler: Tone.Sampler

    constructor() {
        super()

        this.octave = 6

        this.sampler = new Tone.Sampler({
            urls: {
                C3: "Rhodes_C3_91.ogg", 
                E3: "Rhodes_E3_91.ogg", 
                "G#3": "Rhodes_Gs3_91.ogg", 
                C4: "Rhodes_C4_91.ogg", 
                E4: "Rhodes_E4_91.ogg", 
                "G#4": "Rhodes_Gs4_91.ogg", 
                C5: "Rhodes_C5_91.ogg", 
                E5: "Rhodes_E5_91.ogg", 
                "G#5": "Rhodes_Gs5_91.ogg", 
                C6: "Rhodes_C6_91.ogg", 
                E6: "Rhodes_E6_91.ogg", 
                "G#6": "Rhodes_Gs6_91.ogg", 
                C7: "Rhodes_C7_91.ogg", 
                E7: "Rhodes_E7_91.ogg", 
                "G#7": "Rhodes_Gs7_91.ogg",
            },
            release: 0.2,
            baseUrl: "/potato-jam/instruments/rhodes/",
            onload: () => {
                this.unlock()
            }
        }).toDestination()
    }

    async press(pitch: number) {
        if (this.locked)
            return
        await this.sampler.triggerAttack(this.get_pitch(pitch))
    }
    async release(pitch: number) {
        if (this.locked)
            return
        await this.sampler.triggerRelease(this.get_pitch(pitch))
    }
    async release_all(){
        if (this.locked)
            return
        await this.sampler.releaseAll()
    }
}