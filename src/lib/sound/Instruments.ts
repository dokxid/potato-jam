import * as Tone from "tone";

export const INSTRUMENT_LIST = [
    "meow",
    "synth",
    "rhodes",
    "piano"
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
            case "rhodes":
                return new Rhodes()
            case "piano":
                return new Piano()
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

export class Rhodes extends Instrument {
    public id: string = "rhodes"
    sampler: Tone.Sampler

    constructor() {
        super()

        this.octave = 6

        this.sampler = new Tone.Sampler({
            urls: {
                C3: "Rhodes_C3.ogg", 
                E3: "Rhodes_E3.ogg", 
                "G#3": "Rhodes_Gs3.ogg", 
                C4: "Rhodes_C4.ogg", 
                E4: "Rhodes_E4.ogg", 
                "G#4": "Rhodes_Gs4.ogg", 
                C5: "Rhodes_C5.ogg", 
                E5: "Rhodes_E5.ogg", 
                "G#5": "Rhodes_Gs5.ogg", 
                C6: "Rhodes_C6.ogg", 
                E6: "Rhodes_E6.ogg", 
                "G#6": "Rhodes_Gs6.ogg", 
                C7: "Rhodes_C7.ogg", 
                E7: "Rhodes_E7.ogg", 
                "G#7": "Rhodes_Gs7.ogg",
                C8: "Rhodes_C8.ogg",
            },
            release: 0.2,
            baseUrl: "/potato-jam/instruments/rhodes/",
            onload: () => {
                this.unlock()
            }
        }).toDestination()

        this.sampler.volume.value = this.volume 
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

export class Piano extends Instrument {
    public id: string = "piano"
    sampler: Tone.Sampler

    constructor() {
        super()

        this.sampler = new Tone.Sampler({
            urls: {
                C3: "Piano_C3.ogg", 
                E3: "Piano_E3.ogg", 
                "G#3": "Piano_Gs3.ogg", 
                C4: "Piano_C4.ogg", 
                E4: "Piano_E4.ogg", 
                "G#4": "Piano_Gs4.ogg", 
                C5: "Piano_C5.ogg", 
                E5: "Piano_E5.ogg", 
                "G#5": "Piano_Gs5.ogg", 
                C6: "Piano_C6.ogg", 
                E6: "Piano_E6.ogg", 
                "G#6": "Piano_Gs6.ogg", 
                C7: "Piano_C7.ogg", 
                E7: "Piano_E7.ogg", 
                "G#7": "Piano_Gs7.ogg",
            },
            release: 0.2,
            baseUrl: "/potato-jam/instruments/piano/",
            onload: () => {
                this.unlock()
            }
        }).toDestination()

        this.sampler.volume.value = this.volume
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