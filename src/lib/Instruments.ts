import * as Tone from "tone";

export default class Instrument {
    divisions: number = 12
    octave: number = 4
    id: string = "default"
    
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
        return 440*2**(((pitch+this.octave * this.divisions) - 69)/12)
    }

    set_divisions(divisions: number) {
        this.divisions = divisions
    }
    
    async press(pitch: number) {

    }
    async release(pitch: number) {

    }
}

export class meow extends Instrument {
    sampler: Tone.Sampler
    public id: string = "meow"

    constructor() {
        super()

        // woops i thought it did something completely different this does fit
        this.sampler = new Tone.Sampler({
            urls: {
                C4: "meow.ogg",
            },
            release: 1,
            baseUrl: "src/assets/"
        }).toDestination()
    }

    async press(pitch: number) {
        await this.sampler.triggerAttack(this.get_pitch(pitch))
    }
    async release(pitch: number) {
        await this.sampler.triggerRelease(this.get_pitch(pitch))
    }
}

export class PolySynth extends Instrument {
    public id: string = "synth"
    polysynth: Tone.PolySynth

    constructor() {
        super()

        this.polysynth = new Tone.PolySynth().toDestination()
    }

    async press(pitch: number) {
        await this.polysynth.triggerAttack(this.get_pitch(pitch))
    }
    async release(pitch: number) {
        await this.polysynth.triggerRelease(this.get_pitch(pitch))
    }
}