import * as Tone from "tone";

export default class Instrument {
    divisions: number = 12
    id: string = "default"
    
    constructor() {
        
    }

    static idInstancer(id: string): Instrument {
        switch (id) {
            case "meow":
                return new meow()
            case "synth":
                return new Synth()
            default:
                return new Instrument()
        }
    }
    get_pitch(pitch: number) {
        return 440*2**((pitch-69)/12)
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
    player: Tone.Player
    public id: string = "meow"

    constructor() {
        super()

        // was trying to use a sampler but it doesnt have playbackRate so,,,,, but gonna leave this in just in case
        /*this.sampler = new Tone.Sampler({
            urls: {
                C4: "meow.ogg"
            },
            release: 1,
            baseUrl: "src/assets",
        }).toDestination()*/
        this.player = new Tone.Player("src/assets/meow.ogg").toDestination()
    }

    get_pitch(pitch: number) {
        return 2**(pitch/this.divisions)
    }

    async press(pitch: number) {
        this.player.playbackRate = this.get_pitch(pitch)
        await this.player.start()
    }
    async release(pitch: number) {
        await this.player.stop()
    }
}

export class Synth extends Instrument {
    synth: Tone.Synth;
    public id: string = "synth"

    constructor() {
        super()

        this.synth = new Tone.Synth().toDestination();
    }

    async press(pitch: number) {
        this.synth.triggerAttack(this.get_pitch(pitch))
        console.log("current pitch in hertz: " + this.get_pitch(pitch))
    }
    async release(pitch: number) {
        this.synth.triggerRelease()
    }
}